import { analysis } from '../src/worker/analysis'
import { JsxToken } from '../src/worker/define'

const oneLine = '<div>123</div>'
const multiLine = `<div>
123

12345</div>
`
const breakLine = '<div>12{test}34</div>'

test('pure one line text', () => {
  const result = analysis('test.tsx', oneLine)

  const jsxText = result.find((item) => item.tokens[0] === JsxToken.text)

  expect(jsxText).not.toBeNull()
  expect([jsxText!.start.row, jsxText!.start.column]).toEqual([1, 6])
  expect([jsxText!.end.row, jsxText!.end.column]).toEqual([1, 8])
})

test('multi-line text', () => {
  const result = analysis('test.tsx', multiLine)

  const jsxText = result.find((item) => item.tokens[0] === JsxToken.text)

  expect(jsxText).not.toBeNull()
  expect([jsxText!.start.row, jsxText!.start.column]).toEqual([2, 1])
  expect([jsxText!.end.row, jsxText!.end.column]).toEqual([4, 5])
})

test('break line text', () => {
  const result = analysis('test.tsx', breakLine)

  const jsxText = result.find((item) => item.tokens[0] === JsxToken.text)

  expect(jsxText).not.toBeNull()
  expect([jsxText!.start.row, jsxText!.start.column]).toEqual([1, 6])
  expect([jsxText!.end.row, jsxText!.end.column]).toEqual([1, 7])
})
