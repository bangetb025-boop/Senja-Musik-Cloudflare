export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const id = u.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) return new Response("Invalid track id",{status:400});

  const clientId = env.JAMENDO_CLIENT_ID || "709fa152";
  const api = new URL("https://api.jamendo.com/v3.0/tracks/file/");
  api.searchParams.set("client_id",clientId);
  api.searchParams.set("id",id);
  api.searchParams.set("action","stream");
  api.searchParams.set("audioformat","flac");

  const h = new Headers();
  const range = request.headers.get("Range");
  if (range) h.set("Range",range);

  const r = await fetch(api,{headers:h,redirect:"follow"});
  if (!r.ok && r.status!==206) return new Response("Audio unavailable",{status:r.status});

  const out = new Headers();
  out.set("Content-Type",r.headers.get("Content-Type")||"audio/flac");
  for (const k of ["Content-Length","Content-Range"]) {
    const v=r.headers.get(k); if(v) out.set(k,v);
  }
  out.set("Accept-Ranges","bytes");
  out.set("Cache-Control","public, max-age=86400");
  out.set("Access-Control-Allow-Origin","*");
  return new Response(r.body,{status:r.status,headers:out});
}
