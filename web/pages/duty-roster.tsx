import { type ReactElement, type ReactNode, useState } from 'react'
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
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Calendar, isSameMonth } from '@mantine/dates'
import { IconCalendarEvent } from '@tabler/icons-react'

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

  const { classes } = useStyles()

  const [month, setMonth] = useState(new Date())

  if (error) return <div>failed to load</div>
  const dutyDates = calendar?.find((cal) => isSameMonth(new Date(cal.date), month))

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Swap Duty"
        position="bottom"
        overlayProps={{ opacity: 0.5, blur: 4 }}
      >
        <Flex direction="column">
          <Box
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
              textAlign: 'center',
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,
              cursor: 'pointer',

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
              },
            })}
          >
            Box lets you add inline styles with sx prop
          </Box>

          <Text c="dimmed" ta="center" mt={170}>
            You are swapping duty with <strong>Person A</strong> on <strong>1st Jan 2021</strong> at{' '}
            <strong>12pm</strong>
          </Text>

          <Group mt="lg" position="center">
            <Button color="gray" size="md" style={{ flex: '1 1 0%' }}>
              Decline
            </Button>
            <Button size="md" style={{ flex: '1 1 0%' }}>
              Approve
            </Button>
          </Group>
        </Flex>
      </Drawer>
      <Container my="xl" size="xl">
        <div className={classes.titleWrapper}>
          <IconCalendarEvent size={48} />
          <Title className={classes.title}>Duty Roster</Title>
        </div>
        <Text color="dimmed" mt="md">
          View the duty roster, below the date indicate the duty personnel while the circle bracket
          indicates the duty stand in personnel. The names are the initials of the personnel.
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
                // const day = date.getDate()
                if (dutyDates) open()
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

            // // return day if not same month
            // if (!isSameMonth(date, month)) {
            //   return day
            // }

            return (
              <ConditionalWrapper
                condition={
                  session?.user?.name?.toLowerCase() ===
                  dutyDates?.roster?.[day - 1]?.personnel?.toLowerCase()
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
                      {dutyDates?.roster?.[day - 1]?.personnel} (
                      {dutyDates?.roster?.[day - 1]?.standby})
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
