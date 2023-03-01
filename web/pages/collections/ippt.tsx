import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { Container, createStyles, Divider, Text, Title } from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";

import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";

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

  link: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.blue[3]
        : theme.colors.blue[9],
  },
}));

export default function IpptPage({ user }: { user: User }) {
  const { classes } = useStyles();

  return (
    <>
      <Container my="lg">
        <div className={classes.titleWrapper}>
          <IconSparkles size={48} />
          <Title className={classes.title}>IPPT Calculator</Title>
        </div>

        <Text color="dimmed" mt="md">
          This is an embed of{" "}
          <Link
            href="https://ippt.yctay.com"
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            ippt.yctay.com
          </Link>
          . If you&apos;re exempted from any of the stations, check out the
          official{" "}
          <Link
            href="https://www.ns.sg/web/portal/nsmen/home/nstopics/ippt-nsfit/ippt/ippt-stations-and-scoring-system/scoring-calculation"
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            IPPT calculator on NS.SG
          </Link>
        </Text>
        <Divider mt="sm" />
      </Container>
      <iframe
        src="https://ippt.yctay.com/?age=20&situpReps=33&pushupReps=20&runMins=12&runSecs=30"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        sandbox="allow-scripts allow-same-origin"
      />
    </>
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

  if (user) {
    Object.keys(user).forEach(
      (key) =>
        user[key as keyof User] === undefined && delete user[key as keyof User]
    );
  }
  return {
    props: { user },
  };
}