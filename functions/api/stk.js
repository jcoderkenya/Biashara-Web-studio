export async function onRequestPost(context) {
  return new Response(JSON.stringify({ error: "STK endpoint not implemented" }), {
    status: 501,
    headers: { "Content-Type": "application/json" }
  });
}
