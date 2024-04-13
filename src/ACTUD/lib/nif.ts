export function validatePortugueseVATNumber(nif: string): boolean {
    // Check if the input has exactly 9 characters
    if (nif.length !== 9) {
        return false;
    }

    // Extract the first 8 digits
    const firstEightDigits = nif.slice(0, 8);

    // Extract the last digit
    const lastDigit = parseInt(nif.charAt(8), 10);

    // Calculate the check digit
    let total = 0;
    for (let i = 0; i < 8; i++) {
        total += parseInt(firstEightDigits.charAt(i), 10) * (9 - i);
    }

    let checkDigit = 11 - (total % 11);
    if (checkDigit >= 10) {
        checkDigit = 0;
    }

    // Compare the calculated check digit with the last digit of the input
    return checkDigit === lastDigit;
}