export async function refreshAccessToken() {
  const res = await fetch("https://pekingledger.store/api/token/refresh/", {
//  const res = await fetch("http://client1.localhost:8000/api/token/refresh/", {
    method: "POST",
    credentials: "include", // send HttpOnly cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}) // empty body is fine, cookie will be used
  });
  if (!res.ok) {
    throw new Error("Token refresh failed");
  }
  return res.json(); // returns { access: "...", refresh?: "..." }

}
