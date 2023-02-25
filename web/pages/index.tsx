import { useState } from "react";
import { createStyles } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  outside: {
    opacity: 0,
  },
}));

export default function Index() {
  const { classes, cx } = useStyles();
  const { data: session } = useSession();

  const [month, onMonthChange] = useState(new Date());
  const [value, setValue] = useState<Date[]>([]);

  function setTest() {
    return null;
  }

  console.log(session);

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
    />
  );
}
