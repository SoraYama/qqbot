export default function strip(num: number, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}
