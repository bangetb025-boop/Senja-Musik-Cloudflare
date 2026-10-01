# Senja Musik — Cloudflare Pages + FLAC

Project ini mengubah Senja Musik dari pemutar file lokal menjadi katalog online.

## Deploy dari Termux

```bash
cd /storage/emulated/0
unzip Senja-Musik-Cloudflare.zip
cd Senja-Musik-Cloudflare
npx wrangler login
npx wrangler pages project create senja-musik
npx wrangler pages deploy public --project-name senja-musik
```

Pages Functions di folder `functions/` ikut digunakan oleh project saat deploy.

Untuk production, ganti `JAMENDO_CLIENT_ID` di `wrangler.toml` dengan Client ID Jamendo milik aplikasi kamu.

Jangan gunakan musik yang tidak kamu punya hak distribusinya. Katalog pada demo berasal dari Jamendo.
