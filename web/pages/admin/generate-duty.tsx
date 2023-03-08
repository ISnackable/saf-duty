import {
  Avatar,
  Container,
  createStyles,
  Flex,
  Group,
  Select,
  Text,
  Title,
  MultiSelect,
  NumberInput,
  ActionIcon,
  NumberInputHandlers,
  rem,
} from "@mantine/core";
import { Calendar, MonthPickerInput } from "@mantine/dates";
import { openConfirmModal } from "@mantine/modals";
import { IconChessKnight } from "@tabler/icons-react";
import type { GetServerSidePropsContext } from "next";
import type { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { forwardRef, useRef, useState } from "react";

import { personnels } from "@/lib/demo.data";
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

export type MonthName = (typeof MONTH_NAMES)[number];

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

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  label: string;
  avatar?: string;
  description?: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ avatar, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={avatar} />

        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

SelectItem.displayName = "SelectItem";

export default function GenerateDutyPage({ user }: { user: User }) {
  // if no data, use demo data
  const data = personnels.map((personnel) => ({
    label: personnel.name,
    value: personnel.name,
    ...personnel,
  }));
  const { classes } = useStyles();

  const [value, setValue] = useState<string[]>([]);
  const [number, setNumber] = useState<number | "">(0);
  const [month, onMonthChange] = useState<Date | null>(new Date());
  const handlers = useRef<NumberInputHandlers>();

  const openModal = (date: Date) =>
    openConfirmModal({
      title: date.toLocaleString(),
      centered: true,
      children: (
        <>
          <Select
            label="Duty personnel"
            searchable
            data={data.map((value) => value.label)}
          />
          <Select
            my="sm"
            label="Stand in"
            searchable
            data={data.map((value) => value.label)}
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

      <MultiSelect
        value={value}
        onChange={setValue}
        data={data}
        label="Choose personnel doing duties"
        placeholder="Pick all you like"
        itemComponent={SelectItem}
        searchable
        nothingFound="Nobody here"
        maxDropdownHeight={400}
        clearButtonProps={{ "aria-label": "Clear selection" }}
        clearable
        filter={(value, selected, item) =>
          !selected &&
          (item?.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
            item?.description
              ?.toLowerCase()
              .includes(value.toLowerCase().trim()))
        }
      />

      {value.map((person) => {
        return (
          <Group spacing={5} key={person}>
            <Text>{person}&apos;s Weekend Points</Text>
            <ActionIcon
              size={42}
              variant="default"
              onClick={() => handlers?.current?.decrement()}
            >
              –
            </ActionIcon>

            <NumberInput
              hideControls
              value={number}
              onChange={(val) => setNumber(val)}
              handlersRef={handlers}
              max={10}
              min={0}
              step={2}
              styles={{ input: { width: rem(54), textAlign: "center" } }}
            />

            <ActionIcon
              size={42}
              variant="default"
              onClick={() => handlers?.current?.decrement()}
            >
              +
            </ActionIcon>
          </Group>
        );
      })}

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
