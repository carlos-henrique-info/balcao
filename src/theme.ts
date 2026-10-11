import { createTheme, type MantineColorsTuple } from '@mantine/core'

const cobalt: MantineColorsTuple = [
  '#eef2ff',
  '#dde4ff',
  '#b9c7ff',
  '#93a9ff',
  '#6d8aff',
  '#4f70f2',
  '#2a4bd7',
  '#2340bb',
  '#1c3499',
  '#162a7a',
]

export const theme = createTheme({
  primaryColor: 'cobalt',
  colors: { cobalt },
  fontFamily: '"Instrument Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"Bricolage Grotesque", "Instrument Sans", system-ui, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
})
