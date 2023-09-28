import { useEffect, useState } from 'react'
import { Container, createStyles, Divider, List, Text, Title, Button, Group } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconEdit } from '@tabler/icons-react'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'

import { TDateISODate } from '@/lib/sanity.queries'
import { isWeekend } from '@/utils/dutyRoster'
import useBlockouts from '@/hooks/useBlockouts'

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

export const MAXIMUM_BLOCKOUTS = 8
const TODAY = new Date()
const MIN_MONTH = dayjs(TODAY).startOf('month').toDate()
const MAX_MONTH = dayjs(TODAY).endOf('month').add(2, 'month').toDate()

ManageBlockoutPage.title = 'Manage Blockouts'

export default function ManageBlockoutPage() {
  const { data: session } = useSession()

  const { data, error, mutate } = useBlockouts()

  const { classes } = useStyles()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selected, setSelected] = useState<Date[]>([])
  const maximumBlockouts = data?.maxBlockouts || MAXIMUM_BLOCKOUTS

  useEffect(() => {
    if (data?.blockouts) {
      setSelected(
        data.blockouts
          ? data.blockouts
              .filter(
                (date) =>
                  new Date(date).getTime() >= MIN_MONTH.getTime() &&
                  new Date(date).getTime() <= MAX_MONTH.getTime(),
              )
              .map((date) => new Date(date))
          : [],
      )
    }
  }, [data?.blockouts])

  const handleSelect = (date: Date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, 'date'))
    const currentMonthSelected = selected.filter((d) => dayjs(d).isSame(date, 'month'))

    const currentMonth = dayjs(date).startOf('month')
    const lastDayOfMonth = dayjs(date).endOf('month')

    const { weekends, fridays } = calculateWeekendsAndFridays(currentMonth, lastDayOfMonth)
    const numWeekends = weekends.size
    const numFridays = fridays.size

    const numSelectedWeekends = countSelectedDates(weekends, currentMonthSelected)
    const numSelectedFridays = countSelectedDates(fridays, currentMonthSelected)

    const canSelectWeekend = numSelectedWeekends < numWeekends - 2
    const canSelectFriday = numSelectedFridays < numFridays - 1

    if (isSelected) {
      setSelected((current) => current.filter((d) => !dayjs(d).isSame(date, 'date')))
    } else if (
      currentMonthSelected.length !== maximumBlockouts &&
      !currentMonthSelected.includes(date)
    ) {
      if ((dayjs(date).day() === 5 && !canSelectFriday) || (isWeekend(date) && !canSelectWeekend)) {
        return
      }

      setSelected((current) =>
        current.includes(date)
          ? current.filter((d) => !dayjs(d).isSame(date, 'date'))
          : [...current, date],
      )
    }
  }

  function calculateWeekendsAndFridays(currentMonth: dayjs.Dayjs, lastDayOfMonth: dayjs.Dayjs) {
    const weekends = new Set<Date>()
    const fridays = new Set<Date>()

    while (currentMonth.isBefore(lastDayOfMonth, 'day')) {
      if (isWeekend(currentMonth.toDate())) {
        weekends.add(currentMonth.toDate())
      } else if (currentMonth.day() === 5) {
        fridays.add(currentMonth.toDate())
      }
      currentMonth = currentMonth.add(1, 'day')
    }

    return { weekends, fridays }
  }

  function countSelectedDates(dates: Set<Date>, currentMonthSelected: Date[]) {
    return Array.from(dates).filter((d) =>
      currentMonthSelected.some((s) => dayjs(s).isSame(d, 'date')),
    ).length
  }

  //sent blockout date to back end
  const handleClick = async () => {
    setIsSubmitting(true)
    try {
      const blockoutDates = selected.map((date) =>
        date.toLocaleDateString('sv-SE'),
      ) as TDateISODate[]

      const res = await fetch(`/api/sanity/user/${session?.user?.id}/blockouts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blockoutDates,
        }),
      })
      const resData = await res.json()

      if (resData?.status === 'error') {
        showNotification({
          title: 'Error',
          message: resData?.message || 'Cannot update block out dates, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        if (mutate && data) {
          mutate({ ...data, blockouts: blockoutDates })
        }

        showNotification({
          title: 'Success',
          message: 'Blockout updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  if (error) return <div>failed to load</div>

  return (
    <Container my="xl" size="xl">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Manage Blockouts</Title>
      </div>

      <Text color="dimmed" mt="md">
        View and manage your blockouts. The day you selected will be your blockout date,{' '}
        <b>
          <u>make sure to save</u>
        </b>{' '}
        after you are done.
      </Text>
      <List mt="lg">
        <List.Item>
          Only a maximum of {maximumBlockouts} blockouts date per month (subject to change)
        </List.Item>
        <List.Item>Inform the person-in-charge if you need more blockouts</List.Item>
        <List.Item>
          You are not allowed to blockout every <u>weekend & friday</u> of the month
        </List.Item>
      </List>
      <Divider mt="sm" />

      <DatePicker
        mt="lg"
        type="multiple"
        maxLevel="month"
        withCellSpacing={false}
        hideOutsideDates
        size="xl"
        defaultDate={dayjs(TODAY).add(1, 'month').toDate()}
        minDate={MIN_MONTH}
        maxDate={MAX_MONTH}
        getDayProps={(date) => {
          const isWeekend = date.getDay() === 0 || date.getDay() === 6

          return {
            selected: selected.some((s) => dayjs(date).isSame(s, 'date')),
            onClick: () => handleSelect(date),
            ...(isWeekend && {
              sx: (theme) => ({
                color: `${
                  theme.colorScheme === 'dark' ? theme.colors.pink[2] : theme.colors.pink[4]
                } !important`,
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
              }),
            }),
          }
        }}
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
            '[data-selected]': {
              borderRadius: 0,
            },
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
      />
      <Group position="right" mt="lg">
        <Button onClick={handleClick} type="submit" loading={isSubmitting}>
          Save
        </Button>
      </Group>
    </Container>
  )
}
