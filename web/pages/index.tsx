import { useState } from 'react'
import type { GetServerSidePropsContext } from 'next'
import { Container, createStyles, Divider, Text, Title, Flex } from '@mantine/core'
import { Calendar, isSameMonth } from '@mantine/dates'
import { getServerSession } from 'next-auth/next'
import { IconCalendarEvent } from '@tabler/icons-react'

import { authOptions } from './api/auth/[...nextauth]'
import { getAllCalendar } from '@/lib/sanity.client'
import { type Calendar as CalendarType } from '@/lib/sanity.queries'
import * as demo from '@/lib/demo.data'
import config from '@/../site.config'

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

export default function IndexPage({ calendar }: { calendar: CalendarType[] }) {
  const { classes } = useStyles()

  const [month, setMonth] = useState(new Date())
  const dutyDates = calendar.find((cal) => isSameMonth(cal.date, month))

  return (
    <Container my="xl">
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
        static
        mt="lg"
        maxLevel="month"
        // fullWidth
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
          // Check if date isWeekend
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const isToday = date.toDateString() === new Date().toDateString()

          if (isToday) {
            return {
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
              sx: (theme) => ({
                color: `${
                  theme.colorScheme === 'dark' ? theme.colors.pink[2] : theme.colors.pink[4]
                } !important`,
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
              }),
            }
          }
          return {}
        }}
        renderDay={(date) => {
          const day = date.getDate()

          // return day if not same month
          if (!isSameMonth(date, month)) {
            return day
          }

          return (
            <Flex mih={50} justify="center" align="center" direction="column">
              <div>{day}</div>
              {dutyDates && (
                <Text size="xs" align="center">
                  {dutyDates?.roster?.[day - 1]?.personnel} ({dutyDates?.roster?.[day - 1]?.standby}
                  )
                </Text>
              )}
            </Flex>
          )
        }}
      />
    </Container>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  let calendar: CalendarType[] = demo.calendar
  if (session?.user?.id !== config.demoUserId) {
    calendar = await getAllCalendar()
  }

  return {
    props: { calendar },
  }
}
