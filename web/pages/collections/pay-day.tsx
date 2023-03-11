import type { GetServerSidePropsContext } from "next";
import dayjs, { Dayjs } from 'dayjs';
import type { User } from "next-auth";
import {
  createStyles,
  Progress,
  Box,
  Text,
  Group,
  Paper,
  Badge,
  Divider,
  Title,
  Container,
} from "@mantine/core";
import { getServerSession } from "next-auth/next";
import {
  IconDeviceAnalytics,
  IconEdit,
} from "@tabler/icons-react";

import { authOptions } from "../api/auth/[...nextauth]";


const useStyles = createStyles((theme) => ({
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    lineHeight: 1,
    textTransform: "uppercase",
  },

  titleWrapper: {
    display: "flex",
    alignItems: "center",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing.sm,
    },
  },

  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: "3px solid",
    paddingBottom: 5,
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));



// Set the payday date to the 10th of every month
const paydayDay = 10;

// Get the current date
const today: Dayjs = dayjs();

// Calculate the next payday date
let nextPayday: Dayjs;
if (today.date() < paydayDay) {
  nextPayday = today.date(paydayDay);
} else {
  if (today.month() === 11) {
    nextPayday = today.add(1, 'year').startOf('year').date(paydayDay);
  } else {
    nextPayday = today.add(1, 'month').startOf('month').date(paydayDay);
  }
}

// Calculate the progress towards the next payday as a percentage
const progress: number = Math.floor((today.valueOf() - today.startOf('month').date(paydayDay).valueOf()) / (nextPayday.valueOf() - today.startOf('month').date(paydayDay).valueOf()) * 100);
// Calculate the number of days left until the next payday
const daysLeft: number = nextPayday.diff(today, 'day');
// Calculate the total number of days until the next payday
const daysTotal: number = nextPayday.diff(today.startOf('month').date(paydayDay), 'day');

const currentdate = daysTotal- daysLeft

const data = [
  {
    label: "Total earned",
    count: "204,001",
    part: progress,
    color: "#47d6ab",
  },
];

PayDayPage.title = "Pay Day";

export default function PayDayPage() {
  const { classes } = useStyles();

  const segments = data.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part}%` : undefined,
  }));

  const descriptions = data.map((stat) => (
    <Box
      key={stat.label}
      sx={{ borderBottomColor: stat.color }}
      className={classes.stat}
    >
      <Text transform="uppercase" size="xs" color="dimmed" weight={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text weight={700}>{stat.count}</Text>
        <Text
          color={stat.color}
          weight={700}
          size="sm"
          className={classes.statCount}
        >
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ));

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Pay Day</Title>
      </div>

      <Divider mt="sm" />
      <Paper withBorder p="md" radius="md" mt="xl">
        <Group position="apart">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Next Pay Day
            </Text>
          </Group>
          <IconDeviceAnalytics
            size={20}
            className={classes.icon}
            stroke={1.5}
          />
        </Group>

        <Progress
          sections={segments}
          size={34}
          classNames={{ label: classes.progressLabel }}
          mt={40}
        />
       <Group position="apart" mt="md">
          <Text size="sm">
            {currentdate} / {daysTotal}
          </Text>
            <Badge size="sm">{daysLeft} days left</Badge>
        </Group>
      </Paper>
    </Container>
  );
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
