import { Badge, Button, Container, Text } from '@mantine/core'
import { IconLogout, IconShoppingCart } from '@tabler/icons-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import classes from './Layout.module.css'

function navClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${classes.link} ${classes.active}` : classes.link
}

export function Layout() {
  const { isAuthenticated, user, signOut } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <>
      <header className={classes.header}>
        <Container size="lg" className={classes.bar}>
          <Link to="/" className={classes.brand} aria-label="Balcão, página inicial">
            Balcão<span>.</span>
          </Link>

          <nav className={classes.nav} aria-label="Principal">
            <NavLink to="/" end className={navClass}>
              Catálogo
            </NavLink>
            <NavLink to="/carrinho" className={navClass}>
              <IconShoppingCart size={18} aria-hidden />
              Carrinho
              {totalItems > 0 && (
                <Badge color="yellow" c="dark" size="sm" circle aria-label={`${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`}>
                  {totalItems}
                </Badge>
              )}
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/admin" className={navClass}>
                  Administração
                </NavLink>
                <Button
                  variant="subtle"
                  color="gray"
                  c="gray.4"
                  size="compact-md"
                  leftSection={<IconLogout size={16} aria-hidden />}
                  onClick={handleSignOut}
                  aria-label={`Sair (${user?.username ?? 'usuário'})`}
                >
                  Sair
                </Button>
              </>
            ) : (
              <NavLink to="/login" className={navClass}>
                Entrar
              </NavLink>
            )}
          </nav>
        </Container>
      </header>

      <main className={classes.main}>
        <Container size="lg">
          <Outlet />
        </Container>
      </main>

      <footer className={classes.footer}>
        <Container size="lg">
          <Text size="sm" c="dimmed">
            Dados de demonstração da DummyJSON. Compras e alterações são simuladas.
          </Text>
        </Container>
      </footer>
    </>
  )
}
