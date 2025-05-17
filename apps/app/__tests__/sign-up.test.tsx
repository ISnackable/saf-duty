import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import Page from '../app/(auth)/register/page';

global.ResizeObserver = class {
  // biome-ignore lint/suspicious/noEmptyBlockStatements: Hacky workaround for ResizeObserver
  observe() {}
  // biome-ignore lint/suspicious/noEmptyBlockStatements: Hacky workaround for ResizeObserver
  unobserve() {}
  // biome-ignore lint/suspicious/noEmptyBlockStatements: Hacky workaround for ResizeObserver
  disconnect() {}
};

test('Sign Up Page', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Create an account',
    })
  ).toBeDefined();
});
