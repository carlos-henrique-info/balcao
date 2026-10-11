import { expect, test } from "@playwright/test";
import { validUser } from "./fixtures";
import { mockApi } from "./mock-api";

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test.describe("Fluxo de busca, detalhes e carrinho", () => {
  test("busca um produto, abre os detalhes e adiciona ao carrinho", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Catálogo" })).toBeVisible();
    await expect(page.getByRole("article")).toHaveCount(4);

    // Busca (com debounce): a URL passa a refletir o termo
    await page.getByLabel("Buscar produto").fill("sofá");
    await expect(page).toHaveURL(/q=sof/);
    await expect(page.getByRole("article")).toHaveCount(1);

    // Detalhes via rota dinâmica /produtos/:id
    await page.getByRole("link", { name: "Sofá Nuvem" }).click();
    await expect(page).toHaveURL(/\/produtos\/3$/);
    await expect(
      page.getByRole("heading", { name: "Sofá Nuvem", level: 1 }),
    ).toBeVisible();

    // Carrinho
    await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
    await expect(page.getByRole("link", { name: /Carrinho/ })).toContainText(
      "1",
    );
    await page.getByRole("link", { name: /Carrinho/ }).click();
    await expect(page).toHaveURL(/\/carrinho$/);
    await expect(
      page.getByRole("table", { name: "Itens do carrinho" }),
    ).toContainText("Sofá Nuvem");
  });

  test("link direto para um produto funciona (fallback de SPA)", async ({
    page,
  }) => {
    await page.goto("/produtos/2");
    await expect(
      page.getByRole("heading", { name: "Perfume Brisa", level: 1 }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Perfume Brisa", level: 1 }),
    ).toBeVisible();
  });
});

test.describe("Cadastro de produto na área administrativa", () => {
  test("cria um produto e ele aparece na lista", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Usuário").fill(validUser.username);
    await page.getByLabel("Senha").fill(validUser.password);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(
      page.getByRole("heading", { name: "Administração" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Novo produto" }).click();
    await expect(page).toHaveURL(/\/admin\/produtos\/novo$/);

    // Validação do Zod: enviar vazio mostra os erros
    await page.getByRole("button", { name: "Criar produto" }).click();
    await expect(
      page.getByText("Informe um título com pelo menos 3 caracteres"),
    ).toBeVisible();

    await page.getByLabel("Título").fill("Luminária Solar");
    await page
      .getByLabel("Descrição")
      .fill("Luminária de jardim com carregamento solar.");
    await page.getByLabel("Categoria").locator("input").click();
    await page.getByRole("option", { name: "Furniture" }).click();
    await page.getByLabel("Preço (US$)").fill("59.9");
    await page.getByLabel("Estoque").fill("10");
    await page.getByRole("button", { name: "Criar produto" }).click();

    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("table", { name: "Produtos cadastrados" }),
    ).toContainText("Luminária Solar");
  });
});
