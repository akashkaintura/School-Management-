export enum Currency {
    INR = 'INR',
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    CNY = 'CNY',
    JPY = 'JPY',
    IDR = 'IDR',
    NPR = 'NPR',
    AUD = 'AUD',
    CAD = 'CAD'
}

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
    [Currency.INR]: '₹',
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
    [Currency.CNY]: '¥',
    [Currency.JPY]: '¥',
    [Currency.IDR]: 'Rp',
    [Currency.NPR]: 'रू',
    [Currency.AUD]: 'A$',
    [Currency.CAD]: 'C$'
};

export const CURRENCY_NAMES: Record<Currency, string> = {
    [Currency.INR]: 'Indian Rupee',
    [Currency.USD]: 'US Dollar',
    [Currency.EUR]: 'Euro',
    [Currency.GBP]: 'British Pound',
    [Currency.CNY]: 'Chinese Yuan',
    [Currency.JPY]: 'Japanese Yen',
    [Currency.IDR]: 'Indonesian Rupiah',
    [Currency.NPR]: 'Nepalese Rupee',
    [Currency.AUD]: 'Australian Dollar',
    [Currency.CAD]: 'Canadian Dollar'
};

export interface CurrencyOption {
    code: Currency;
    symbol: string;
    name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
    { code: Currency.INR, symbol: CURRENCY_SYMBOLS[Currency.INR], name: CURRENCY_NAMES[Currency.INR] },
    { code: Currency.USD, symbol: CURRENCY_SYMBOLS[Currency.USD], name: CURRENCY_NAMES[Currency.USD] },
    { code: Currency.EUR, symbol: CURRENCY_SYMBOLS[Currency.EUR], name: CURRENCY_NAMES[Currency.EUR] },
    { code: Currency.GBP, symbol: CURRENCY_SYMBOLS[Currency.GBP], name: CURRENCY_NAMES[Currency.GBP] },
    { code: Currency.CNY, symbol: CURRENCY_SYMBOLS[Currency.CNY], name: CURRENCY_NAMES[Currency.CNY] },
    { code: Currency.JPY, symbol: CURRENCY_SYMBOLS[Currency.JPY], name: CURRENCY_NAMES[Currency.JPY] },
    { code: Currency.IDR, symbol: CURRENCY_SYMBOLS[Currency.IDR], name: CURRENCY_NAMES[Currency.IDR] },
    { code: Currency.NPR, symbol: CURRENCY_SYMBOLS[Currency.NPR], name: CURRENCY_NAMES[Currency.NPR] },
    { code: Currency.AUD, symbol: CURRENCY_SYMBOLS[Currency.AUD], name: CURRENCY_NAMES[Currency.AUD] },
    { code: Currency.CAD, symbol: CURRENCY_SYMBOLS[Currency.CAD], name: CURRENCY_NAMES[Currency.CAD] }
];

/**
 * Format amount with currency symbol
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param showCode - Whether to show currency code (e.g., "₹ 1,000 INR")
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: Currency = Currency.INR, showCode: boolean = false): string {
    const symbol = CURRENCY_SYMBOLS[currency];
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return showCode
        ? `${symbol} ${formattedAmount} ${currency}`
        : `${symbol} ${formattedAmount}`;
}

/**
 * Get currency symbol by code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
    return CURRENCY_SYMBOLS[currency] || '₹';
}

/**
 * Get currency name by code
 * @param currency - The currency code
 * @returns Currency name
 */
export function getCurrencyName(currency: Currency): string {
    return CURRENCY_NAMES[currency] || 'Indian Rupee';
}
