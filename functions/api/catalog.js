export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const limit = Math.min(Math.max(Number(u.searchParams.get("limit") || 60), 1), 200);
  const search = (u.searchParams.get("q") || "").trim();
  const clientId = env.JAMENDO_CLIENT_ID || "709fa152";
  const api = new URL("https://api.jamendo.com/v3.0/tracks/");
  api.searchParams.set("client_id", clientId);
  api.searchParams.set("format", "json");
  api.searchParams.set("limit", String(limit));
  api.searchParams.set("imagesize", "300");
  api.searchParams.set("audioformat", "flac");
  api.searchParams.set("include", "musicinfo");
  api.searchParams.set("order", "popularity_month_desc");
  if (search) api.searchParams.set("search", search);

  const r = await fetch(api, {headers: {"Accept":"application/json"}});
  const body = await r.text();
  return new Response(body, {
    status:r.status,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"public, max-age=300, s-maxage=300",
      "Access-Control-Allow-Origin":"*"
    }
  });
}
