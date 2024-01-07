import { demo } from '../site.config';

export function isDemoUser(userId: string): boolean {
  return userId === demo.id;
}
