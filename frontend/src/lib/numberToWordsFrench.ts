/**
 * Convert numbers to French words (specifically for currency/financial receipts)
 */
export function numberToWordsFrench(amount: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
  const exceptions: Record<number, string> = {
    11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze', 16: 'seize',
    71: 'soixante-onze', 72: 'soixante-douze', 73: 'soixante-treize', 74: 'soixante-quatorze', 75: 'soixante-quinze', 76: 'soixante-seize',
    91: 'quatre-vingt-onze', 92: 'quatre-vingt-douze', 93: 'quatre-vingt-treize', 94: 'quatre-vingt-quatorze', 95: 'quatre-vingt-quinze', 96: 'quatre-vingt-seize'
  };

  function convertSmall(n: number): string {
    if (n < 10) return units[n];
    if (exceptions[n]) return exceptions[n];
    
    const t = Math.floor(n / 10);
    const u = n % 10;
    
    if (t === 1) return 'dix-' + units[u];
    if (t === 7) return 'soixante-' + convertSmall(10 + u);
    if (t === 9) return 'quatre-vingt-' + convertSmall(10 + u);
    
    let res = tens[t];
    if (u === 1 && t < 8) res += '-et-un';
    else if (u > 0) res += '-' + units[u];
    
    return res;
  }

  function convertHundreds(n: number): string {
    if (n === 0) return '';
    if (n < 100) return convertSmall(n);
    
    const h = Math.floor(n / 100);
    const rest = n % 100;
    
    let res = '';
    if (h === 1) res = 'cent';
    else res = units[h] + ' cent';
    
    if (rest === 0 && h > 1) res += 's'; // plural cents
    if (rest > 0) res += ' ' + convertSmall(rest);
    
    return res;
  }

  if (amount === 0) return 'zéro';
  
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  let result = '';
  
  // Millions
  const millions = Math.floor(integerPart / 1000000);
  if (millions > 0) {
    result += (millions === 1 ? 'un million' : convertHundreds(millions) + ' millions') + ' ';
  }
  
  // Thousands
  const thousands = Math.floor((integerPart % 1000000) / 1000);
  if (thousands > 0) {
    if (thousands === 1) result += 'mille ';
    else result += convertHundreds(thousands) + ' mille ';
  }
  
  // Hundreds
  const hundreds = integerPart % 1000;
  if (hundreds > 0) {
    result += convertHundreds(hundreds);
  }

  result = result.trim();
  
  if (decimalPart > 0) {
    return result + ' dirhams et ' + convertSmall(decimalPart) + ' centimes';
  }
  
  return result + ' dirhams';
}
