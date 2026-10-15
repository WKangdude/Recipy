import { test, expect } from "@playwright/test";
test("crear receta, comprobar porciones, planificar y conservar cambios", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Un buen día empieza contigo." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mis platillos", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Nuevo platillo", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Nombre", { exact: true }).fill("Ensalada de prueba");
  await dialog.getByLabel("¿Cuántas raciones rinde?").fill("2");
  await dialog.getByLabel("Porciones del ingrediente 1").fill("4");
  await dialog
    .getByLabel("Procedimiento")
    .fill("Lavar y servir las espinacas.");
  await dialog.getByRole("button", { name: "Guardar platillo" }).click();
  await page
    .getByRole("button")
    .filter({ has: page.getByRole("heading", { name: "Ensalada de prueba" }) })
    .click();
  await expect(
    page.getByText("2 de 2 porciones", { exact: true }),
  ).toBeVisible();
  await expect(dialog.getByText("Cumple", { exact: true })).toHaveCount(2);
  await dialog.getByRole("button", { name: "Añadir al plan" }).click();
  await dialog
    .getByRole("combobox", { name: "Platillo", exact: true })
    .selectOption({ label: "Ensalada de prueba" });
  await dialog.getByRole("button", { name: "Añadir al calendario" }).click();
  await page.getByRole("button", { name: "Mi día", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ensalada de prueba · 1 ración(es)" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Ensalada de prueba · 1 ración(es)" }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/dashboard-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Mi plan", exact: true }).click();
  await page.getByPlaceholder("Buscar un alimento…").fill("tortilla");
  await expect(
    page.getByRole("heading", { name: "Tortilla de maíz" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Espinaca", exact: true }),
  ).toHaveCount(0);
});
test("tema y edición de objetivos persisten", async ({ page }, info) => {
  await page.goto("/");
  if (info.project.name === "mobile")
    await page.getByRole("button", { name: "Activar tema oscuro" }).click();
  else
    await page
      .getByRole("button", { name: "Tema oscuro", exact: true })
      .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Mi plan", exact: true }).click();
  await page.getByLabel("Verduras en Comida", { exact: true }).fill("3");
  await page.reload();
  await page.getByRole("button", { name: "Mi plan", exact: true }).click();
  await expect(
    page.getByLabel("Verduras en Comida", { exact: true }),
  ).toHaveValue("3");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({
    path: `test-results/plan-dark-${info.project.name}.png`,
    fullPage: true,
  });
});
