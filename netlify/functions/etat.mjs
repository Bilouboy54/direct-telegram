import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("direct");
  let etat = { texte: "", id: 0 };
  try {
    const lu = await store.get("live", { type: "json" });
    if (lu) etat = lu;
  } catch (e) { /* rien de stocke */ }

  return Response.json(
    { texte: etat.texte || "", id: etat.id || 0 },
    { headers: { "Cache-Control": "no-store" } }
  );
};
