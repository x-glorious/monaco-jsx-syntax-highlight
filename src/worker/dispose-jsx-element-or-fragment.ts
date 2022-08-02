import { Data } from './types'

import { Typescript } from './typescript'

import { JsxToken } from './define'
import { calcPosition } from './tool'

/**
 * 处理 jsx element 或者 fragment
 * @param {*} data
 */
export const disposeJsxElementOrFragment = (data: Data) => {
  const { node, lines, classifications } = data
  const config = data.config
  const context = data.context
  const orderToken = `jsx-tag-order-${context.jsxTagOrder}`
  context.jsxTagOrder = context.jsxTagOrder + 1 > config.jsxTagCycle ? 1 : context.jsxTagOrder + 1

  // em <div />
  if (node.kind === Typescript.SyntaxKind.JsxSelfClosingElement) {
    const { positions } = calcPosition(node, lines)
    const { positions: tagNamePositions } = calcPosition((node as any).tagName, lines)
    // <div /> => "<"
    classifications.push({
      start: positions[0],
      end: positions[0],
      tokens: [JsxToken.angleBracket, orderToken]
    })
    // <div /> => "/>"
    classifications.push({
      start: { ...positions[1], column: positions[1].column - 1 },
      end: positions[1],
      tokens: [JsxToken.angleBracket, orderToken]
    })
    // <div /> => "div"
    classifications.push({
      start: tagNamePositions[0],
      end: tagNamePositions[1],
      tokens: [JsxToken.tagName, orderToken]
    })
  } else {
    const openingNode =
      node.kind === Typescript.SyntaxKind.JsxFragment
        ? (node as any).openingFragment
        : (node as any).openingElement
    const closingNode =
      node.kind === Typescript.SyntaxKind.JsxFragment
        ? (node as any).closingFragment
        : (node as any).closingElement
    const { positions: openingPositions } = calcPosition(openingNode, lines)
    const { positions: closingPositions } = calcPosition(closingNode, lines)
    // <div> => "<"
    classifications.push({
      start: openingPositions[0],
      end: openingPositions[0],
      tokens: [JsxToken.angleBracket, orderToken]
    })
    // <div> => ">"
    classifications.push({
      start: openingPositions[1],
      end: openingPositions[1],
      tokens: [JsxToken.angleBracket, orderToken]
    })
    // </div> => "</"
    classifications.push({
      start: closingPositions[0],
      end: { ...closingPositions[0], column: closingPositions[0].column + 1 },
      tokens: [JsxToken.angleBracket, orderToken]
    })
    // </div> => ">"
    classifications.push({
      start: closingPositions[1],
      end: closingPositions[1],
      tokens: [JsxToken.angleBracket, orderToken]
    })

    // <div> </div> => "div"
    if (node.kind === Typescript.SyntaxKind.JsxElement) {
      const { positions: openingTagNamePositions } = calcPosition(
        (openingNode as any).tagName,
        lines
      )
      const { positions: closingTagNamePositions } = calcPosition(
        (closingNode as any).tagName,
        lines
      )
      classifications.push({
        start: openingTagNamePositions[0],
        end: openingTagNamePositions[1],
        tokens: [JsxToken.tagName, orderToken]
      })
      classifications.push({
        start: closingTagNamePositions[0],
        end: closingTagNamePositions[1],
        tokens: [JsxToken.tagName, orderToken]
      })
    }
  }
}
