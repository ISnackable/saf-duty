import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import {
  Container,
  createStyles,
  Divider,
  Text,
  Title,
  Timeline,
} from "@mantine/core";
import { getServerSession } from "next-auth/next";
import {
  IconEdit,
  IconGitBranch,
  IconGitPullRequest,
  IconGitCommit,
  IconMessageDots,
} from "@tabler/icons-react";

import { authOptions } from "./api/auth/[...nextauth]";

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
}));

UpcomingDutiesPage.title = "Upcoming Duties";

export default function UpcomingDutiesPage({ user }: { user: User }) {
  const { classes } = useStyles();

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Upcoming Duties</Title>
      </div>

      <Text color="dimmed" mt="md">
        View the list of upcoming duties you have been assigned to. You can
        filter the list by date range. You can also view the list of upcoming
        duties for a specific member.
      </Text>
      <Divider mt="sm" />

      <Timeline active={1} bulletSize={24} lineWidth={2} mt="xl">
        <Timeline.Item bullet={<IconGitBranch size={12} />} title="New branch">
          <Text color="dimmed" size="sm">
            You&apos;ve created new branch{" "}
            <Text variant="link" component="span" inherit>
              fix-notifications
            </Text>{" "}
            {user?.name}
          </Text>
          <Text size="xs" mt={4}>
            2 hours ago
          </Text>
        </Timeline.Item>

        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Commits">
          <Text color="dimmed" size="sm">
            You&apos;ve pushed 23 commits to
            <Text variant="link" component="span" inherit>
              fix-notifications branch
            </Text>
          </Text>
          <Text size="xs" mt={4}>
            52 minutes ago
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Pull request"
          bullet={<IconGitPullRequest size={12} />}
          lineVariant="dashed"
        >
          <Text color="dimmed" size="sm">
            You&apos;ve submitted a pull request
            <Text variant="link" component="span" inherit>
              Fix incorrect notification message (#187)
            </Text>
          </Text>
          <Text size="xs" mt={4}>
            34 minutes ago
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Code review"
          bullet={<IconMessageDots size={12} />}
        >
          <Text color="dimmed" size="sm">
            <Text variant="link" component="span" inherit>
              Robert Gluesticker
            </Text>{" "}
            left a code review on your pull request
          </Text>
          <Text size="xs" mt={4}>
            12 minutes ago
          </Text>
        </Timeline.Item>
      </Timeline>
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
