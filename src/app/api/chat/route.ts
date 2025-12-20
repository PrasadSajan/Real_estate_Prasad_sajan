import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json();

        console.log("Chat API Request Received");

        if (!process.env.GEMINI_API_KEY) {
            console.error("DEBUG: GEMINI_API_KEY is missing in process.env");
            return NextResponse.json({ text: "Error: API Key not configured." }, { status: 500 });
        } else {
            console.log("DEBUG: GEMINI_API_KEY is present (Length: " + process.env.GEMINI_API_KEY.length + ")");
        }

        // 1. Fetch Context (Active Properties)
        console.log("DEBUG: Fetching properties from Supabase...");
        const { data: properties, error } = await supabase
            .from('properties')
            .select('id, title, price, location, type, description')
            .limit(50); // Limit context for safety/speed

        if (error) {
            console.error('DEBUG: Supabase Error:', JSON.stringify(error));
            return NextResponse.json({ text: "I'm having trouble accessing our listings right now." }, { status: 500 });
        }
        console.log(`DEBUG: Fetched ${properties?.length} properties.`);

        // 2. Construct System Prompt
        const listingsContext = properties?.map(p => {
            // Ensure we provide a clean numeric value for the AI to understand "under 10 lakhs"
            const rawPrice = parseInt(p.price.toString().replace(/[^0-9]/g, '') || '0');
            return `- ${p.title} (${p.type}): ₹${p.price}, Location: ${p.location}. (RawValue: ${rawPrice}). Desc: ${p.description.substring(0, 100)}...`;
        }).join('\n') || "No properties currently listed.";

        const systemPrompt = `
      You are a friendly and professional Real Estate Concierge for 'Real Estate Broker' agency.
      Your goal is to help users find properties from our inventory.
      
      HERE IS OUR CURRENT INVENTORY:
      ${listingsContext}

      RULES:
      1. ONLY recommend properties from the list above. If a user asks for something we don't have, say "I don't see anything like that right now, but please contact us on WhatsApp (+91 86682 14431) for upcoming listings."
      2. FORMATTING RULES (CRITICAL):
         - ALWAYS use **Bullet Points** for list items.
         - **Bold** the Property Title and Price.
         - Keep descriptions short (1 sentence max).
         - Use polite, professional spacing.
      3. Prices are in Indian Rupees (₹).
      4. If asked about contact info, provide the WhatsApp number: +91 86682 14431.
      5. Do not invent properties.
      6. LANGUAGE ADAPTATION: Always reply in the same language the user uses. If the user asks in Marathi, you MUST reply in Marathi (Devanagari script), while keeping property details (like prices/names) accurate.
      
      User Message: ${message}
    `;

        // 3. Call Gemini
        console.log("DEBUG: Calling Gemini API...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();
        console.log("DEBUG: Gemini Response received.");

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error('DEBUG: Chat API Error:', error);
        return NextResponse.json({ text: `System Error: ${error.message || "Unknown"}` }, { status: 500 });
    }
}
