export async function onRequestGet({ request, env }) {
  const u = new URL(request.url);
  const id = u.searchParams.get("id");

  if (!id || !/^\d+$/.test(id)) {
    return new Response("Invalid track id", { status: 400 });
  }

  const clientId = env.JAMENDO_CLIENT_ID;

  if (!clientId) {
    return new Response("Jamendo client ID not configured", { status: 500 });
  }

  const api = new URL("https://api.jamendo.com/v3.0/tracks/");
  api.searchParams.set("client_id", clientId);
  api.searchParams.set("id", id);
  api.searchParams.set("format", "json");
  api.searchParams.set("audioformat", "flac");

  const result = await fetch(api);

  if (!result.ok) {
    return new Response("Jamendo API unavailable", { status: 502 });
  }

  const data = await result.json();
  const track = data?.results?.[0];

  if (!track?.audio) {
    return new Response("Audio unavailable", { status: 404 });
  }

  const range = request.headers.get("Range");
  const headers = {};

  if (range) {
    headers.Range = range;
  }

  const audio = await fetch(track.audio, {
    headers,
    redirect: "follow"
  });

  if (!audio.ok && audio.status !== 206) {
    return new Response("Audio unavailable", {
      status: audio.status
    });
  }

  const out = new Headers();

  out.set(
    "Content-Type",
    audio.headers.get("Content-Type") || "audio/flac"
  );

  for (const name of [
    "Content-Length",
    "Content-Range",
    "Accept-Ranges"
  ]) {
    const value = audio.headers.get(name);
    if (value) {
      out.set(name, value);
    }
  }

  out.set("Accept-Ranges", "bytes");
  out.set("Cache-Control", "public, max-age=86400");
  out.set("Access-Control-Allow-Origin", "*");

  return new Response(audio.body, {
    status: audio.status,
    headers: out
  });
}
