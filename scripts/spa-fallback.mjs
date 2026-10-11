// GitHub Pages não conhece as rotas do React Router. Quando alguém abre
// /repo/produtos/1 direto (ou recarrega a página), o Pages não encontra o
// arquivo e serve o 404.html. Copiando o index.html para 404.html, o app
// carrega normalmente e o BrowserRouter resolve a rota no navegador.
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const index = resolve(dist, 'index.html')

if (!existsSync(index)) {
  console.error('dist/index.html não encontrado. Rode o build antes.')
  process.exit(1)
}

copyFileSync(index, resolve(dist, '404.html'))
console.log('SPA fallback: dist/404.html criado a partir do index.html')
