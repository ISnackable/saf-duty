import { forwardRef, useEffect, useState } from "react";
import type { GetServerSidePropsContext } from "next";
import {
  Avatar,
  Container,
  createStyles,
  Group,
  Select,
  Text,
  Title,
  MultiSelect,
  NumberInput,
  rem,
  Button,
  Flex,
  Table,
} from "@mantine/core";
import {
  Calendar,
  MonthPickerInput,
  DatePickerInput,
  isSameMonth,
} from "@mantine/dates";
import { openConfirmModal } from "@mantine/modals";
import { IconChessKnight, IconDatabase } from "@tabler/icons-react";
import { getServerSession } from "next-auth/next";
import type { User } from "next-auth";

import * as demo from "@/lib/demo.data";
import { createDutyRoster, DutyDate } from "@/utils/dutyRoster";
import { authOptions } from "../api/auth/[...nextauth]";
// import { writeClient } from "@/lib/sanity.client";
// import { getAllUsersQuery } from "@/lib/sanity.queries";

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
GenerateDutyPage.title = "Generate Duty";

export default function GenerateDutyPage({ users }: { users: User[] }) {
  const [dutyRoster, setDutyRoster] = useState<false | DutyDate[]>();
  // if no data, use demo data
  const data = users.map((user) => ({
    label: user.name || "Default",
    value: user.name || "default",
  }));
  const { classes } = useStyles();

  const [value, setValue] = useState<string[]>([]);
  const [extraDate, setExtraDate] = useState<Date[]>([]);
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
  // const year = 2023;
  // const timeZone = "Asia/Singapore";

  // Make sure extraDates is changed whenever new month is selected
  useEffect(() => {
    if (month) {
      const newExtraDate = extraDate.map((date) => {
        date.setMonth(month?.getMonth());
        return date;
      });
      setExtraDate(newExtraDate);
    }
  }, [month]);

  const handleClick = () => {
    // @ts-expect-error //TODO: fix this type error
    setDutyRoster(createDutyRoster(users, month, extraDate));

    if (dutyRoster) {
      // console.log(dutyRoster);
      dutyRoster.forEach((duty) =>
        console.log(`${duty.personnel} (${duty.standby})`)
      );
    }
  };

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

      <Group grow>
        <MonthPickerInput
          mt="sm"
          label="Duty date"
          placeholder="Pick date"
          value={month}
          onChange={onMonthChange}
        />
        <DatePickerInput
          mt="sm"
          date={month || new Date()}
          value={extraDate}
          onChange={setExtraDate}
          clearable
          hideOutsideDates
          maxLevel="month"
          type="multiple"
          label="Extra date(s)"
          placeholder="Pick date"
          excludeDate={(date) => {
            if (month && !isSameMonth(date, month)) return true;
            else if (date.getDay() === 0 || date.getDay() === 6) return false;

            return true;
          }}
        />
      </Group>

      <MultiSelect
        mt="sm"
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

      {value.length > 0 && (
        <Table mt="xl" withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Personnel</th>
              <th>Weekday Points</th>
              <th>Weekend Points</th>
              <th>Extras</th>
            </tr>
          </thead>
          <tbody>
            {" "}
            {value.map((person) => {
              return (
                <tr key={person}>
                  <td>{person}</td>
                  <td>
                    {" "}
                    <NumberInput
                      styles={{
                        input: { width: rem(54), textAlign: "center" },
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    <NumberInput
                      styles={{
                        input: { width: rem(54), textAlign: "center" },
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    <NumberInput
                      styles={{
                        input: { width: rem(54), textAlign: "center" },
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

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
        renderDay={(date) => {
          const day = date.getDate();

          if (dutyRoster) {
            const personnelInitial = dutyRoster[day - 1]?.personnel
              ?.split(" ")
              .map((n) => n[0])
              .join("");
            const standbyInitial = dutyRoster[day - 1]?.standby
              ?.split(" ")
              .map((n) => n[0])
              .join("");

            return (
              <Flex mih={50} justify="center" align="center" direction="column">
                <div>{day}</div>
                <Text size="xs" align="center">
                  {personnelInitial} ({standbyInitial})
                </Text>
              </Flex>
            );
          }
        }}
      />

      <Group position="right">
        <Button
          mt="xl"
          onClick={handleClick}
          leftIcon={<IconDatabase size="1rem" />}
        >
          Generate
        </Button>
      </Group>
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

  const users = demo.users;
  // if (session?.user?.name !== "demo") {
  //   // We use `writeClient` here as the Users document is not publicly available. It requires authentication.
  //   users = await writeClient.fetch<User[]>(getAllUsersQuery);
  // }

  return {
    props: { users: JSON.parse(JSON.stringify(users)) },
  };
}
