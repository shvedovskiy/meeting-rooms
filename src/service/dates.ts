export function roundDate(date: number) {
  const ms = 1000 * 60 * 5;
  return new Date(Math.ceil(date / ms) * ms);
}
