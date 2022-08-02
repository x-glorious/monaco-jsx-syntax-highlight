import { Data } from './types'
import { calcPosition } from './tool'
import { JsxToken } from './define'

export const disposeJsxText = (data: Data) => {
  const { node, lines, classifications } = data
  const { positions } = calcPosition(node, lines)
  classifications.push({
    start: positions[0],
    end: positions[1],
    tokens: [JsxToken.text]
  })
}
