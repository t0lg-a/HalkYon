/* tr-TR everywhere: period for thousands, comma for the decimal. */
export const tr = (n: number, d = 1) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n)
export const trn = (n: number) => new Intl.NumberFormat("tr-TR").format(n)
