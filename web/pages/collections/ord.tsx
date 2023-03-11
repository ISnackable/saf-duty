import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import {
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
} from "@mantine/core";
import { IconCalendarStats, IconRun } from "@tabler/icons-react";
import dayjs from "dayjs";

import { authOptions } from "../api/auth/[...nextauth]";

const ICON_SIZE = 60;

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

  card: {
    position: "relative",
    overflow: "visible",
    padding: theme.spacing.xl,
    paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE / 3}px)`,
  },

  icon: {
    position: "absolute",
    top: -ICON_SIZE / 3,
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
  },
}));

ORDPage.title = "ORD Progress";

export default function ORDPage({ user }: { user: User }) {
  const { classes } = useStyles();
  const today = dayjs();
  const enlist = dayjs(`2022-06-05`);
  const ord = dayjs(`2024-06-05`);
  // Calculate number of days between dates
  const diff = ord.diff(today, "day");
  const total = ord.diff(enlist, "day");
  const current = today.diff(enlist, "day");

  const ordProgress = Math.round((current / total) * 100);

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconCalendarStats size={48} />
        <Title className={classes.title}>ORD</Title>
      </div>

      <Text color="dimmed" mt="md">
        ORD is the date when full-time national servicemen (Singaporean Males)
        complete their 2 years (previously 2.5 years) compulsory stint in the
        Singapore Army, Navy, Police or Civil Defence Force. Stop looking at
        this page as it is depressing.
      </Text>
      <Divider mt="sm" />

      <Paper radius="md" withBorder className={classes.card} mt={80}>
        <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
          <IconRun size={34} stroke={1.5} />
        </ThemeIcon>

        <Text align="center" weight={700} className={classes.title}>
          ORD
        </Text>

        <Blockquote cite={`– ${user?.name || "Some NSF"}`}>
          ORD loh!!
        </Blockquote>

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

  const { user } = session;

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}
