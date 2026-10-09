import { getStore } from "@netlify/blobs";

export default async (req) => {
  const AUTORISE = String(process.env.ALLOWED_CHAT_ID || "");

  let maj;
  try {
    maj = await req.json();
  } catch {
    return new Response("ok", { status: 200 });
  }

  const msg = maj.message || maj.edited_message;
  if (!msg) return new Response("ok", { status: 200 });

  const chatId = String(msg.chat && msg.chat.id ? msg.chat.id : "");

  // Seul toi as le droit d'ecrire
  if (AUTORISE && chatId !== AUTORISE) {
    return new Response("ignoré", { status: 200 });
  }

  const texte = String(msg.text || "").trim();
  if (!texte) return new Response("ok", { status: 200 });

  const store = getStore("direct");

  // /clear : efface tout de suite
  if (texte === "/clear") {
    await store.setJSON("live", { texte: "", id: 0 });
    return new Response("effacé", { status: 200 });
  }

  // Chaque message recoit un numero unique (date exacte)
  await store.setJSON("live", {
    texte: texte,
    id: Date.now(),
  });

  return new Response("ok", { status: 200 });
};
