import { demo } from '../site.config';

export function indexOnce<T extends { id: string }>(data: T[]) {
  return data.reduce(
    (acc, item) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, T>
  );
}

export function indexOnceWithKey<T, K extends keyof T>(data: T[], key: K) {
  return data.reduce(
    (acc, item) => {
      acc[item[key] as string] = item;
      return acc;
    },
    {} as Record<string, T>
  );
}

export function isDemoUser(userId: string): boolean {
  return userId === demo.id;
}
