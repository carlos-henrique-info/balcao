// Dados fixos que imitam as respostas da DummyJSON. Usá-los deixa os testes
// E2E rápidos e independentes de a API pública estar no ar.
const pixel =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="#cbd5e1"/></svg>')

function product(id: number, title: string, category: string, price: number, discount: number) {
  return {
    id,
    title,
    description: `${title}: descrição de demonstração para os testes automatizados.`,
    category,
    price,
    discountPercentage: discount,
    rating: 4.2,
    stock: 25,
    tags: [category],
    brand: 'Marca Teste',
    sku: `SKU-${id}`,
    availabilityStatus: 'In Stock',
    thumbnail: pixel,
    images: [pixel],
    reviews: [
      {
        rating: 5,
        comment: 'Excelente!',
        date: '2025-01-01T00:00:00.000Z',
        reviewerName: 'Ana Souza',
        reviewerEmail: 'ana@example.com',
      },
    ],
  }
}

export const products = [
  product(1, 'Perfume Aurora', 'fragrances', 100, 10),
  product(2, 'Perfume Brisa', 'fragrances', 80, 0),
  product(3, 'Sofá Nuvem', 'furniture', 900, 15),
  product(4, 'Mesa de Centro', 'furniture', 250, 5),
]

export const categories = [
  { slug: 'fragrances', name: 'Fragrances', url: 'https://dummyjson.com/products/category/fragrances' },
  { slug: 'furniture', name: 'Furniture', url: 'https://dummyjson.com/products/category/furniture' },
]

export const validUser = { username: 'emilys', password: 'emilyspass' }

export const loginResponse = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  accessToken: 'jwt-e2e',
  refreshToken: 'refresh-e2e',
}
