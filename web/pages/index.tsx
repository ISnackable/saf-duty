import { useState } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { createStyles, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { getServerSession } from "next-auth/next";

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
}));

const names = ["JW", "WX", "JO", "JK", "LU", "JS", "JE"];

export default function Index({ user }: { user: User }) {
  const { classes, cx } = useStyles();

  const [month, onMonthChange] = useState(new Date());
  const [value, setValue] = useState<Date[]>([]);

  function setTest() {
    return null;
  }

  console.log(user);

  return (
    <Calendar
      multiple
      allowLevelChange={false}
      value={value}
      onChange={setTest}
      fullWidth
      size="xl"
      firstDayOfWeek="sunday"
      month={month}
      onMonthChange={onMonthChange}
      excludeDate={(date) => date.getMonth() !== month.getMonth()}
      dayClassName={(_date, modifiers) =>
        cx({
          [classes.outside]: modifiers.outside,
          [classes.weekend]: modifiers.weekend,
        })
      }
      styles={(theme) => ({
        cell: {
          // backgroundColor:
          //   theme.colorScheme === "dark"
          //     ? theme.colors.dark[5]
          //     : theme.colors.gray[0],
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        },
        day: { borderRadius: 0, height: 90, fontSize: theme.fontSizes.lg },
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

        const randomName = names[Math.floor(Math.random() * names.length)];

        return (
          <>
            <div>{day}</div>
            <Text size="xs" ta="right" mr="sm">
              {/* {randomName} ({randomName}) */}
            </Text>
          </>
        );
      }}
    />
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
