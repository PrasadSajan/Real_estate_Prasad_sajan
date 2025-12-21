export const formatPrice = (price: string | number): string => {
    if (!price) return '';

    // If it already contains non-numeric characters (like '₹' or 'Lakh'), return as is (legacy support)
    // unless we want to try parsing it. For now, let's assume new entries are numeric strings.
    const stringPrice = price.toString();
    if (/[^0-9.]/.test(stringPrice)) {
        return stringPrice;
    }

    const numberPrice = parseFloat(stringPrice);
    if (isNaN(numberPrice)) return stringPrice;

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(numberPrice);
};
