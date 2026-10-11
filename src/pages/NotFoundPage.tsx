import { Button } from '@mantine/core'
import { Link } from 'react-router-dom'
import { StateMessage } from '../components/StateMessage'

export function NotFoundPage() {
  return (
    <StateMessage title="Página não encontrada" message="O endereço que você abriu não existe neste site.">
      <Button component={Link} to="/">
        Ir para o catálogo
      </Button>
    </StateMessage>
  )
}
