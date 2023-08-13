import { type ReactElement, type ReactNode, useState, useEffect } from 'react'
import {
  Container,
  createStyles,
  Divider,
  Text,
  Title,
  Flex,
  Indicator,
  Drawer,
  Button,
  Box,
  Group,
  Textarea,
  Card,
  Select,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Calendar, isSameMonth } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import {
  IconX,
  IconCalendar,
  IconCalendarEvent,
  IconUser,
  IconAlertCircle,
} from '@tabler/icons-react'

import type { SanityUser } from '@/lib/sanity.queries'
import useCalendar from '@/hooks/useCalendar'
import { useSession } from 'next-auth/react'

const useStyles = createStyles((theme) => {
  return {
    calendarBase: {
      boxSizing: 'border-box',
      display: 'flex',
      gap: theme.spacing.md,
      maxWidth: '100%',
    },

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
  }
})

IndexPage.title = 'Duty Roster'

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean
  wrapper: (children: ReactNode) => ReactElement
  children: ReactElement
}) => (condition ? wrapper(children) : children)

export default function IndexPage() {
  const { data: session } = useSession()
  const { data: calendar, error } = useCalendar()
  const [opened, { open, close }] = useDisclosure(false)

  const [drawerDateValue, setDrawerDateValue] = useState<Date | null | undefined>(null)
  const [drawerPersonnelValue, setDrawerPersonnelValue] = useState<
    Pick<SanityUser, 'id' | 'name'> | null | undefined
  >(null)
  const [month, setMonth] = useState(new Date())

  const { classes } = useStyles()

  function onRequestSwap() {
    console.log(drawerDateValue, drawerPersonnelValue)
  }

  useEffect(() => {
    if (drawerDateValue !== null && drawerPersonnelValue !== null) {
      open()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerDateValue, drawerPersonnelValue])

  if (error) return <div>failed to load</div>
  const dutyDates = calendar?.find((cal) => isSameMonth(new Date(cal.date), month))

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Request Swap Duty"
        position="bottom"
        overlayProps={{ opacity: 0.5, blur: 1 }}
        transitionProps={{
          transition: 'slide-up',
        }}
      >
        <Flex direction="column">
          <Group grow>
            <Card p="lg">
              <Group>
                <IconCalendar size={50} />
                <Box ml="lg">
                  <Card.Section>
                    <Text component="span" size="lg">
                      Date
                    </Text>
                  </Card.Section>
                  <Card.Section>
                    <Text component="span" size="md" c="dimmed">
                      {drawerDateValue?.toLocaleDateString(undefined, {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </Card.Section>
                </Box>
              </Group>
            </Card>

            <Card p="lg">
              <Group>
                <IconUser size={50} />
                <Box ml="lg">
                  <Card.Section>
                    <Text component="span" size="lg">
                      Duty Personnel
                    </Text>
                  </Card.Section>
                  <Card.Section>
                    <Text component="span" size="md" c="dimmed">
                      {drawerPersonnelValue?.name}
                    </Text>
                  </Card.Section>
                </Box>
              </Group>
            </Card>
          </Group>

          <Select
            withAsterisk
            withinPortal
            label="Pick a date to swap"
            placeholder="Pick one"
            data={['Fri, 21 May 2021', 'Sat, 22 May 2021', 'Sun, 23 May 2021']}
          />

          <Textarea
            placeholder="I need to attend my friend's birthday on the 21st."
            label="Reason for swap (optional)"
          />

          <Button mt="md" size="md" fullWidth onClick={onRequestSwap}>
            Request Swap
          </Button>
        </Flex>
      </Drawer>
      <Container my="xl" size="xl">
        <div className={classes.titleWrapper}>
          <IconCalendarEvent size={48} />
          <Title className={classes.title}>Duty Roster</Title>
        </div>
        <Text color="dimmed" mt="md">
          View the duty roster, below the date indicate the duty personnel while the circle bracket
          indicates the duty stand in personnel. Click on the date to request for swap duty.
        </Text>
        <Divider mt="sm" />

        <Calendar
          // static
          mt="lg"
          maxLevel="month"
          hideOutsideDates
          size="xl"
          date={month}
          onDateChange={setMonth}
          styles={(theme) => ({
            calendar: {
              maxWidth: '100%',
            },
            calendarHeader: {
              maxWidth: '100%',
            },
            monthCell: {
              border: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
              }`,
            },
            month: {
              width: '100%',
            },
            day: {
              borderRadius: 0,
              width: '100%',
              height: 90,
              fontSize: theme.fontSizes.lg,
            },
            weekday: {
              fontSize: theme.fontSizes.xl,
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
              border: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
              }`,
              height: 90,
            },
          })}
          getDayProps={(date) => {
            const defaultDayProps = {
              onClick: () => {
                const day = date.getDate()
                const username = session?.user?.name?.toLowerCase()

                if (dutyDates) {
                  // Check if date is past
                  if (date.valueOf() <= new Date().valueOf()) {
                    showNotification({
                      title: 'Cannot swap duty',
                      message: 'You cannot swap duty for past dates.',
                      color: 'red',
                      icon: <IconX />,
                    })
                  } else if (
                    username &&
                    !(username === dutyDates?.roster?.[day - 1]?.personnel?.name?.toLowerCase())
                  ) {
                    if (
                      dutyDates?.roster?.[day - 2]?.personnel?.name?.toLowerCase() === username ||
                      dutyDates?.roster?.[day]?.personnel?.name?.toLowerCase() === username
                    ) {
                      showNotification({
                        title: 'Warning',
                        message: `Take note, you are the personnel on duty for the day before or after.`,
                        color: 'yellow',
                        icon: <IconAlertCircle />,
                      })
                    }

                    setDrawerPersonnelValue(dutyDates?.roster?.[day - 1]?.personnel)
                    setDrawerDateValue(date)
                  }
                }
              },
            }
            // Check if date isWeekend
            const isWeekend = date.getDay() === 0 || date.getDay() === 6
            const isToday = date.toDateString() === new Date().toDateString()

            if (isToday) {
              return {
                ...defaultDayProps,
                sx: (theme) => ({
                  color: `${
                    theme.colorScheme === 'dark' ? theme.colors.blue[2] : theme.colors.blue[4]
                  } !important`,
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
                }),
              }
            } else if (isWeekend) {
              return {
                ...defaultDayProps,
                sx: (theme) => ({
                  color: `${
                    theme.colorScheme === 'dark' ? theme.colors.pink[2] : theme.colors.pink[4]
                  } !important`,
                  backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
                }),
              }
            }
            return {
              ...defaultDayProps,
            }
          }}
          renderDay={(date) => {
            const day = date.getDate()

            return (
              <ConditionalWrapper
                condition={
                  session?.user?.name?.toLowerCase() ===
                  dutyDates?.roster?.[day - 1]?.personnel?.name?.toLowerCase()
                }
                wrapper={(children) => (
                  <Indicator size={6} offset={-2}>
                    {children}
                  </Indicator>
                )}
              >
                <Flex mih="100%" direction="column">
                  <Text fz="sm" ta="right" mb="auto" mt="xs" mr="xs">
                    {day}
                  </Text>
                  {dutyDates && (
                    <Text size="xs" align="center" mb="auto">
                      {dutyDates?.roster?.[day - 1]?.personnel?.name} (
                      {dutyDates?.roster?.[day - 1]?.standby?.name})
                    </Text>
                  )}
                </Flex>
              </ConditionalWrapper>
            )
          }}
        />
      </Container>
    </>
  )
}
