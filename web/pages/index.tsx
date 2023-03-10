import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import {
  Container,
  createStyles,
  Divider,
  Text,
  Title,
  Flex,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { getServerSession } from "next-auth/next";
import { IconCalendarEvent } from "@tabler/icons-react";

import { authOptions } from "./api/auth/[...nextauth]";
import { writeClient } from "@/lib/sanity.client";
import { getAllUsersQuery } from "@/lib/sanity.queries";

export const DAY_SIZES = {
  xs: 34,
  sm: 38,
  md: 46,
  lg: 58,
  xl: 66,
};

const useStyles = createStyles((theme) => {
  return {
    calendarBase: {
      boxSizing: "border-box",
      display: "flex",
      gap: theme.spacing.md,
      maxWidth: "100%",
    },

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
  };
});

IndexPage.title = "Duty Roster";

export default function IndexPage({ users }: { users: User[] }) {
  const { classes } = useStyles();

  console.table(users);

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconCalendarEvent size={48} />
        <Title className={classes.title}>Duty Roster</Title>
      </div>
      <Text color="dimmed" mt="md">
        View the duty roster, below the date indicate the duty personnel while
        the circle bracket indicates the duty stand in personnel. The names are
        the initials of the personnel.
      </Text>
      <Divider mt="sm" />

      <Calendar
        static
        mt="lg"
        maxLevel="month"
        // fullWidth
        hideOutsideDates
        size="xl"
        styles={(theme) => ({
          calendar: {
            maxWidth: "100%",
          },
          calendarHeader: {
            maxWidth: "100%",
          },
          monthCell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          month: {
            width: "100%",
          },
          day: {
            borderRadius: 0,
            width: "100%",
            height: 90,
            fontSize: theme.fontSizes.lg,
          },
          weekday: {
            fontSize: theme.fontSizes.xl,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[0],
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
            height: 90,
          },
        })}
        getDayProps={(date) => {
          // Check if date isWeekend
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          if (isWeekend) {
            return {
              sx: (theme) => ({
                color: `${
                  theme.colorScheme === "dark"
                    ? theme.colors.pink[2]
                    : theme.colors.pink[4]
                } !important`,
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[2],
              }),
            };
          }
          return {};
        }}
        renderDay={(date) => {
          const day = date.getDate();

          return (
            <Flex mih={50} justify="center" align="center" direction="column">
              <div>{day}</div>
              <Text size="xs" align="center">
                WX (JW)
              </Text>
            </Flex>
          );
        }}
      />
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

  // We use `writeClient` here as the Users document is not publicly available. It requires authentication.
  const users = await writeClient.fetch<User[]>(getAllUsersQuery);

  return {
    props: { users },
  };
}
