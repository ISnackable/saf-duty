import { site } from '@repo/site-config';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Page from '../app/(auth)/login/page';

vi.mock('next/navigation', () => {
  const actual = vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
      get: vi.fn(),
    })),
    usePathname: vi.fn(),
  };
});

test('Sign In Page', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: `Welcome back to ${site.name}!`,
    })
  ).toBeDefined();
});
