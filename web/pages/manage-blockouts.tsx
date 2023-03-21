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

const MAXIMUM_BLOCKOUTS = 12

ManageBlockoutPage.title = 'Manage Blockouts'

export default function ManageBlockoutPage() {
  const { data: session } = useSession()

  const { data: blockouts, error, mutate } = useBlockouts()

  const { classes } = useStyles()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selected, setSelected] = useState<Date[]>([])

  useEffect(() => {
    setSelected(blockouts ? blockouts.map((date) => new Date(date)) : [])
  }, [blockouts])

  const handleSelect = (date: Date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, 'date'))
    const currentMonthSelected = selected.filter((d) => dayjs(d).isSame(date, 'month'))

    let firstDay = dayjs(date).startOf('month')
    const lastDay = dayjs(date).endOf('month')

    const weekends = []
    while (firstDay.isBefore(lastDay, 'day')) {
      if (isWeekend(firstDay.toDate())) {
        weekends.push(firstDay.toDate())
      }
      firstDay = firstDay.add(1, 'day')
    }

    const numWeekends = weekends.length
    const numSelectedWeekends = weekends.filter((w) =>
      currentMonthSelected.some((s) => dayjs(s).isSame(w, 'date'))
    ).length
    const canSelectWeekend = numSelectedWeekends < numWeekends - 1

    if (isSelected) {
      setSelected((current) => current.filter((d) => !dayjs(d).isSame(date, 'date')))
    } else if (
      currentMonthSelected.length !== MAXIMUM_BLOCKOUTS &&
      !currentMonthSelected.includes(date) &&
      canSelectWeekend
    ) {
      setSelected((current) =>
        current.includes(date)
          ? current.filter((d) => !dayjs(d).isSame(date, 'date'))
          : [...current, date]
      )
    }
  }

  //sent blockout date to back end
  const handleClick = async () => {
    setIsSubmitting(true)
    try {
      const blockoutDates = selected.map((date) =>
        date.toLocaleDateString('sv-SE')
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
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update block out dates, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        if (mutate) {
          mutate(blockoutDates)
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
    <Container my="xl">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Manage Blockouts</Title>
      </div>

      <Text color="dimmed" mt="md">
        View and manage your blockouts. To add a blockout, click on the date you want to block out.
        To remove a blockout, click on the date again. The day you selected will be highlighted. You
        are only able to block out dates within the current month and next month.
      </Text>
      <List mt="lg">
        <List.Item>Unless you have a valid reason;</List.Item>
        <List.Item>
          Only a maximum of {MAXIMUM_BLOCKOUTS} blockouts date per month (subject to change)
        </List.Item>
        <List.Item>Inform the person-in-charge of the duty roster your reason</List.Item>
        <List.Item>You are not allowed to blockout every weekend of the month</List.Item>
      </List>
      <Divider mt="sm" />

      <DatePicker
        mt="lg"
        type="multiple"
        maxLevel="month"
        withCellSpacing={false}
        hideOutsideDates
        size="xl"
        minDate={dayjs(new Date()).startOf('month').toDate()}
        maxDate={dayjs(new Date()).endOf('month').add(1, 'month').toDate()}
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
        <Button onClick={handleClick} type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </Group>
    </Container>
  )
}
