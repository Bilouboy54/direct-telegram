import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("direct");
  let etat = { texte: "", expire: 0 };
  try {
    const lu = await store.get("live", { type: "json" });
    if (lu) etat = lu;
  } catch (e) { /* rien de stocké */ }

  const maintenant = Date.now();
  const reste = etat.expire && maintenant < etat.expire
    ? Math.ceil((etat.expire - maintenant) / 1000)
    : 0;

  return Response.json(
    { texte: reste > 0 ? etat.texte : "", reste: reste },
    { headers: { "Cache-Control": "no-store" } }
  );
};
