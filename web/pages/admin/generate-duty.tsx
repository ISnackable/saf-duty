import { forwardRef, useEffect, useState } from 'react'
import {
  Avatar,
  Container,
  createStyles,
  Group,
  Select,
  Text,
  Title,
  MultiSelect,
  Button,
  Flex,
  Table,
  Modal,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Calendar, MonthPickerInput, DatePickerInput, isSameMonth } from '@mantine/dates'
import { notifications, showNotification } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import {
  IconAlertCircle,
  IconCheck,
  IconChessKnight,
  IconDatabase,
  IconX,
} from '@tabler/icons-react'

import { createDutyRoster, DutyDate, isWeekend, Personnel } from '@/utils/dutyRoster'
import useUsers from '@/hooks/useUsers'
import useCalendar from '@/hooks/useCalendar'

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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
  image: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{label}</Text>
        </div>
      </Group>
    </div>
  )
)

SelectItem.displayName = 'SelectItem'
GenerateDutyPage.title = 'Generate Duty'

const today = new Date()
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

export default function GenerateDutyPage() {
  const { data: users, error } = useUsers()
  const { data: calendar } = useCalendar()

  const data = users?.map((user) => ({
    label: user.name || 'Default',
    value: user.name || 'default',
    image: user.image || '',
  }))
  const { classes } = useStyles()

  const [dutyRoster, setDutyRoster] = useState<DutyDate[]>([])
  const [dutyPersonnelState, setDutyPersonnelState] = useState<Personnel[]>([])

  const [modalDateValue, setModalDateValue] = useState<Date>(firstDay)
  const [modalDPValue, setModalDPValue] = useState<string | null | undefined>(null)
  const [modalSBValue, setModalSBValue] = useState<string | null | undefined>(null)
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([])

  const [extraDate, setExtraDate] = useState<Date[]>([])
  const [month, onMonthChange] = useState<Date | null>(firstDay)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    if (modalDPValue !== null && modalSBValue !== null) {
      open()
    }
  }, [open, modalDPValue, modalSBValue])

  // Make sure extraDates is cleared whenever new month is selected
  useEffect(() => {
    // if there is a calendar for the selected month, set the duty roster
    const dutyDates = calendar?.find((cal) => isSameMonth(new Date(cal.date), month || firstDay))
    if (dutyDates) {
      const roster = dutyDates.roster.map((date) => ({
        date: new Date(date.date),
        personnel: date.personnel,
        standby: date.standby,
        isExtra: false,
        blockout: [],
        isWeekend: false,
        allocated: false,
      }))
      setDutyRoster(roster)

      const dutyPersonnel = users?.map((user) => {
        const WD_DONE = dutyDates.roster.filter(
          (date) => !isWeekend(new Date(date.date)) && date.personnel === user.name
        ).length
        const WE_DONE = dutyDates.roster.filter(
          (date) => isWeekend(new Date(date.date)) && date.personnel === user.name
        ).length
        const blockouts = user.blockouts?.map((blockout) => new Date(blockout))

        return {
          ...user,
          blockouts,
          WD_RM: 0, // Weekday Remaining
          SBWD_RM: 0, // Stand In/Stand By weekend
          WD_DONE, // No. Weekdays duty assigned
          WE_RM: 0, // Weekend Remaining
          SBWE_RM: 0, // Stand In/Stand By weekend
          WE_DONE, // No. Weekends duty assigned
          SB_COUNT: 0, // Total stand in count
          EX_DONE: 0, // Extra Cleared,
        }
      })

      if (dutyPersonnel) {
        setDutyPersonnelState(dutyPersonnel)
      }

      setMultiSelectValue(
        Array.from(new Set(dutyDates.roster.map((date) => date.personnel).filter(Boolean)))
      )
    } else if (month) {
      setDutyRoster([])
      setExtraDate([])
      setDutyPersonnelState([])
    }
  }, [calendar, month, users])

  if (error) return <div>Failed to load</div>

  //sent blockout date to back end
  const handleSave = async () => {
    setIsSubmitting(true)

    const dutyDates = [...dutyRoster].map((date) => ({
      date: date.date.toLocaleDateString('sv-SE'),
      personnel: date.personnel,
      standby: date.standby,
    }))
    const dutyPersonnel = [...dutyPersonnelState].map((personnel) => ({
      id: personnel.id,
      name: personnel.name,
      weekdayPoints: personnel.weekdayPoints,
      weekendPoints: personnel.weekendPoints,
      extra: personnel.extra,
    }))

    try {
      const res = await fetch('/api/sanity/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dutyDates,
          dutyPersonnel,
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

  const handleClick = () => {
    const personnel = [...(users || [])].filter((user) =>
      multiSelectValue.includes(user.name || '')
    )

    notifications.clean()

    if (personnel.length > 3 && month) {
      try {
        const { dutyPersonnel, dutyDates } = createDutyRoster(personnel, month, extraDate)
        setDutyRoster(dutyDates)
        setDutyPersonnelState(dutyPersonnel)

        showNotification({
          title: 'Success',
          message: 'Successfully generated duty roster',
          color: 'green',
          icon: <IconCheck />,
        })
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
          showNotification({
            title: 'Error',
            message: `${error.message}, you can try again or contact the developer`,
            color: 'red',
            icon: <IconX />,
          })
        }
      }
    } else {
      showNotification({
        title: 'Warning',
        message: 'You need to select at least 4 personnels',
        color: 'yellow',
        icon: <IconAlertCircle />,
      })
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={modalDateValue?.toLocaleDateString()}
        centered
        size="xl"
      >
        <Text fz="sm" mb="sm">
          Please select the duty personnel and the stand in for{' '}
          {modalDateValue?.toLocaleDateString()}. You should make sure that the stand in is not the
          same person as the duty personnel. It is also recommended that the duty personnel/stand in
          is not the same person as the next/previous person.
        </Text>
        <Group grow>
          <Select
            label="Duty personnel"
            searchable
            value={modalDPValue}
            onChange={setModalDPValue}
            data={data || []}
          />
          <Select
            label="Stand in"
            searchable
            value={modalSBValue}
            onChange={setModalSBValue}
            data={data || []}
          />
        </Group>

        <Group position="right" mt="xl">
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newDutyRoster = [...dutyRoster]
              const newDutyPersonnel = [...dutyPersonnelState]
              const index = newDutyRoster.findIndex(
                (date) => date.date.setHours(0, 0, 0) === modalDateValue.setHours(0, 0, 0)
              )

              const newPersonnel = newDutyPersonnel.find(
                (personnel) => personnel.name === modalDPValue
              )
              const oldPersonnel = newDutyPersonnel.find(
                (personnel) => personnel.name === newDutyRoster[index]?.personnel
              )

              if (index !== -1 && newPersonnel && oldPersonnel) {
                newDutyRoster[index].personnel = modalDPValue || ''
                newDutyRoster[index].standby = modalSBValue || ''

                if (isWeekend(modalDateValue)) {
                  newPersonnel.WE_DONE += 1
                  oldPersonnel.WE_DONE -= 1
                  newPersonnel.weekendPoints += 1
                  oldPersonnel.weekendPoints -= 1
                } else {
                  newPersonnel.WD_DONE += 1
                  oldPersonnel.WD_DONE -= 1
                  newPersonnel.weekdayPoints += 1
                  oldPersonnel.weekdayPoints -= 1
                }

                setDutyRoster(newDutyRoster)
                setDutyPersonnelState(newDutyPersonnel)

                showNotification({
                  title: 'Success',
                  message: `Successfully updated ${modalDateValue?.toLocaleDateString()}`,
                  color: 'green',
                  icon: <IconCheck />,
                })

                // Check if the duty personnel/stand in has more than 2 consecutive days of duty/standby
                if (
                  (newDutyRoster[index + 1] &&
                    newDutyRoster[index + 1].personnel === modalDPValue) ||
                  newDutyRoster[index + 1].standby === modalSBValue ||
                  (newDutyRoster[index - 1] &&
                    newDutyRoster[index - 1].personnel === modalDPValue) ||
                  newDutyRoster[index - 1].standby === modalSBValue
                ) {
                  showNotification({
                    title: 'Warning',
                    message: `The duty personnel/stand in has more than 2 consecutive days of duty/standby`,
                    color: 'yellow',
                    autoClose: 2000,
                    icon: <IconAlertCircle />,
                  })
                }
              }

              close()
            }}
          >
            Save
          </Button>
        </Group>
      </Modal>
      <Container my="xl">
        <div className={classes.titleWrapper}>
          <IconChessKnight size={48} />
          <Title className={classes.title}>Generate Duty</Title>
        </div>

        <Text color="dimmed" mt="md">
          Generate the duty roster for the selected month & year with the given personnels. The
          algorithm will try to generate the duty roster such that each personnel will have an equal
          number of duty days and duty weekends and try to make sure that the duty personnel/stand
          in has less than 2 consecutive days of duty/standby. It uses weekendPoints and
          weekdayPoints to determine the number of duty days and duty weekends. Personnel with lower
          points will have more duty.
        </Text>

        <Group grow>
          <MonthPickerInput
            mt="sm"
            label="Duty date"
            placeholder="Pick date"
            value={month}
            onChange={onMonthChange}
          />
          <DatePickerInput
            mt="sm"
            date={month || new Date()}
            value={extraDate}
            onChange={setExtraDate}
            clearable
            hideOutsideDates
            maxLevel="month"
            type="multiple"
            label="Extra date(s)"
            placeholder="Pick date"
            excludeDate={(date) => {
              if (month && !isSameMonth(date, month)) return true
              else if (date.getDay() === 0 || date.getDay() === 6) return false

              return true
            }}
          />
        </Group>

        <MultiSelect
          mt="sm"
          value={multiSelectValue}
          onChange={setMultiSelectValue}
          data={data || []}
          label="Choose personnel doing duties"
          placeholder="Pick all you like"
          itemComponent={SelectItem}
          searchable
          nothingFound="Nobody here"
          maxDropdownHeight={400}
          clearButtonProps={{ 'aria-label': 'Clear selection' }}
          clearable
          filter={(value, selected, item) =>
            !selected &&
            (item?.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
              item?.description?.toLowerCase().includes(value.toLowerCase().trim()))
          }
        />

        <Calendar
          mt="lg"
          maxLevel="month"
          date={month || new Date()}
          hideOutsideDates
          size="xl"
          getDayProps={(date) => ({
            onClick: () => {
              const day = date.getDate()

              if (dutyRoster.length > 0) {
                if (date.valueOf() === modalDateValue.valueOf()) {
                  open()
                } else {
                  setModalDateValue(date)
                  setModalDPValue(dutyRoster?.[day - 1]?.personnel)
                  setModalSBValue(dutyRoster?.[day - 1]?.standby)
                }
              }
            },
          })}
          styles={(theme) => ({
            calendar: {
              maxWidth: '100%',
            },
            calendarHeader: {
              maxWidth: '100%',
            },
            calendarHeaderControl: {
              display: 'none',
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
          renderDay={(date) => {
            const day = date.getDate()

            if (dutyRoster?.length > 0) {
              return (
                <Flex mih="100%" direction="column">
                  <Text fz="sm" ta="right" mb="auto" mt="xs" mr="xs">
                    {day}
                  </Text>

                  <Text size="xs" align="center" mb="auto">
                    {dutyRoster?.[day - 1]?.personnel} ({dutyRoster?.[day - 1]?.standby}) )
                  </Text>
                </Flex>
              )
            }
          }}
        />

        <Group position="right">
          <Button
            mt="xl"
            color="teal.6"
            onClick={handleClick}
            leftIcon={<IconDatabase size="1rem" />}
          >
            Generate
          </Button>
          <Button
            mt="xl"
            onClick={() => {
              const dutyDates = calendar?.find((cal) =>
                isSameMonth(new Date(cal.date), month || firstDay)
              )

              if (dutyDates) {
                modals.openConfirmModal({
                  title: 'Are you sure?',
                  centered: true,
                  children: (
                    <Text size="sm">
                      There are already duty generated for{' '}
                      {month?.toLocaleString('default', { month: 'long', year: 'numeric' })}. Are
                      you sure you want to overwrite it? This action cannot be undone.
                    </Text>
                  ),
                  labels: { confirm: 'Confirm', cancel: 'Cancel' },
                  onConfirm: () => handleSave(),
                })
              } else if (dutyRoster.length > 0) {
                handleSave()
              } else {
                showNotification({
                  title: 'Error',
                  message: 'Please generate duty first',
                  color: 'red',
                  icon: <IconX />,
                })
              }
            }}
            loading={isSubmitting}
          >
            Save
          </Button>
        </Group>

        {multiSelectValue.length > 0 && (
          <Table mt="xl" withBorder withColumnBorders>
            <thead>
              <tr>
                <th>Personnel</th>
                <th>Weekday Points</th>
                <th>Weekend Points</th>
                <th>Extras</th>
                <th>No. of duties</th>
              </tr>
            </thead>
            <tbody>
              {multiSelectValue.map((person) => {
                const user = users?.find((user) => user?.name === person)
                const dutyPersonnel = dutyPersonnelState?.find((user) => user?.name === person)

                return (
                  <tr key={person}>
                    <td>{person}</td>
                    <td>{`${user?.weekdayPoints} ${
                      dutyPersonnel ? ' ⟶ ' + dutyPersonnel.weekdayPoints : ''
                    }`}</td>
                    <td>{`${user?.weekendPoints} ${
                      dutyPersonnel ? ' ⟶ ' + dutyPersonnel.weekendPoints : ''
                    }`}</td>
                    <td>{`${user?.extra} ${dutyPersonnel ? ' ⟶ ' + dutyPersonnel.extra : ''}`}</td>
                    <td>{`${dutyPersonnel ? dutyPersonnel.WD_DONE : 0} weekday, ${
                      dutyPersonnel ? dutyPersonnel.WE_DONE : 0
                    } weekend --- Total: (${
                      dutyPersonnel ? dutyPersonnel.WD_DONE + dutyPersonnel.WE_DONE : 0
                    })`}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  )
}
