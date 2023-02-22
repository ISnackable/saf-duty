import { useState } from "react";
import { Calendar } from "@mantine/dates";

export default function Index() {
  const [month, onMonthChange] = useState(new Date());
  const [value, setValue] = useState<Date[]>([]);

  return (
    <Calendar
      multiple
      allowLevelChange={false}
      value={value}
      onChange={setValue}
      fullWidth
      size="xl"
      firstDayOfWeek="sunday"
      month={month}
      onMonthChange={onMonthChange}
      excludeDate={(date) => date.getMonth() !== month.getMonth()}
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
          height: 70,
        },
      })}
    />
  );
}
