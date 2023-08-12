import dayjs from 'dayjs'
import { Table } from '@mantine/core'

import {
  createStyles,
  Progress,
  Text,
  Group,
  Paper,
  Badge,
  Divider,
  Title,
  Container,
} from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'

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

  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: '3px solid',
    paddingBottom: 5,
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },
}))

// Set the payday date to the 10th of every month
const PAYDAY_DAY = 10

// Get the current date
const today = dayjs()

// Calculate the next payday date
let nextPayday = today.date(PAYDAY_DAY)

// If the 10th day of the current month has already passed, calculate the next month's payday
if (today.date() > PAYDAY_DAY) {
  nextPayday = today.add(1, 'month').date(PAYDAY_DAY)
}

// Calculate the number of days left until the next payday
const daysLeft = nextPayday.diff(today, 'day')
const daysTotal = nextPayday.daysInMonth()

// Calculate the progress towards the next PAYDAY_DAY as a percentage
const progress = Math.floor(((daysTotal - daysLeft) / daysTotal) * 100)

const elements = [
  { rankStarting: 'Recruit (REC) or Private (PTE)', rankAllowance: '$755' },
  { rankStarting: 'Lance-Corporal (LCP)', rankAllowance: '$775' },
  { rankStarting: 'Corporal (CPL)', rankAllowance: '$825' },
  { rankStarting: 'Corporal First Class (CFC)', rankAllowance: '$865' },
  { rankStarting: '3rd Sergeant (3SG)', rankAllowance: '$1,075' },
  { rankStarting: '2nd Sergeant (2SG)', rankAllowance: '$1,175' },
  { rankStarting: '2nd Lieutenant (2LT)', rankAllowance: '$1,275' },
  { rankStarting: 'Lieutenant (LTA)', rankAllowance: '$1,455' },
]
const vocation = [
  {
    vocation: 'Service and Technical vocations',
    vocationAllowance: '$75',
  },
  {
    vocation: 'All combatants',
    vocationAllowance: '$225',
  },
]

PayDayPage.title = 'Pay Day'

export default function PayDayPage() {
  const { classes } = useStyles()

  const rows = elements.map((element) => (
    <tr key={element.rankStarting}>
      <td>{element.rankStarting}</td>
      <td>{element.rankAllowance}</td>
    </tr>
  ))
  const vocations = vocation.map((vocation) => (
    <tr key={vocation.vocation}>
      <td>{vocation.vocation}</td>
      <td>{vocation.vocationAllowance}</td>
    </tr>
  ))

  return (
    <Container my="xl" size="xl">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Pay Day</Title>
      </div>

      <Text color="dimmed" mt="md">
        A countdown to the next Pay Day is shown below to help you survive your NS experience. Pay
        Day is on the 10th of every month.
      </Text>

      <Divider mt="sm" />
      <Paper withBorder p="md" radius="md" mt="xl">
        <Group position="apart">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Pay Day Countdown
            </Text>
          </Group>
        </Group>

        <Progress
          value={progress}
          color="#47d6ab"
          label={`${progress}%`}
          size={34}
          classNames={{ label: classes.progressLabel }}
          mt={40}
        />
        <Group position="apart" mt="md">
          <Text size="sm">{today.format('D MMM YYYY')}</Text>
          <Badge size="sm">{daysLeft} days left</Badge>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md" mt="xl">
        <Group position="apart" mb="sm">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Monthly rank allowance
            </Text>
          </Group>
        </Group>

        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Starting Rank Allowance</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Paper>

      <Paper withBorder p="md" radius="md" mt="xl">
        <Group position="apart" mb="sm">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Monthly vocation allowance
            </Text>
          </Group>
        </Group>

        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Vocations</th>
              <th>Monthly vocation allowance</th>
            </tr>
          </thead>
          <tbody>{vocations}</tbody>
        </Table>
      </Paper>
    </Container>
  )
}
