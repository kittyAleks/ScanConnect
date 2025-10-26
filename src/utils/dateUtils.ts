export const formatDate = (ts: number): string => {
  const date = new Date(ts);
  const pad = (n: number) => `${n}`.padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${dd}.${MM}.${yyyy} ${hh}:${mm}:${ss}`;
};
