// Quantities use the same physical state and unit as each plan equivalence.
export const equivalents: Record<string, { quantity: number; unit: string }> = {
  espinaca: { quantity: 2, unit: "tazas crudas" },
  tomate: { quantity: 1, unit: "piezas" },
  calabaza: { quantity: 1, unit: "tazas cocidas" },
  manzana: { quantity: 1, unit: "piezas" },
  fresas: { quantity: 1, unit: "tazas" },
  avena: { quantity: 1 / 3, unit: "tazas crudas" },
  tortilla: { quantity: 1, unit: "piezas" },
  arroz: { quantity: 1 / 4, unit: "tazas cocidas" },
  pollo: { quantity: 30, unit: "g cocidos" },
  huevo: { quantity: 1, unit: "piezas" },
  aguacate: { quantity: 1 / 3, unit: "piezas" },
  aceite: { quantity: 1, unit: "cucharaditas" },
};
export type Inventory = Record<string, number>;
export function stockStatus(foodId: string, quantity?: number) {
  const equivalent = equivalents[foodId];
  if (quantity === undefined || !equivalent)
    return { label: "Sin registrar", tone: "neutral", portions: null };
  const portions = quantity / equivalent.quantity;
  if (quantity <= 0)
    return { label: "Sin existencias", tone: "over", portions: 0 };
  if (Math.floor(portions + 1e-9) <= 2)
    return { label: "Pronto a acabarse", tone: "under", portions };
  return { label: "Disponible", tone: "ok", portions };
}
export function formatQuantity(n: number) {
  return new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(n);
}
