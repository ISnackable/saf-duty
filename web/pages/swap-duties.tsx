import { useSession } from 'next-auth/react'
import {
  Container,
  Tabs,
  Title,
  Text,
  createStyles,
  Divider,
  Box,
  Avatar,
  Group,
  Anchor,
  Drawer,
  Button,
  Flex,
  Paper,
  Input,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconArrowBadgeLeft,
  IconArrowBadgeRight,
  IconCalendar,
  IconClock,
  IconEdit,
  IconReplace,
} from '@tabler/icons-react'

import useSwapRequest from '@/hooks/useSwapRequest'
import { type SanitySwapRequest } from '@/lib/sanity.queries'
import Link from 'next/link'
import { useState } from 'react'
import { UserInfoCard } from '@/components/UserInfoCard'

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
function sortSwapRequests(swapRecords?: SanitySwapRequest[], userId?: string) {
  const received = []
  const sentByMe = []

  if (swapRecords && swapRecords?.length > 0 && userId) {
    for (const swapRecord of swapRecords) {
      if (swapRecord.requester?.id === userId) {
        sentByMe.push(swapRecord)
      } else if (swapRecord.receiver?.id === userId) {
        received.push(swapRecord)
      }
    }
  }

  return { received, sentByMe }
}

export default function SwapDuties() {
  const { classes } = useStyles()

  const { data: session } = useSession()
  const { data: swapRecords } = useSwapRequest()
  const { received, sentByMe } = sortSwapRequests(swapRecords, session?.user?.id)

  const [activeTab, setActiveTab] = useState<string | null>('received')
  const [currentSwapRequest, setCurrentSwapRequest] = useState<SanitySwapRequest | null>(null)
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Swap Details"
        position="bottom"
        overlayProps={{ opacity: 0.5, blur: 1 }}
        transitionProps={{
          transition: 'slide-up',
        }}
      >
        {currentSwapRequest && (
          <>
            <Group
              position="apart"
              grow
              sx={{
                flexDirection: activeTab === 'received' ? 'row' : 'row-reverse',
              }}
            >
              <UserInfoCard
                avatar={currentSwapRequest.requester.image}
                name={currentSwapRequest.requester.name}
              >
                <Paper shadow="xs" p="md" mt="xs">
                  <Text size="md" c="dimmed">
                    Date:{' '}
                    {new Date(currentSwapRequest.requesterDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text size="md" c="dimmed">
                    Time: 8:00AM
                  </Text>
                </Paper>
              </UserInfoCard>

              <UserInfoCard
                avatar={currentSwapRequest.receiver.image}
                name={`${currentSwapRequest.receiver.name} (you)`}
              >
                <Paper shadow="xs" p="md" mt="xs">
                  <Text size="md" c="dimmed">
                    Date:{' '}
                    {new Date(currentSwapRequest.receiverDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text size="md" c="dimmed">
                    Time: 8:00AM
                  </Text>
                </Paper>
              </UserInfoCard>
            </Group>
            <IconReplace
              size="2rem"
              style={{
                position: 'absolute',
                top: 'calc(50% - 5rem)',
                left: 'calc(50% - 1rem)',
              }}
            />
            <Input.Label mt="xs">Reason</Input.Label>
            <Paper
              withBorder
              sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
              })}
              p="sm"
            >
              <Text truncate>{currentSwapRequest.reason || 'No reason provided'}</Text>
            </Paper>
            <Flex
              gap="md"
              justify="center"
              align="center"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                textAlign: 'center',
                padding: '0 16px 16px 16px',
              }}
            >
              {activeTab === 'received' ? (
                <>
                  <Button color="red" fullWidth>
                    Deny
                  </Button>
                  <Button color="teal" fullWidth>
                    Approve
                  </Button>
                </>
              ) : (
                <Button color="gray" fullWidth>
                  Cancel Request
                </Button>
              )}
            </Flex>
          </>
        )}
      </Drawer>

      <Container my="xl" size="xl">
        <div className={classes.titleWrapper}>
          <IconEdit size={48} />
          <Title className={classes.title}>Swap requests</Title>
        </div>

        <Text color="dimmed" mt="md">
          Here you can see all the swap duties requests you have received and sent.
        </Text>

        <Divider mt="sm" />

        <Tabs
          mt="lg"
          defaultValue="received"
          activateTabWithKeyboard={false}
          keepMounted={false}
          value={activeTab}
          onTabChange={setActiveTab}
        >
          <Tabs.List grow position="center">
            <Tabs.Tab value="received">Offers received</Tabs.Tab>
            <Tabs.Tab value="sent-by-me">Sent by me</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="received" pt="xs">
            <Title order={3} mb="sm">
              Swaps Offers
            </Title>
            {received.length > 0 ? (
              received.map((swapRequest) => {
                return (
                  <Box
                    key={swapRequest._id}
                    mb="sm"
                    sx={(theme) => ({
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
                      textAlign: 'center',
                      padding: theme.spacing.xl,
                      borderRadius: theme.radius.md,
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[6]
                            : theme.colors.gray[2],
                      },
                    })}
                    onClick={() => {
                      setCurrentSwapRequest(swapRequest)
                      open()
                    }}
                  >
                    <Group grow noWrap>
                      <div>
                        <Group noWrap>
                          <Avatar
                            src={swapRequest.requester.image}
                            alt="it's me"
                            size="md"
                            radius="md"
                          />
                          <Text fz="lg" fw={500}>
                            {swapRequest.requester.name}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={5} noWrap>
                          <IconCalendar stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            {new Date(swapRequest.requesterDate).toDateString()}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={3} noWrap>
                          <IconClock stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            8:00AM
                          </Text>
                        </Group>
                      </div>

                      <IconArrowBadgeLeft stroke={0.5} size="5rem" />

                      <div>
                        <Group noWrap>
                          <Avatar
                            src={swapRequest.receiver.image}
                            alt="it's me"
                            size="md"
                            radius="md"
                          />
                          <Text fz="lg" fw={500}>
                            {swapRequest.receiver.name}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={5} noWrap>
                          <IconCalendar stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            {new Date(swapRequest.receiverDate).toDateString()}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={3} noWrap>
                          <IconClock stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            8:00AM
                          </Text>
                        </Group>
                      </div>
                    </Group>
                  </Box>
                )
              })
            ) : (
              <Text>No requests to display</Text>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="sent-by-me" pt="xs">
            <Title order={3} mb="sm">
              Pending Approval
            </Title>
            {sentByMe.length > 0 ? (
              sentByMe.map((swapRequest) => {
                return (
                  <Box
                    key={swapRequest._id}
                    mb="sm"
                    sx={(theme) => ({
                      backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
                      textAlign: 'center',
                      padding: theme.spacing.xl,
                      borderRadius: theme.radius.md,
                      cursor: 'pointer',

                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark'
                            ? theme.colors.dark[6]
                            : theme.colors.gray[2],
                      },
                    })}
                    onClick={open}
                  >
                    <Group grow noWrap>
                      <div>
                        <Group noWrap>
                          <Avatar
                            src={swapRequest.requester.image}
                            alt="it's me"
                            size="md"
                            radius="md"
                          />
                          <Text fz="lg" fw={500}>
                            {swapRequest.requester.name}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={5} noWrap>
                          <IconCalendar stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            {new Date(swapRequest.requesterDate).toDateString()}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={3} noWrap>
                          <IconClock stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            8:00AM
                          </Text>
                        </Group>
                      </div>

                      <IconArrowBadgeRight stroke={0.5} size="5rem" />

                      <div>
                        <Group noWrap>
                          <Avatar
                            src={swapRequest.receiver.image}
                            alt="it's me"
                            size="md"
                            radius="md"
                          />
                          <Text fz="lg" fw={500}>
                            {swapRequest.receiver.name}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={5} noWrap>
                          <IconCalendar stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            {new Date(swapRequest.receiverDate).toDateString()}
                          </Text>
                        </Group>

                        <Group spacing={10} mt={3} noWrap>
                          <IconClock stroke={1.5} size="1rem" />
                          <Text fz="sm" c="dimmed">
                            8:00AM
                          </Text>
                        </Group>
                      </div>
                    </Group>
                  </Box>
                )
              })
            ) : (
              <Text>
                No requests to display, you can request to swap duties{' '}
                <Anchor component={Link} href="/duty-roster" prefetch={false}>
                  here
                </Anchor>
                !
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Container>
    </>
  )
}
