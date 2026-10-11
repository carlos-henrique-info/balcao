# Balcão — catálogo de produtos

https://https://carlos-henrique-info.github.io/balcao

Projeto final de React + TypeScript. O **tema escolhido é `/products`** da [DummyJSON](https://dummyjson.com): um catálogo com busca, filtro por categoria, ordenação, paginação, tela de detalhes, carrinho de compras e uma área administrativa protegida por login JWT.

## Como rodar localmente

```bash
yarn install            # instala as dependências (usa o yarn.lock)
yarn dev                # servidor de desenvolvimento em http://localhost:5173

yarn typecheck          # checagem de tipos
yarn test               # Vitest + React Testing Library
yarn playwright install chromium   # só na primeira vez
yarn test:e2e           # Playwright (headless)

yarn build              # build de produção em dist/ (gera também dist/404.html)
yarn preview            # serve o build localmente
```

Requer Node 20 ou superior.

**Login de teste (usuário da DummyJSON):** `emilys` / `emilyspass`

## Telas

| Rota                         | Acesso        | O que faz                                                                  |
| ---------------------------- | ------------- | -------------------------------------------------------------------------- |
| `/`                          | público       | Catálogo com busca, categoria, ordenação e paginação (estado salvo na URL) |
| `/produtos/:id`              | público       | Detalhes, galeria, avaliações e "adicionar ao carrinho"                    |
| `/carrinho`                  | público       | Itens, quantidades, total com desconto e checkout simulado                 |
| `/login`                     | público       | Login via `POST /auth/login`                                               |
| `/admin`                     | **protegido** | Tabela paginada com editar e remover                                       |
| `/admin/produtos/novo`       | **protegido** | Cadastro de produto                                                        |
| `/admin/produtos/:id/editar` | **protegido** | Edição de produto                                                          |

## Checklist dos 10 requisitos

### 1. Estrutura de componentes e tipagem com TypeScript

- Projeto Vite + React + TypeScript em modo `strict`, sem uso de `any`.
- Componentes funcionais pequenos em `src/components` (`ProductCard`, `ProductGrid`, `SearchFilters`, `PriceTag`, `StateMessage`, `ProductForm`, `Layout`…), com props tipadas por `interface`.
- Composição com `children`: `StateMessage` recebe a ação (botão/link) como filho; `Providers` envolve a aplicação.
- Estilos: Mantine UI para a interface e **CSS Modules** (`*.module.css`) para o visual próprio (cabeçalho, etiqueta de preço, card).

### 2. Estado reativo, imutabilidade e ciclo de vida

- `useState` para estado local (busca, imagem selecionada, quantidade, página do admin).
- Atualizações imutáveis com spread/`map`/`filter` (ex.: `CartProvider`, `AdminChangesProvider`).
- `useEffect` com dependências precisas e **cleanup**:
  - `useDebounce`: `clearTimeout` ao trocar o valor;
  - `useRequest`: `AbortController` cancela a requisição anterior;
  - `AuthProvider`: remove o ouvinte do evento `storage`.

### 3. Estado global com Context API e Custom Hooks

- Contextos: `AuthContext` (sessão), `CartContext` (carrinho) e `AdminChangesContext` (alterações simuladas do admin).
- Hooks dedicados `useAuth`, `useCart` e `useAdminChanges` **lançam erro** se usados fora do Provider (testado em `hooks.test.tsx`).

### 4. Roteamento e layouts com React Router

- Rotas declarativas em `src/AppRoutes.tsx`.
- `Layout` com cabeçalho persistente e `<Outlet />`.
- `<NavLink>` com indicação de rota ativa, `useNavigate()` (login, voltar, salvar formulário) e `useParams()` (`/produtos/:id`, `/admin/produtos/:id/editar`).
- `useSearchParams()` guarda busca, categoria, ordem e página na URL.

### 5. Interface e formulários com Mantine UI

- `MantineProvider` com tema próprio em `src/theme.ts` (paleta, fontes).
- Layouts responsivos com `SimpleGrid`, `Group`, `Container`.
- Formulários com `@mantine/form` (login e cadastro/edição de produto).
- Tabelas (carrinho e admin), `Pagination` e feedback com `LoadingOverlay`, `Notifications` e `Alert`.

### 6. Autenticação JWT e rotas protegidas

- `LoginPage` consome `POST /auth/login`.
- O token é salvo em `localStorage` (`src/services/session.ts`) e sincronizado com o `AuthContext`.
- `ProtectedRoute` redireciona visitantes para `/login` e, depois do login, devolve o usuário à rota que ele tentou abrir.

### 7. API REST, interceptors e Zod

- Axios centralizado em `src/services/api.ts` com `baseURL: 'https://dummyjson.com'`.
- **Interceptor de requisição:** injeta `Authorization: Bearer <token>`.
- **Interceptor de resposta:** converte falhas em `ApiError` com mensagem amigável e mostra um aviso global para falhas de rede e erros 5xx.
- Carregamento, sucesso e erro tratados em `useRequest` e exibidos nas telas (com botão "Tentar novamente").
- Schemas Zod em `src/schemas`, tipos com `z.infer`, respostas validadas com `.safeParse()` em `src/services/*` e formulários integrados com `zodResolver`.

### 8. Testes com Vitest e RTL

- 32 testes em `src/**/*.test.ts(x)`: schemas, interceptors, hooks (incluindo timers falsos no debounce), carrinho, `ProductCard`, `ProtectedRoute` e `LoginPage`.
- Consultas acessíveis (`getByRole`, `getByLabelText`, `getByText`), interações com `@testing-library/user-event` e contextos em memória (`renderWithProviders` em `src/test/utils.tsx`).

### 9. Testes ponta a ponta com Playwright

- Config em `playwright.config.ts` (Chromium, headless, sobe o app automaticamente).
- Fluxos em `e2e/`:
  1. **Autenticação:** rota protegida → login com erro → login com sucesso → redirecionamento → sessão após recarregar → logout.
  2. **Catálogo:** busca → detalhes (`/produtos/:id`) → carrinho; link direto e recarga em rota dinâmica.
  3. **Cadastro:** login → validação do formulário → criar produto → aparece na tabela.
- Localizadores semânticos (`getByRole`, `getByLabel`). A DummyJSON é interceptada com `page.route` (`e2e/mock-api.ts`) para os testes não dependerem de uma API pública; `src/test/fixtures.test.ts` garante que os dados falsos respeitam os mesmos schemas do app.

### 10. CI/CD e deploy

- `.github/workflows/ci.yml`: a cada push e pull request faz checkout, configura Node, roda `yarn install --frozen-lockfile`, checa tipos, executa Vitest e Playwright.
- `.github/workflows/deploy.yml`: em push na `main`, gera o build e publica no GitHub Pages.
- `vite.config.ts`: `base` vem de `VITE_BASE` (o deploy usa `/<nome-do-repo>/`).
- Fallback de SPA: `scripts/spa-fallback.mjs` (executado após o build) copia `index.html` para `404.html`, então links diretos e recarregamentos funcionam no Pages.
- **Proteção da `main`** (feita nas configurações do GitHub): _Settings → Branches → Add branch ruleset_ para `main`, marcando _Require a pull request before merging_ e _Require status checks to pass_ com o check **`test`**.

#### Passo a passo para publicar

1. Crie um repositório **público** no GitHub e envie o código.
2. _Settings → Pages → Build and deployment → Source: GitHub Actions_.
3. Faça push na `main`; o workflow _Deploy_ publica o site.
4. Configure a proteção da `main` (acima) e cole o link do site no topo deste README e no Moodle.

## Limitações conhecidas

- A DummyJSON **simula** escritas: criar, editar e remover respondem com sucesso, mas nada é salvo. As mudanças ficam no `AdminChangesContext` e valem só até recarregar a página. Itens criados na sessão não podem ser editados.
- A API não combina busca com categoria: escolher uma categoria limpa a busca, e vice-versa.
- Os preços da API estão em dólar e são exibidos como `US$`.

## Uso de Inteligência Artificial

<!-- TODO: revise e ajuste este texto para refletir o que você realmente fez. -->

Usei o Claude (Anthropic) para gerar a primeira versão da estrutura do projeto, dos schemas Zod, dos componentes, dos testes e dos workflows. Depois disso, [descreva aqui o que você revisou, testou e alterou por conta própria].
