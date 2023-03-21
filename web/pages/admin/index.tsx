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
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'
import { IconPencil, IconTrash, IconUsers } from '@tabler/icons-react'
import dayjs from 'dayjs'

import useUsers from '@/hooks/useUsers'

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
  const { data: users, error, isLoading } = useUsers()

  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      image: '',
      weekdayPoints: 0,
      weekendPoints: 0,
    },

    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    },
  })

  if (error) return <div>failed to load</div>

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
        <Select data={rolesData} defaultValue={user.role} variant="unstyled" />
      </td>
      <td>
        <Text fz="sm" c="dimmed">
          <NumberInput
            withAsterisk
            defaultValue={user.extra}
            placeholder="extra"
            max={120}
            min={0}
          />
        </Text>
      </td>
      <td>
        <Group spacing={0} position="right">
          <ActionIcon onClick={open}>
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
        <div>
          <TextInput mt="sm" label="Name" placeholder="Name" {...form.getInputProps('name')} />
          <TextInput
            mt="sm"
            label="Image"
            placeholder="Image URI"
            {...form.getInputProps('image')}
          />

          <Group grow>
            <NumberInput
              mt="sm"
              label="Weekday Points"
              placeholder="Weekday Points"
              {...form.getInputProps('weekdayPoints')}
            />

            <NumberInput
              mt="sm"
              label="Weekend Points"
              placeholder="Weekend Points"
              {...form.getInputProps('weekendPoints')}
            />
          </Group>
          <Group grow>
            <DatePickerInput
              clearable
              mt="sm"
              label="Enlistment date"
              placeholder="Pick date"
              {...form.getInputProps('enlistment')}
            />

            <DatePickerInput
              clearable
              mt="sm"
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
            minDate={dayjs(new Date()).startOf('month').toDate()}
            maxDate={dayjs(new Date()).endOf('month').add(1, 'month').toDate()}
          />

          <Group position="right" mt="lg">
            <Button color="gray">Cancel</Button>
            <Button type="submit">Save</Button>
          </Group>
        </div>
      </Modal>

      <Container my="xl">
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
                <th>Extra</th>
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

        <Group position="right" mt="xl">
          <Button
            color="gray"
            onClick={() => {
              console.log('DaD')
              // close()
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Container>
    </>
  )
}
