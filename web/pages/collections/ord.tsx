import Link from 'next/link'
import {
  Anchor,
  Badge,
  Blockquote,
  Container,
  createStyles,
  Divider,
  Group,
  Paper,
  Progress,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconCalendarStats, IconRun } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'

const ICON_SIZE = 60

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

  card: {
    position: 'relative',
    overflow: 'visible',
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE / 3}px)`,
  },

  icon: {
    position: 'absolute',
    top: -ICON_SIZE / 3,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },
}))

ORDPage.title = 'ORD Progress'

export default function ORDPage() {
  const { data: session } = useSession()

  const { classes } = useStyles()
  const today = dayjs()
  const enlist = dayjs(session?.user?.enlistment)
  const ord = dayjs(session?.user?.ord)
  // Calculate number of days between dates
  const diff = ord.diff(today, 'day')
  const total = ord.diff(enlist, 'day')
  const current = today.diff(enlist, 'day')

  const ordProgress = Math.round((current / total) * 100)

  return (
    <Container my="xl">
      <div className={classes.titleWrapper}>
        <IconCalendarStats size={48} />
        <Title className={classes.title}>ORD</Title>
      </div>

      <Text color="dimmed" mt="md">
        ORD is the date when full-time national servicemen (Singaporean Males) complete their 2
        years (previously 2.5 years) compulsory service in the Singapore Army, Navy, Police or Civil
        Defence Force.
      </Text>
      <Divider mt="sm" />

      <Paper radius="md" withBorder className={classes.card} mt={80}>
        <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
          <IconRun size={34} stroke={1.5} />
        </ThemeIcon>

        <Text align="center" weight={700} className={classes.title}>
          ORD
        </Text>

        <Blockquote cite={`– ${session?.user?.name || 'Some NSF'}`}>ORD loh!!</Blockquote>

        {session?.user?.enlistment && session?.user?.ord ? (
          <>
            <Group position="apart" mt="xs">
              <Text size="sm" color="dimmed">
                Progress
              </Text>
              <Text size="sm" color="dimmed">
                {ordProgress}%
              </Text>
            </Group>

            <Progress value={ordProgress} mt={5} animate color="teal" />

            <Group position="apart" mt="md">
              <Text size="sm">
                {current} / {total} days
              </Text>
              <Badge size="sm">{diff} days left</Badge>
            </Group>
          </>
        ) : (
          <Text size="sm" color="red" align="center">
            Enlistment and ORD dates are not set. Head over to your{' '}
            <Anchor component={Link} href="/profile">
              profile page
            </Anchor>{' '}
            to set them. Once set, you will be able to see your ORD progress here.
          </Text>
        )}
      </Paper>
    </Container>
  )
}
