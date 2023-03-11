import { useState } from "react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import {
  Container,
  createStyles,
  Divider,
  List,
  Text,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { getServerSession } from "next-auth/next";
import { IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";

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

const MAXIMUM_BLOCKOUTS = 8;

ManageBlockoutPage.title = "Manage Blockouts";

export default function ManageBlockoutPage({ user }: { user: User }) {
  const { classes } = useStyles();

  const [selected, setSelected] = useState<Date[]>([]);

  const handleSelect = (date: Date) => {
    const isSelected = selected.some((s) => dayjs(date).isSame(s, "date"));
    const currentMonthSelected = selected.filter((d) =>
      dayjs(d).isSame(date, "month")
    );

    if (isSelected) {
      setSelected((current) =>
        current.filter((d) => !dayjs(d).isSame(date, "date"))
      );
    } else if (
      currentMonthSelected.length !== MAXIMUM_BLOCKOUTS &&
      !currentMonthSelected.includes(date)
    ) {
      setSelected((current) =>
        current.includes(date)
          ? current.filter((d) => !dayjs(d).isSame(date, "date"))
          : [...current, date]
      );
    }
  };

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
      <List mt="lg">
        <List.Item>Unless you have a valid reason;</List.Item>
        <List.Item>
          Only a maximum of 8 blockouts date per month (subject to change)
        </List.Item>
        <List.Item>
          Inform the person-in-charge of the duty roster your reason
        </List.Item>
        <List.Item>
          You are not allowed to blockout every weekend of the month
        </List.Item>
      </List>
      <Divider mt="sm" />

      <Text>{user?.name}</Text>

      <DatePicker
        mt="lg"
        type="multiple"
        maxLevel="month"
        withCellSpacing={false}
        hideOutsideDates
        size="xl"
        minDate={dayjs(new Date()).startOf("month").toDate()}
        maxDate={dayjs(new Date()).endOf("month").add(1, "month").toDate()}
        getDayProps={(date) => {
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return {
            selected: selected.some((s) => dayjs(date).isSame(s, "date")),
            onClick: () => handleSelect(date),
            ...(isWeekend && {
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
            }),
          };
        }}
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
            "[data-selected]": {
              borderRadius: 0,
            },
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

  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
  };
}
