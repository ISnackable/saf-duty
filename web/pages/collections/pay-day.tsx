import type { GetServerSidePropsContext } from 'next'
import type { User } from 'next-auth'
import {
  createStyles,
  Progress,
  Box,
  Text,
  Group,
  Paper,
  SimpleGrid,
  Divider,
  Title,
  Container,
} from '@mantine/core'
import { getServerSession } from 'next-auth/next'
import { IconArrowUpRight, IconDeviceAnalytics, IconEdit } from '@tabler/icons-react'

import { authOptions } from '../api/auth/[...nextauth]'

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

const data = [
  {
    label: 'Total earned',
    count: '204,001',
    part: 59,
    color: '#47d6ab',
  },
]

const diff = 18

PayDayPage.title = 'Pay Day'

export default function PayDayPage() {
  const { classes } = useStyles()

  const segments = data.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part}%` : undefined,
  }))

  const descriptions = data.map((stat) => (
    <Box key={stat.label} sx={{ borderBottomColor: stat.color }} className={classes.stat}>
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700}>{stat.count}</Text>
        <Text color={stat.color} weight={700} size="sm" className={classes.statCount}>
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ))

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Pay Day</Title>
      </div>

      <Text color="dimmed" mt="md">
        Coming soon!
      </Text>
      <Divider mt="sm" />

      <Paper withBorder p="md" radius="md" mt="xl">
        <Group position="apart">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Next Pay Day
            </Text>
            <Text color="teal" className={classes.diff} size="sm" weight={700}>
              <span>{diff}%</span>
              <IconArrowUpRight size={16} style={{ marginBottom: 4 }} stroke={1.5} />
            </Text>
          </Group>
          <IconDeviceAnalytics size={20} className={classes.icon} stroke={1.5} />
        </Group>

        <Text color="dimmed" size="sm">
          IDK What to put for now
        </Text>

        <Progress
          sections={segments}
          size={34}
          classNames={{ label: classes.progressLabel }}
          mt={40}
        />
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="xl">
          {descriptions}
        </SimpleGrid>
      </Paper>
    </Container>
  )
}

// Export the `session` prop to use sessions with Server Side Rendering
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

  return {
    props: {},
  }
}
