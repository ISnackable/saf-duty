'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

import { Icons } from '@/components/icons';

export const ThemeSwitcher = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const isChecked = (value: string) => theme === value;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
  };

  React.useEffect(() => {
    if (resolvedTheme === 'dark') {
      document
        .querySelector('meta[name="theme-color"]')!
        .setAttribute('content', '#0a0a0a');
    } else {
      document
        .querySelector('meta[name="theme-color"]')!
        .setAttribute('content', '#ffffff');
    }
  }, [resolvedTheme]);

  return (
    <div className='flex h-9 w-fit rounded-full border-[1px] border-solid border-[#eaeaea] bg-[#fafafa] p-[3px] dark:border-[#333] dark:bg-[#111]'>
      <span style={{ height: '100%' }}>
        <input
          className='peer/system absolute m-0 appearance-none p-0 outline-none'
          type='radio'
          id='theme-switcher-system'
          value='system'
          onChange={handleChange}
          checked={isChecked('system')}
        />
        <label
          className={
            'relative m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-none transition-all duration-100 ease-in-out' +
            ' ' +
            'hover:bg-[#fafafa] dark:hover:bg-[#111]' +
            ' ' +
            'peer-checked/system:bg-[#fff] peer-checked/system:shadow-theme-switcher-label dark:peer-checked/system:bg-[#333]' +
            ' ' +
            '[&_svg]:relative [&_svg]:z-[1] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:!text-[#666666] [&_svg]:transition-colors [&_svg]:duration-100 [&_svg]:ease-in-out dark:[&_svg]:!text-[#888]' +
            ' ' +
            'hover:[&_svg]:!text-[#111111] peer-checked/system:[&_svg]:!text-[#111111] dark:hover:[&_svg]:!text-[#fafafa] dark:peer-checked/system:[&_svg]:!text-[#fafafa]'
          }
          htmlFor='theme-switcher-system'
          aria-label='Switch to system mode'
          title='Switch to system mode'
        >
          <Icons.monitor size={16} />
        </label>
      </span>
      <span style={{ height: '100%' }}>
        <input
          className='peer/dark absolute m-0 appearance-none p-0 outline-none'
          type='radio'
          id='theme-switcher-dark'
          value='dark'
          onChange={handleChange}
          checked={isChecked('dark')}
        />
        <label
          className={
            'relative m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-none transition-all duration-100 ease-in-out' +
            ' ' +
            'hover:bg-[#fafafa] dark:hover:bg-[#111]' +
            ' ' +
            'peer-checked/dark:bg-[#fff] peer-checked/dark:shadow-theme-switcher-label dark:peer-checked/dark:bg-[#333]' +
            ' ' +
            '[&_svg]:relative [&_svg]:z-[1] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:!text-[#666666] [&_svg]:transition-colors [&_svg]:duration-100 [&_svg]:ease-in-out dark:[&_svg]:!text-[#888]' +
            ' ' +
            'hover:[&_svg]:!text-[#111111] peer-checked/dark:[&_svg]:!text-[#111111] dark:hover:[&_svg]:!text-[#fafafa] dark:peer-checked/dark:[&_svg]:!text-[#fafafa]'
          }
          htmlFor='theme-switcher-dark'
          aria-label='Switch to dark mode'
          title='Switch to dark mode'
        >
          <Icons.moon size={16} />
        </label>
      </span>
      <span style={{ height: '100%' }}>
        <input
          className='peer/light absolute m-0 appearance-none p-0 outline-none'
          type='radio'
          id='theme-switcher-light'
          value='light'
          onChange={handleChange}
          checked={isChecked('light')}
        />
        <label
          className={
            'relative m-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-none transition-all duration-100 ease-in-out' +
            ' ' +
            'hover:bg-[#fafafa] dark:hover:bg-[#111]' +
            ' ' +
            'peer-checked/light:bg-[#fff] peer-checked/light:shadow-theme-switcher-label dark:peer-checked/light:bg-[#333]' +
            ' ' +
            '[&_svg]:relative [&_svg]:z-[1] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:!text-[#666666] [&_svg]:transition-colors [&_svg]:duration-100 [&_svg]:ease-in-out dark:[&_svg]:!text-[#888]' +
            ' ' +
            'hover:[&_svg]:!text-[#111111] peer-checked/light:[&_svg]:!text-[#111111] dark:hover:[&_svg]:!text-[#fafafa] dark:peer-checked/light:[&_svg]:!text-[#fafafa]'
          }
          htmlFor='theme-switcher-light'
          aria-label='Switch to light mode'
          title='Switch to light mode'
        >
          <Icons.sun size={16} />
        </label>
      </span>
    </div>
  );
};
