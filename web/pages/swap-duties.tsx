import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Container, Tabs, Title, Text, createStyles, Divider } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

import useSwapRequest from '@/hooks/useSwapRequest'
import { type SanitySwapRequest } from '@/lib/sanity.queries'

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    lineHeight: 1,
    textTransform: 'uppercase',
  },

  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.sm,
    },
  },
}))

SwapDuties.title = 'Swap Duties'

// function to get all the swap requests that the user has received, and all the swap requests that the user has sent from the swapRecords
function sortSwapRequests(swapRecords: SanitySwapRequest[], userId: string) {
  const received = []
  const sentByMe = []

  for (const swapRecord of swapRecords) {
    if (swapRecord.requester?.id === userId) {
      sentByMe.push(swapRecord)
    } else if (swapRecord.receiver?.id === userId) {
      received.push(swapRecord)
    }
  }

  return { received, sentByMe }
}

export default function SwapDuties() {
  const { classes } = useStyles()

  const { data: session } = useSession()
  const { data: swapRecords } = useSwapRequest()

  const [received, setReceived] = useState<SanitySwapRequest[]>([])
  const [sentByMe, setSentByMe] = useState<SanitySwapRequest[]>([])

  useEffect(() => {
    // sort the swap requests
    if (session?.user && swapRecords) {
      const { received, sentByMe } = sortSwapRequests(swapRecords, session.user.id)
      setReceived(received)
      setSentByMe(sentByMe)
    }
  }, [session?.user, swapRecords])

  return (
    <Container my="xl">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Swap duties requests</Title>
      </div>

      <Text color="dimmed" mt="md">
        Here you can see all the swap duties requests you have received and sent.
      </Text>

      <Divider mt="sm" />

      <Tabs mt="lg" defaultValue="received" activateTabWithKeyboard={false} keepMounted={false}>
        <Tabs.List grow position="center">
          <Tabs.Tab value="received">Received</Tabs.Tab>
          <Tabs.Tab value="sent-by-me">Sent by me</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="received" pt="xs">
          {received.length > 0 ? (
            received.map((swapRequest) => {
              return (
                <div key={swapRequest._id}>
                  <Text>
                    From: {swapRequest.requester.name} to {swapRequest.receiver.name}
                  </Text>
                </div>
              )
            })
          ) : (
            <Text>No requests to display</Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="sent-by-me" pt="xs">
          <Title order={2}>Pending</Title>
          {sentByMe.length > 0 ? (
            sentByMe.map((swapRequest) => {
              return (
                <div key={swapRequest._id}>
                  <Text>
                    From: {swapRequest.requester.name} to {swapRequest.receiver.name}
                  </Text>
                </div>
              )
            })
          ) : (
            <Text>No requests to display</Text>
          )}
          <Title order={2}>History</Title>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}
