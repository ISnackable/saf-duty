import { useEffect, useState } from 'react'
import {
  Avatar,
  Center,
  Container,
  createStyles,
  Divider,
  Group,
  Progress,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { keys } from '@mantine/utils'
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react'
import dayjs from 'dayjs'

import type { AllSanityUser } from '@/lib/sanity.queries'
import useUsers from '@/hooks/useUsers'

type RowData = Pick<AllSanityUser, 'name' | 'image' | 'ord' | 'totalDutyDone'>

interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

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

  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
  },

  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}))

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys(data[0]).some((key) => String(item[key]).toLowerCase().includes(query))
  )
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload

  if (!sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return String(b[sortBy]).localeCompare(String(a[sortBy]), undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      }

      return String(a[sortBy]).localeCompare(String(b[sortBy]), undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    }),
    payload.search
  )
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles()
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  )
}

DutyPersonnelsPage.title = 'Duty Personnels'

// q: What formula do I use calculate the progress between today and an end date?
// a: https://stackoverflow.com/a/2627493/104380

export default function DutyPersonnelsPage() {
  const { data: users, isLoading } = useUsers()
  const data = users?.map((user) => ({
    name: user.name,
    image: user.image,
    ord: user.ord,
    totalDutyDone: user.totalDutyDone,
  })) as RowData[]

  const { classes } = useStyles()
  const [search, setSearch] = useState('')
  const [sortedData, setSortedData] = useState<RowData[]>([])
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  useEffect(() => {
    setSortedData(data ? data : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearch(value)
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }))
  }

  const rows = sortedData?.map((row) => {
    const today = dayjs()
    const enlist = dayjs(`2022-06-05`)
    const ord = dayjs(row?.ord)
    // Calculate number of days between dates
    const total = ord.diff(enlist, 'day')
    const current = today.diff(enlist, 'day')

    const ordProgress = Math.round((current / total) * 100)

    return (
      <tr key={row.name}>
        <td>
          <Group spacing="sm">
            <Avatar size={26} src={row.image} radius={26} />
            <Text size="sm" weight={500}>
              {row.name}
            </Text>
          </Group>
        </td>
        <td>{row.totalDutyDone}</td>
        <td>{row?.ord ? dayjs(row?.ord).format('DD/MM/YYYY') : 'NILL'}</td>
        <td>
          <Progress classNames={{ bar: classes.progressBar }} color="teal" value={ordProgress} />
        </td>
      </tr>
    )
  })

  return (
    <Container my="xl" size="xl">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Duty Personnels</Title>
      </div>

      <Text color="dimmed" mt="md">
        View the list of duty personnels who are doing duties.
      </Text>
      <Divider mt="sm" />

      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size={14} stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <Table highlightOnHover sx={{ minWidth: 700 }} horizontalSpacing="md" verticalSpacing="sm">
          <thead>
            <tr>
              <Th
                sorted={sortBy === 'name'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('name')}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === 'totalDutyDone'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('totalDutyDone')}
              >
                Total duties done
              </Th>
              <Th
                sorted={sortBy === 'ord'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('ord')}
              >
                ORD
              </Th>
              <Th
                sorted={sortBy === 'ord'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('ord')}
              >
                ORD Progress
              </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  <td>
                    <Skeleton height={30} />
                  </td>
                  <td>
                    <Skeleton height={30} />
                  </td>
                  <td>
                    <Skeleton height={30} />
                  </td>
                  <td>
                    <Skeleton height={30} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </Container>
  )
}
