import Link from 'next/link'
import { Container, Button, Group } from '@mantine/core'

SwapDuties.title = 'Swap Duties'

export default function SwapDuties() {
  return (
    <Container my="xl">
      <Group position="center" mt="lg">
        <Button variant="subtle" size="md" component={Link} href="/">
          Take me back to home page
        </Button>
      </Group>
    </Container>
  )
}
