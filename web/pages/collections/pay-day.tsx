import type { GetServerSidePropsContext } from "next";
import dayjs from "dayjs";
import { Table } from "@mantine/core";

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
} from "@mantine/core";
import { getServerSession } from "next-auth/next";
import { IconDeviceAnalytics, IconEdit } from "@tabler/icons-react";

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
const today = dayjs();

// Calculate the next payday date
let nextPayday;
if (today.date() < paydayDay) {
  nextPayday = today.date(paydayDay);
} else {
  if (today.month() === 11) {
    nextPayday = today.add(1, "year").startOf("year").date(paydayDay);
  } else {
    nextPayday = today.add(1, "month").startOf("month").date(paydayDay);
  }
}

// Calculate the progress towards the next payday as a percentage
const progress: number = Math.floor(
  ((today.valueOf() - today.startOf("month").date(paydayDay).valueOf()) /
    (nextPayday.valueOf() - today.startOf("month").date(paydayDay).valueOf())) *
    100
);
// Calculate the number of days left until the next payday
const daysLeft: number = nextPayday.diff(today, "day");
// Calculate the total number of days until the next payday
const daysTotal: number = nextPayday.diff(
  today.startOf("month").date(paydayDay),
  "day"
);

const currentdate = daysTotal - daysLeft;

const data = [
  {
    label: "Total earned",
    count: "204,001",
    part: progress,
    color: "#47d6ab",
  },
];

const elements = [
  { rankStarting: "Recruit or Private", rankaAllowance: "$580" },
  { rankStarting: "Lance Corporal", rankaAllowance: "$600" },
  { rankStarting: "Corporal", rankaAllowance: "$650" },
  { rankStarting: "Corporal First Class", rankaAllowance: "$690" },
];
const vocation = [
  {
    sn: 1,
    vocation: "Service and Technical vocations",
    vocationAllowance: "$50",
  },
  {
    sn: 2,
    vocation: "All combatants",
    vocationAllowance: "$175",
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

  const rows = elements.map((element) => (
    <tr key={element.rankStarting}>
      <td>{element.rankStarting}</td>
      <td>{element.rankaAllowance}</td>
    </tr>
  ));
  const vocations = vocation.map((vocation) => (
    <tr key={vocation.sn}>
      <td>{vocation.sn}</td>
      <td>{vocation.vocation}</td>
      <td>{vocation.vocationAllowance}</td>
    </tr>
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

      <Paper withBorder p="md" radius="md" mt="xl">
        <Group position="apart">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Monthly rank allowance
            </Text>
          </Group>
          <IconDeviceAnalytics
            size={20}
            className={classes.icon}
            stroke={1.5}
          />
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
        <Group position="apart">
          <Group align="flex-end" spacing="xs">
            <Text size="xl" weight={700}>
              Monthly vocation allowance
            </Text>
          </Group>
          <IconDeviceAnalytics
            size={20}
            className={classes.icon}
            stroke={1.5}
          />
        </Group>

        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Vocations</th>
              <th>Monthly vocation allowance</th>
            </tr>
          </thead>
          <tbody>{vocations}</tbody>
        </Table>
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
