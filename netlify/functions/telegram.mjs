import { getStore } from "@netlify/blobs";

export default async (req) => {
  const DUREE = Number(process.env.DISPLAY_SECONDS || "10");
  const AUTORISE = String(process.env.ALLOWED_CHAT_ID || "");
  const SECRET = String(process.env.WEBHOOK_SECRET || "");

  if (SECRET) {
    const entete = req.headers.get("x-telegram-bot-api-secret-token");
    if (entete !== SECRET) return new Response("refusé", { status: 401 });
  }

  let maj;
  try {
    maj = await req.json();
  } catch {
    return new Response("ok", { status: 200 });
  }

  const msg = maj.message || maj.edited_message;
  if (!msg) return new Response("ok", { status: 200 });

  const chatId = String(msg.chat && msg.chat.id ? msg.chat.id : "");

  if (AUTORISE && chatId !== AUTORISE) {
    return new Response("ignoré", { status: 200 });
  }

  const texte = String(msg.text || "").trim();
  if (!texte) return new Response("ok", { status: 200 });

  const store = getStore("direct");

  if (texte === "/clear") {
    await store.delete("live");
    return new Response("effacé", { status: 200 });
  }

  const maintenant = Date.now();
  await store.setJSON("live", {
    texte: texte,
    expire: maintenant + DUREE * 1000,
  });

  return new Response("ok", { status: 200 });
};
