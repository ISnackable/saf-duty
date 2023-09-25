import { useEffect, useState } from 'react'
import type { User } from 'next-auth'
import {
  Avatar,
  Table,
  Group,
  Text,
  ActionIcon,
  ScrollArea,
  Select,
  Container,
  Title,
  createStyles,
  Button,
  NumberInput,
  Modal,
  TextInput,
  Skeleton,
  Grid,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconPencil, IconTrash, IconUsers, IconX } from '@tabler/icons-react'

import useUsers from '@/hooks/useUsers'
import { MAXIMUM_BLOCKOUTS } from '@/pages/manage-blockouts'

interface MaxBlockout {
  userId: string
  value: number | ''
}

const DEBOUNCE_TIME_MS = 500

const rolesData = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
]

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

AdminPage.title = 'Admin'

export default function AdminPage() {
  const { data: users, error, isLoading, mutate } = useUsers()

  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const [value, setValue] = useState<MaxBlockout>()
  const [debouncedValue] = useDebouncedValue(value, DEBOUNCE_TIME_MS)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    initialValues: {
      id: '',
      name: '',
      image: '',
      weekdayPoints: 0,
      weekendPoints: 0,
      extra: 0,
      enlistment: new Date(),
      ord: new Date(),
      blockouts: [] as Date[],
    },

    validate: {
      id: (value) => (value.length < 1 ? 'ID cannot be empty' : null),
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      extra: (value) => (value < 0 ? 'Points cannot be negative' : null),
      enlistment: (value, values) =>
        value && values?.ord && value?.getTime() >= values?.ord?.getTime()
          ? 'Enlistment date must be before ORD date'
          : null,
      ord: (value, values) =>
        value && values?.enlistment && value?.getTime() <= values?.enlistment?.getTime()
          ? 'ORD date must be after Enlistment date'
          : null,
    },
  })

  const openDeleteModal = (user: User) =>
    modals.openConfirmModal({
      title: `Delete ${user.name}'s account`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete {user.name}? This action is destructive and you will have
          to contact the developer to restore it.
        </Text>
      ),
      labels: { confirm: 'Delete account', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => modals.close,
      onConfirm: () => console.log('Confirmed'),
    })

  async function onResetPassword(userId: string) {
    if (!userId) return

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/sanity/user/${userId}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot reset password, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        showNotification({
          title: 'Success',
          message: 'Password reset successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  async function onRoleChange(userId: string, value: string | null) {
    setIsSubmitting(true)

    if (!value) return

    try {
      const res = await fetch(`/api/sanity/user/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: value,
        }),
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update user, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        if (mutate && users && users?.length > 0) {
          mutate(
            users.map((user) => (userId === user.id ? { ...user, maxBlockouts: value } : user)),
          )
        }
        showNotification({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  async function onMaxBlockoutsChange(userId: string, value: number | null) {
    setIsSubmitting(true)

    if (!value) return

    try {
      const res = await fetch(`/api/sanity/user/${userId}/maxBlockouts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxBlockouts: value,
        }),
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update user, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        if (mutate && users && users?.length > 0) {
          mutate(
            users.map((user) => (userId === user.id ? { ...user, maxBlockouts: value } : user)),
          )
        }
        showNotification({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  async function handleEditUserSubmit(values: typeof form.values) {
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/sanity/user/${values?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          image: values.image,
          weekdayPoints: values.weekdayPoints,
          weekendPoints: values.weekendPoints,
          extra: values.extra,
          enlistment: values?.enlistment
            ? values.enlistment.toLocaleDateString('sv-SE')
            : undefined,
          ord: values?.ord ? values.ord.toLocaleDateString('sv-SE') : undefined,
          blockouts:
            values?.blockouts && values?.blockouts?.length > 0
              ? values?.blockouts.map((date) => date.toLocaleDateString('sv-SE'))
              : undefined,
        }),
      })
      const data = await res.json()

      if (data?.status === 'error') {
        showNotification({
          title: 'Error',
          message: data?.message || 'Cannot update user, something went wrong',
          color: 'red',
          icon: <IconX />,
        })
      } else {
        if (mutate && users && users?.length > 0) {
          mutate(users.map((user) => (values.id === user.id ? { ...user, ...values } : user)))
        }
        showNotification({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
          icon: <IconCheck />,
        })
      }
    } catch (error) {
      console.error(error)
    }

    setIsSubmitting(false)
  }

  useEffect(() => {
    // Send request to update max blockouts
    if (!debouncedValue?.value || !debouncedValue?.userId) return

    // Triggers when "debouncedValue" changes
    onMaxBlockoutsChange(debouncedValue.userId, debouncedValue.value)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  if (error) return <div>failed to load</div>

  const rows = users?.map((user) => (
    <tr key={user.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={user.image} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {user.name}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        <Select
          data={rolesData}
          defaultValue={user.role}
          variant="unstyled"
          disabled={isSubmitting}
          onChange={(value) => onRoleChange(user.id, value)}
        />
      </td>
      <td>
        <NumberInput
          withAsterisk
          placeholder={`${MAXIMUM_BLOCKOUTS}`}
          max={120}
          min={0}
          disabled={isSubmitting}
          defaultValue={user.maxBlockouts ? user.maxBlockouts : MAXIMUM_BLOCKOUTS}
          onChange={(value) => setValue({ userId: user.id, value })}
        />
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon
            onClick={() => {
              // Set form values and reset dirty state
              form.setValues({
                id: user.id,
                name: user.name,
                image: user.image,
                weekdayPoints: user.weekdayPoints,
                weekendPoints: user.weekendPoints,
                extra: user.extra,
                enlistment: user?.enlistment ? new Date(user.enlistment) : undefined,
                ord: user?.ord ? new Date(user.ord) : undefined,
                blockouts:
                  user?.blockouts && user?.blockouts?.length > 0
                    ? user?.blockouts.map((date) => new Date(date))
                    : undefined,
              })
              form.resetDirty()

              // Open modal
              open()
            }}
          >
            <IconPencil size="1rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon color="red" onClick={() => openDeleteModal(user)}>
            <IconTrash size="1rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ))

  return (
    <>
      <Modal opened={opened} onClose={close} title="Edit user" centered size="xl">
        <form onSubmit={form.onSubmit(handleEditUserSubmit)}>
          <Grid gutter="xs">
            <Grid.Col span={4} xs={4} sm={2}>
              <Avatar size="xl" src={form.values.image} radius="xl" />
            </Grid.Col>
            <Grid.Col span={8} xs={8} sm={10}>
              <TextInput mt="sm" label="Name" placeholder="Name" {...form.getInputProps('name')} />
            </Grid.Col>
          </Grid>

          <TextInput
            mt="sm"
            label="Image"
            placeholder="Image URI"
            {...form.getInputProps('image')}
          />

          <Group mt="sm" grow>
            <NumberInput
              label="Weekday Pts"
              placeholder="Weekday Points"
              {...form.getInputProps('weekdayPoints')}
            />

            <NumberInput
              label="Weekend Pts"
              placeholder="Weekend Points"
              {...form.getInputProps('weekendPoints')}
            />

            <NumberInput
              label="No. of Extra"
              placeholder="0"
              max={120}
              min={0}
              {...form.getInputProps('extra')}
            />
          </Group>
          <Group mt="sm" grow>
            <DatePickerInput
              clearable
              label="Enlistment date"
              placeholder="Pick date"
              {...form.getInputProps('enlistment')}
            />

            <DatePickerInput
              clearable
              label="ORD date"
              placeholder="Pick date"
              {...form.getInputProps('ord')}
            />
          </Group>

          <DatePickerInput
            mt="sm"
            type="multiple"
            label="Blockout Dates"
            placeholder="Pick dates"
            {...form.getInputProps('blockouts')}
          />

          <Group position="right" mt="lg">
            <Button
              color="red"
              onClick={() => onResetPassword(form.values.id)}
              loading={isSubmitting}
            >
              Reset Password
            </Button>
            <Button color="gray" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          </Group>
        </form>
      </Modal>

      <Container my="xl" size="xl">
        <div className={classes.titleWrapper}>
          <IconUsers size={48} />
          <Title className={classes.title}>Manage Users</Title>
        </div>

        <Text color="dimmed" mt="md">
          View the overview of the users, you can edit the user role and extra information such as
          weekday points, weekend points, extras, etc.
        </Text>

        <ScrollArea>
          <Table miw={800} verticalSpacing="sm" mt="lg">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Maximum No. of Blockouts</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      <td>
                        <Skeleton height={40} />
                      </td>
                      <td>
                        <Skeleton height={40} />
                      </td>
                      <td>
                        <Skeleton height={40} />
                      </td>
                      <td>
                        <Skeleton height={40} />
                      </td>
                    </tr>
                  ))
                : rows}
            </tbody>
          </Table>
        </ScrollArea>
      </Container>
    </>
  )
}
