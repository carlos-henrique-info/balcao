import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { Providers } from './Providers'

// BASE_URL vem do `base` do vite.config.ts ("/" local, "/<repo>/" no GitHub Pages).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Providers>
        <AppRoutes />
      </Providers>
    </BrowserRouter>
  )
}
