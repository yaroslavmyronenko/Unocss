import { createGenerator, mergeDeep } from '@unocss/core'
import { presetMini } from 'unocss';
import { expect, test } from 'vitest'

const mergeTheme = (key: string, toMerge: any) => {
  const theme = createGenerator({
    presets: [presetMini()],
    theme: toMerge,
  }).config.theme

  return Object.entries(key.split('.').reduce((o: any, x) => o[x], theme) ?? {})
}

test('utils object mergeDeep', () => {
  expect(mergeDeep({}, {})).eql({})
  expect(mergeDeep({ a: 1 }, { a: 2 })).eql({ a: 2 })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: { b: 3 } })).eql({ a: { b: 3, c: 2 } })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: () => ({ c: 3 }) })).eql({ a: { c: 3 } })
  expect(mergeDeep({ a: { b: 1, c: 2 } }, { a: bc => ({ a: 0, ...bc, c: 3 }) })).eql({ a: { a: 0, b: 1, c: 3 } })

  expect(mergeTheme('breakpoints', {})).eql([
    ['sm', '640px'],
    ['md', '768px'],
    ['lg', '1024px'],
    ['xl', '1280px'],
    ['2xl', '1536px'],
  ])

  expect(mergeTheme('breakpoints', {
    breakpoints: {
      'large': '1000px',
    },
  })).eql([
    ['sm', '640px'],
    ['md', '768px'],
    ['lg', '1024px'],
    ['xl', '1280px'],
    ['2xl', '1536px'],
    ['large', '1000px'],
  ])

  expect(mergeTheme('breakpoints', {
    breakpoints: () => ({
      'large': '1000px',
    }),
  })).eql([
    ['large', '1000px'],
  ])

  expect(mergeTheme('breakpoints', {
    breakpoints: (prev: any) => ({
      'large': '1000px',
      'xl': prev.xl,
      'larger': '2000px',
    }),
  })).eql([
    ['large', '1000px'],
    ['xl', '1280px'],
    ['larger', '2000px'],
  ])

  expect(mergeTheme('colors.gray', {
    colors: {
      gray: {
        'black': '#000',
      },
    },
  })).eql([
    ['1', '#f3f4f6'],
    ['2', '#e5e7eb'],
    ['3', '#d1d5db'],
    ['4', '#9ca3af'],
    ['5', '#6b7280'],
    ['6', '#4b5563'],
    ['7', '#374151'],
    ['8', '#1f2937'],
    ['9', '#111827'],
    ['50', '#f9fafb'],
    ['100', '#f3f4f6'],
    ['200', '#e5e7eb'],
    ['300', '#d1d5db'],
    ['400', '#9ca3af'],
    ['500', '#6b7280'],
    ['600', '#4b5563'],
    ['700', '#374151'],
    ['800', '#1f2937'],
    ['900', '#111827'],
    ['DEFAULT', '#9ca3af'],
    ['black', '#000'],
  ])

  expect(mergeTheme('colors.gray', {
    colors: {
      gray: (colors: any) => ({
        '100': colors['1'],
        'black': '#000',
        'DEFAULT': colors.DEFAULT,
      }),
    },
  })).eql([
    ['100', '#f3f4f6'],
    ['black', '#000'],
    ['DEFAULT', '#9ca3af'],
  ])
})
