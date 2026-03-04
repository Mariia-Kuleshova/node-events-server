export function logRequest(req) {
  const date = new Date().toISOString();
  console.log(`[${date}] ${req.method} ${req.url}`);
}
