export default function pickOne<T>(arr: Array<T>) {
  const len = arr.length;
  return arr[Math.floor(Math.random() * len)];
}
