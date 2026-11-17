/**
 * Sri Lanka payroll helpers.
 * Assumptions dated 2026-11 (illustrative planning only — verify against current law).
 */
export const SL_ASSUMPTIONS =
  "Assumptions dated 2026-11 for planning only. Confirm current EPF/ETF/tax rules before relying on results.";

export function epfEmployee(basic: number) {
  return round2(basic * 0.08);
}

export function epfEmployer(basic: number) {
  return round2(basic * 0.12);
}

export function etfEmployer(basic: number) {
  return round2(basic * 0.03);
}

export function takeHomeSalary(basic: number, allowances = 0, deductions = 0) {
  const epf = epfEmployee(basic);
  return round2(basic + allowances - epf - deductions);
}

export function vatInclusive(amount: number, rate = 0.18) {
  return round2(amount * (1 + rate));
}

export function vatExclusive(amountInclusive: number, rate = 0.18) {
  return round2(amountInclusive / (1 + rate));
}

export function fuelCost(distanceKm: number, efficiencyKmPerLitre: number, pricePerLitre: number) {
  if (efficiencyKmPerLitre <= 0) return 0;
  return round2((distanceKm / efficiencyKmPerLitre) * pricePerLitre);
}

/** Simplified CEB domestic block estimator for educational use. */
export function estimateElectricityBill(units: number) {
  const u = Math.max(0, units);
  let bill = 0;
  let remaining = u;
  const blocks: [number, number][] = [
    [30, 10],
    [30, 20],
    [60, 40],
    [60, 60],
    [Number.POSITIVE_INFINITY, 80],
  ];
  for (const [size, rate] of blocks) {
    const used = Math.min(remaining, size);
    bill += used * rate;
    remaining -= used;
    if (remaining <= 0) break;
  }
  const fixed = u <= 60 ? 150 : 400;
  return round2(bill + fixed);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}
