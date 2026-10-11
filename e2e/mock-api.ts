import type { Page, Route } from '@playwright/test'
import { categories, loginResponse, products, validUser } from './fixtures'

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
}

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    headers: { ...CORS, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function page(items: typeof products, url: URL) {
  const limit = Number(url.searchParams.get('limit') ?? 30)
  const skip = Number(url.searchParams.get('skip') ?? 0)
  return { products: items.slice(skip, skip + limit), total: items.length, skip, limit }
}

/** Intercepta todas as chamadas à DummyJSON feitas pelo navegador. */
export async function mockApi(target: Page) {
  await target.route('https://dummyjson.com/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname
    const method = request.method()

    if (method === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS })
    }

    if (method === 'POST' && path === '/auth/login') {
      const body = request.postDataJSON() as { username?: string; password?: string }
      const ok = body.username === validUser.username && body.password === validUser.password
      return ok ? json(route, loginResponse) : json(route, { message: 'Invalid credentials' }, 400)
    }

    if (method === 'POST' && path === '/products/add') {
      return json(route, { id: 195, ...(request.postDataJSON() as object) }, 201)
    }

    if (method === 'GET' && path === '/products/categories') {
      return json(route, categories)
    }

    if (method === 'GET' && path === '/products/search') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase()
      return json(route, page(products.filter((item) => item.title.toLowerCase().includes(q)), url))
    }

    const categoryMatch = path.match(/^\/products\/category\/(.+)$/)
    if (method === 'GET' && categoryMatch) {
      return json(route, page(products.filter((item) => item.category === categoryMatch[1]), url))
    }

    const idMatch = path.match(/^\/products\/(\d+)$/)
    if (idMatch) {
      const found = products.find((item) => item.id === Number(idMatch[1]))
      if (!found) return json(route, { message: `Product with id '${idMatch[1]}' not found` }, 404)
      if (method === 'GET') return json(route, found)
      if (method === 'PUT') return json(route, { ...found, ...(request.postDataJSON() as object) })
      if (method === 'DELETE') return json(route, { ...found, isDeleted: true })
    }

    if (method === 'GET' && path === '/products') {
      return json(route, page(products, url))
    }

    return json(route, { message: `Rota não mockada: ${method} ${path}` }, 404)
  })
}
