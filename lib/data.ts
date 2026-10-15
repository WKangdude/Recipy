export type Group = "Verduras" | "Frutas" | "Cereales" | "Proteínas" | "Grasas";
export const groups: Group[] = [
  "Verduras",
  "Frutas",
  "Cereales",
  "Proteínas",
  "Grasas",
];
export type Food = {
  id: string;
  name: string;
  group: Group;
  equivalent: string;
};
export type Dish = {
  id: string;
  name: string;
  description: string;
  ingredients: { foodId: string; portions: number }[];
  servings: number;
  steps: string;
  color: string;
};
export type Entry = {
  id: string;
  date: string;
  meal: string;
  time: string;
  dishId: string;
  servings: number;
};
export const meals = ["Desayuno", "Comida", "Cena"];
export const targets: Record<string, number[]> = {
  Desayuno: [1, 1, 2, 2, 1],
  Comida: [2, 0, 2, 3, 1],
  Cena: [1, 0, 1, 2, 1],
};
export const foods: Food[] = [
  {
    id: "espinaca",
    name: "Espinaca",
    group: "Verduras",
    equivalent: "2 tazas crudas",
  },
  {
    id: "tomate",
    name: "Jitomate",
    group: "Verduras",
    equivalent: "1 pieza mediana",
  },
  {
    id: "calabaza",
    name: "Calabacita",
    group: "Verduras",
    equivalent: "1 taza cocida",
  },
  {
    id: "manzana",
    name: "Manzana",
    group: "Frutas",
    equivalent: "1 pieza pequeña",
  },
  { id: "fresas", name: "Fresas", group: "Frutas", equivalent: "1 taza" },
  {
    id: "avena",
    name: "Avena",
    group: "Cereales",
    equivalent: "⅓ de taza cruda",
  },
  {
    id: "tortilla",
    name: "Tortilla de maíz",
    group: "Cereales",
    equivalent: "1 pieza",
  },
  {
    id: "arroz",
    name: "Arroz integral",
    group: "Cereales",
    equivalent: "¼ de taza cocido",
  },
  {
    id: "pollo",
    name: "Pechuga de pollo",
    group: "Proteínas",
    equivalent: "30 g cocidos",
  },
  { id: "huevo", name: "Huevo", group: "Proteínas", equivalent: "1 pieza" },
  {
    id: "aguacate",
    name: "Aguacate",
    group: "Grasas",
    equivalent: "⅓ de pieza",
  },
  {
    id: "aceite",
    name: "Aceite de oliva",
    group: "Grasas",
    equivalent: "1 cucharadita",
  },
];
export const seedDishes: Dish[] = [
  {
    id: "bowl",
    name: "Bowl de pollo y arroz",
    description: "Un favorito para una comida completa y sin complicaciones.",
    ingredients: [
      { foodId: "pollo", portions: 3 },
      { foodId: "arroz", portions: 2 },
      { foodId: "espinaca", portions: 1 },
      { foodId: "tomate", portions: 1 },
      { foodId: "aguacate", portions: 1 },
    ],
    servings: 1,
    steps:
      "Cocina el arroz. Asa el pollo y córtalo en tiras. Sirve con las verduras y el aguacate.",
    color: "green",
  },
  {
    id: "huevos",
    name: "Huevos a la mexicana",
    description: "Lo de siempre, con un comienzo más rico.",
    ingredients: [
      { foodId: "huevo", portions: 2 },
      { foodId: "tomate", portions: 1 },
      { foodId: "tortilla", portions: 2 },
      { foodId: "aceite", portions: 1 },
    ],
    servings: 1,
    steps:
      "Pica el jitomate. Saltéalo con el aceite, añade los huevos y revuelve. Acompaña con tortillas.",
    color: "orange",
  },
  {
    id: "avena",
    name: "Avena con fresas",
    description: "Una pausa dulce para empezar tu mañana.",
    ingredients: [
      { foodId: "avena", portions: 2 },
      { foodId: "fresas", portions: 1 },
    ],
    servings: 1,
    steps:
      "Cocina la avena con agua hasta espesar. Añade las fresas lavadas y cortadas.",
    color: "pink",
  },
];
export function totals(dish: Dish, servings = 1) {
  return groups.map(
    (group) =>
      (dish.ingredients.reduce(
        (sum, i) =>
          sum +
          (foods.find((f) => f.id === i.foodId)?.group === group
            ? i.portions
            : 0),
        0,
      ) *
        servings) /
      dish.servings,
  );
}
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
