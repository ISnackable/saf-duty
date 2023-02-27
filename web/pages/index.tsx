import { useState } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { Container, createStyles, Divider, Text, Title } from "@mantine/core";
import { Calendar, isSameMonth } from "@mantine/dates";
import { getServerSession } from "next-auth/next";
import { IconCalendarEvent } from "@tabler/icons-react";

import { authOptions } from "./api/auth/[...nextauth]";

const useStyles = createStyles((theme) => ({
  outside: {
    opacity: 0,
  },

  weekend: {
    color: `${
      theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7]
    } !important`,
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
}));

export default function IndexPage({ user }: { user: User }) {
  const { classes, cx } = useStyles();

  const [month, onMonthChange] = useState(new Date());
  const value: Date[] = [];
  const setValue = () => null;

  console.log(user);

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconCalendarEvent size={48} />
        <Title className={classes.title}>Duty Roster</Title>
      </div>
      <Text color="dimmed" mt="md">
        View the duty roster
      </Text>
      <Divider mt="sm" />

      <Calendar
        mt="lg"
        multiple
        allowLevelChange={false}
        value={value}
        onChange={setValue}
        fullWidth
        hideOutsideDates
        size="xl"
        firstDayOfWeek="sunday"
        month={month}
        onMonthChange={onMonthChange}
        excludeDate={(date) => !isSameMonth(date, month)}
        dayClassName={(_date, modifiers) =>
          cx({
            [classes.outside]: modifiers.outside,
            [classes.weekend]: modifiers.weekend,
          })
        }
        styles={(theme) => ({
          cell: {
            border: `1px solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[2]
            }`,
          },
          day: {
            borderRadius: 0,
            height: 90,
            fontSize: theme.fontSizes.lg,
            "&[data-weekend]": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[2],
            },
          },
          weekday: { fontSize: theme.fontSizes.lg },
          weekdayCell: {
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
        renderDay={(date) => {
          const day = date.getDate();

          return (
            <>
              <div>{day}</div>
              <Text size="xs" ta="right" mr="sm">
                WX (JW)
              </Text>
            </>
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
