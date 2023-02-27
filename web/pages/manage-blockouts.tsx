import { useState } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { Container, createStyles, Divider, Text, Title } from "@mantine/core";
import { Calendar, isSameMonth } from "@mantine/dates";
import { getServerSession } from "next-auth/next";
import { IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";

import { authOptions } from "./api/auth/[...nextauth]";

const useStyles = createStyles((theme) => ({
  outside: {
    opacity: 0,
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

export default function ManageBlockoutPage({ user }: { user: User }) {
  const { classes, cx } = useStyles();

  const [value, setValue] = useState<Date[]>([]);

  console.log(value);

  return (
    <Container mt="lg">
      <div className={classes.titleWrapper}>
        <IconEdit size={48} />
        <Title className={classes.title}>Manage Blockouts</Title>
      </div>

      <Text color="dimmed" mt="md">
        View and manage your blockouts. To add a blockout, click on the date you
        want to block out. To remove a blockout, click on the date again. The
        day you selected will be highlighted. You are only able to block out
        dates within the current month and next month.
      </Text>
      <Divider mt="sm" />

      <Calendar
        mt="lg"
        multiple
        disableOutsideEvents
        allowLevelChange={false}
        value={value}
        onChange={setValue}
        fullWidth
        size="xl"
        firstDayOfWeek="sunday"
        minDate={dayjs(new Date()).startOf("month").toDate()}
        maxDate={dayjs(new Date()).endOf("month").add(1, "month").toDate()}
        dayClassName={(_date, modifiers) =>
          cx({
            [classes.outside]: modifiers.outside,
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

          // const randomName = names[Math.floor(Math.random() * names.length)];

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
