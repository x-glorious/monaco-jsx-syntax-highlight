import { analysis } from '../src/worker/analysis'
import { JsxToken } from '../src/worker/define'

test('props', () => {
  const result = analysis('test.tsx', '<div className="test"/>')
  const attribute = result.find((item) => item.tokens.includes(JsxToken.attributeKey))

  expect(attribute).not.toBeNull()
  expect([
    [attribute!.start.row, attribute!.start.column],
    [attribute!.end.row, attribute!.end.column]
  ]).toEqual([
    [1, 6],
    [1, 14]
  ])
})

test('insert props', () => {
  const result = analysis('test.tsx', '<div render={<div props/>}/>')
  const attributes = result.filter((item) => item.tokens.includes(JsxToken.attributeKey))

  expect(attributes.length).toBe(2)
  expect([
    [attributes[0].start.row, attributes[0].start.column],
    [attributes[0].end.row, attributes[0].end.column]
  ]).toEqual([
    [1, 6],
    [1, 11]
  ])
  expect([
    [attributes[1].start.row, attributes[1].start.column],
    [attributes[1].end.row, attributes[1].end.column]
  ]).toEqual([
    [1, 19],
    [1, 23]
  ])
})
