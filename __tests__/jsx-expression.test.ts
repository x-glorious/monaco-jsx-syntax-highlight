import { analysis } from '../src/worker/analysis'
import { JsxToken } from '../src/worker/define'
import { Classification } from '../src/worker/types'

const inChildren = '<div>{test}</div>'
const inAttribute = '<div props={1}/>'
const multiLine = `<div>
{{
 test: '666
}}</div>
`

test('in children', () => {
  const result = analysis('test.tsx', inChildren)
  const expressionBraces: Classification[] = []

  result.forEach((item) => {
    if (item.tokens.includes(JsxToken.expressionBraces)) {
      expressionBraces.push(item)
    }
  })
  expressionBraces.sort((a, b) => a.start.column - b.start.column)

  expect(expressionBraces.length).toBe(2)

  expect([expressionBraces[0].start.row, expressionBraces[0].start.column]).toEqual([1, 6])

  expect(expressionBraces[0].start).toEqual(expressionBraces[0].end)

  expect([expressionBraces[1].start.row, expressionBraces[1].start.column]).toEqual([1, 11])
})

test('in attribute', () => {
  const result = analysis('test.tsx', inAttribute)
  const expressionBraces: Classification[] = []

  result.forEach((item) => {
    if (item.tokens.includes(JsxToken.expressionBraces)) {
      expressionBraces.push(item)
    }
  })
  expressionBraces.sort((a, b) => a.start.column - b.start.column)

  expect(expressionBraces.length).toBe(2)

  expect([expressionBraces[0].start.row, expressionBraces[0].start.column]).toEqual([1, 12])

  expect([expressionBraces[1].start.row, expressionBraces[1].start.column]).toEqual([1, 14])
})

test('multi line', () => {
  const result = analysis('test.tsx', multiLine)
  const expressionBraces: Classification[] = []

  result.forEach((item) => {
    if (item.tokens.includes(JsxToken.expressionBraces)) {
      expressionBraces.push(item)
    }
  })
  expressionBraces.sort((a, b) => a.start.column - b.start.column)

  expect(expressionBraces.length).toBe(2)

  expect([expressionBraces[0].start.row, expressionBraces[0].start.column]).toEqual([2, 1])

  expect([expressionBraces[1].start.row, expressionBraces[1].start.column]).toEqual([4, 2])
})
