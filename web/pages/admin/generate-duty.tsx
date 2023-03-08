import {
  Avatar,
  Checkbox,
  Container,
  createStyles,
  Flex,
  Group,
  Select,
  Text,
  Title,
  TransferList,
  TransferListData,
  TransferListItemComponent,
  TransferListItemComponentProps,
} from "@mantine/core";
import { Calendar, DatePicker, MonthPickerInput } from "@mantine/dates";
import { openConfirmModal } from "@mantine/modals";
import { IconChessKnight } from "@tabler/icons-react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { useState } from "react";

import { authOptions } from "../api/auth/[...nextauth]";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type MonthName = typeof MONTH_NAMES[number];

export function shuffleArray<T>(array: T[]): T[] {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
}

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

const initialValue: TransferListData = [
  [{ value: "JE", label: "Jin Er" }],
  [
    { value: "JX", label: "Jin Xiang" },
    { value: "JW", label: "Jin Wei" },
    { value: "JA", label: "Jin An" },
  ],
];

const ItemComponent: TransferListItemComponent = ({
  data,
  selected,
}: TransferListItemComponentProps) => (
  <Group noWrap>
    <Avatar src="" radius="xl" size="lg" />
    <div style={{ flex: 1 }}>
      <Text size="sm" weight={500}>
        {data.label}
      </Text>
      <Text size="xs" color="dimmed" weight={400}>
        {data.description}
      </Text>
    </div>
    <Checkbox
      checked={selected}
      onChange={() => {}}
      tabIndex={-1}
      sx={{ pointerEvents: "none" }}
    />
  </Group>
);

export default function GenerateDutyPage({ user }: { user: User }) {
  const { classes } = useStyles();

  const [data, setData] = useState<TransferListData>(initialValue);
  const [month, onMonthChange] = useState<Date | null>(new Date());

  const openModal = (date: Date) =>
    openConfirmModal({
      title: date.toLocaleString(),
      centered: true,
      children: (
        <>
          <Select
            label="Duty personnel"
            searchable
            data={initialValue[1].map((value) => value.label)}
          />
          <Select
            my="sm"
            label="Stand in"
            searchable
            data={initialValue[1].map((value) => value.label)}
          />
        </>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });

  // const month: MonthName = "March";
  const year: number = 2023;
  const timeZone = "Asia/Singapore";

  return (
    <Container>
      <div className={classes.titleWrapper}>
        <IconChessKnight size={48} />
        <Title className={classes.title}>Generate Duty</Title>
      </div>

      <Text color="dimmed" mt="md">
        Generate the duty roster for the selected month & year with the given
        personnels.
      </Text>

      <MonthPickerInput
        mt="sm"
        label="Duty date"
        placeholder="Pick date"
        value={month}
        onChange={onMonthChange}
      />

      <TransferList
        mt="xl"
        value={data}
        onChange={setData}
        searchPlaceholder="Search personnels..."
        nothingFound="No one here"
        titles={["Personnels not on duty", "Personnels on duty"]}
        listHeight={300}
        breakpoint="md"
        itemComponent={ItemComponent}
      />

      <Calendar
        mt="lg"
        maxLevel="month"
        date={month || new Date()}
        hideOutsideDates
        size="xl"
        getDayProps={(date) => ({
          onClick: () => openModal(date),
        })}
        styles={(theme) => ({
          calendar: {
            maxWidth: "100%",
          },
          calendarHeader: {
            maxWidth: "100%",
          },
          calendarHeaderControl: {
            display: "none",
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

  if (user?.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

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