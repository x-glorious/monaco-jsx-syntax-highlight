import { Data } from './types'
import { calcPosition } from './tool'
import { JsxToken } from './define'

export const disposeJsxExpression = (data: Data) => {
  const { node, lines, classifications } = data
  const { positions } = calcPosition(node, lines)

  // className={`666`} => "{"
  classifications.push({
    start: positions[0],
    end: positions[0],
    tokens: [JsxToken.expressionBraces]
  })
  // className={`666`} => "}"
  classifications.push({
    start: positions[1],
    end: positions[1],
    tokens: [JsxToken.expressionBraces]
  })
}
