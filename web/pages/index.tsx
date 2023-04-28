import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Container,
  createStyles,
  Divider,
  Text,
  Title,
  useMantineTheme,
  Box,
  Group,
  Flex,
  Paper,
  rem,
  Progress,
  Avatar,
  Skeleton,
  Badge,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import dayjs from 'dayjs'

import useUpcomingDuties from '@/hooks/useUpcomingDuties'
import { useSession } from 'next-auth/react'
import useUsers from '@/hooks/useUsers'
import Link from 'next/link'
import { IconClock } from '@tabler/icons-react'

function ordinal_suffix_of(i: number) {
  const j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) {
    return i + 'st'
  }
  if (j == 2 && k != 12) {
    return i + 'nd'
  }
  if (j == 3 && k != 13) {
    return i + 'rd'
  }
  return i + 'th'
}

const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    lineHeight: 1,
    // [theme.fn.smallerThan('sm')]: {
    //   fontSize: rem(35),
    // },
  },

  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing.sm,
    },
  },

  card: {
    height: rem(280),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },

  cardTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    lineHeight: 1.2,
    fontSize: rem(32),
  },

  cardTime: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    opacity: 0.7,
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  statsTitle: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  statsValue: {
    fontSize: rem(15),
    fontWeight: 700,
    lineHeight: 1,
  },
}))

const AddToCalendarButton = dynamic(
  () => import('add-to-calendar-button-react').then((mod) => mod.AddToCalendarButton),
  {
    ssr: false,
  }
)

interface CardProps {
  index: number
  title: string
  time: string
}

function Card({ index, title, time }: CardProps) {
  const { classes } = useStyles()

  return (
    <Paper shadow="md" p="xl" radius="md" className={classes.card}>
      <div>
        <Title order={3} className={classes.cardTitle}>
          {title}
        </Title>
        <Flex mt="xs" align="center">
          <IconClock size={15} stroke={1.5} />
          <Text className={classes.cardTime} size="xs" ml={5}>
            {time}
          </Text>
        </Flex>
      </div>

      <Badge size="sm">Your {ordinal_suffix_of(index + 1)} duty</Badge>
    </Paper>
  )
}

UpcomingDutiesPage.title = 'Home'

export default function UpcomingDutiesPage() {
  const { data: session } = useSession()
  const { data: upcomingDuties } = useUpcomingDuties()
  const { data: users, isLoading: userLoading } = useUsers()

  const [indexOfUpcomingDate, setIndexOfUpcomingDate] = useState(0)

  const { classes } = useStyles()
  const { colorScheme } = useMantineTheme()

  const calendarDates = upcomingDuties?.map((date) => ({
    name: 'SAF Duty',
    description: `You have a duty on ${date} at 8am, please be on time! This was automatically generated by the SAF Duty Roster.`,
    startDate: date,
  }))

  const data =
    upcomingDuties?.map((date) => ({
      title: dayjs(date).format('D MMM'),
      time: `${dayjs(date).format('ddd')} 8:00 AM`,
    })) || []

  const slides = data.map((item, i) => (
    <Carousel.Slide key={item.title}>
      <Card index={i} {...item} />
    </Carousel.Slide>
  ))

  useEffect(() => {
    setIndexOfUpcomingDate(
      upcomingDuties?.findIndex((date) => {
        const dutyDate = new Date(date)
        const today = new Date()

        return dutyDate.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0)
      }) || 0
    )
  }, [upcomingDuties])

  return (
    <Container my="xl" size="xl">
      <div className={classes.titleWrapper}>
        <Avatar src={session?.user?.image} radius="xl" />
        <Title className={classes.title}>Howdy, {session?.user?.name}</Title>
      </div>
      <Text color="dimmed" mt="md">
        Review your upcoming duties and add them to your calendar.
      </Text>
      <Divider my="sm" />
      <Group position="apart" mb="sm">
        <Title order={4}>Upcoming Duties</Title>
        <Text color="dimmed" component={Link} href="/duty-roster" prefetch={false}>
          View all ➤
        </Text>
      </Group>
      {upcomingDuties && upcomingDuties?.length > 0 ? (
        <>
          <Carousel
            loop
            withControls={false}
            initialSlide={indexOfUpcomingDate}
            withIndicators
            slideSize="50%"
            breakpoints={[{ maxWidth: 'sm', slideSize: '80%', slideGap: 'sm' }]}
            slideGap="xl"
            align="start"
            styles={{
              indicator: {
                width: rem(12),
                height: rem(4),
                transition: 'width 250ms ease',

                '&[data-active]': {
                  width: rem(40),
                },
              },
            }}
            slidesToScroll="auto"
          >
            {slides}
          </Carousel>

          <Group mt="md" position="center">
            <AddToCalendarButton
              name="Duty Roster"
              dates={calendarDates}
              hideCheckmark
              hideBackground
              buttonStyle="round"
              trigger="click"
              options={['Apple', 'Google']}
              lightMode={colorScheme}
              atcb-button-id="atcb-btn-1"
              atcb-last-event="initialization:atcb-btn-1"
              // @ts-expect-error Warning: Extra attributes from the server: class
              class={`atcb atcb-${colorScheme}`}
            />
          </Group>
        </>
      ) : (
        <Box my="xl">
          <Flex align="center" justify="center">
            <Text size="xl" color="dimmed">
              No upcoming duties
            </Text>
          </Flex>
        </Box>
      )}
      <Divider my="xl" />
      <Group position="apart" mb="sm">
        <Title order={4}>Duties Completed</Title>
        <Text color="dimmed" component="span">
          {indexOfUpcomingDate === -1 ? upcomingDuties?.length : indexOfUpcomingDate} of{' '}
          {upcomingDuties?.length}
        </Text>
      </Group>
      <Progress
        mb="xl"
        value={
          upcomingDuties && upcomingDuties?.length > 0
            ? ((indexOfUpcomingDate === -1 ? upcomingDuties?.length : indexOfUpcomingDate) /
                upcomingDuties?.length) *
              100
            : 0
        }
        size="lg"
      />
      <Divider my="xl" />

      <Title order={4} mb="sm">
        Also on duty
      </Title>
      <Carousel slideSize="10%" slideGap="sm" align="start" withControls={false} dragFree>
        {userLoading ? (
          <>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
            <Carousel.Slide>
              <Skeleton height={60} circle />
            </Carousel.Slide>
          </>
        ) : users && users.length > 0 ? (
          users?.map((user) => (
            <Carousel.Slide key={user.id}>
              <Avatar src={user.image} radius="xl" size="lg" />
              {user.name}
            </Carousel.Slide>
          ))
        ) : (
          <>
            <Text>No one else is on duty</Text>
          </>
        )}
      </Carousel>
    </Container>
  )
}
