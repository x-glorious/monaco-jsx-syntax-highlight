import {Typescript} from './typescript'

import {disposeJsxElementOrFragment} from './dispose-jsx-element-or-fragment'
import {Classification, Config, Data} from "./types";
import {disposeJsxAttributeKey} from "./dispose-jsx-attribute-key";
import {disposeJsxExpression} from "./dispose-jsx-expression";
import {disposeJsxText} from "./dispose-jsx-text";

const disposeNode = (data: Data) => {
  const {node, index} = data
  // 寻找到 jsx element or fragment 节点
  if (
    [
      Typescript.SyntaxKind.JsxFragment,
      Typescript.SyntaxKind.JsxElement,
      Typescript.SyntaxKind.JsxSelfClosingElement
    ].includes(node.kind)
  ) {
    disposeJsxElementOrFragment(data)
  }

  const token = Typescript.SyntaxKind[node.kind]

  // jsx attribute key
  if (
    node.parent &&
    node.parent.kind === Typescript.SyntaxKind.JsxAttribute &&
    node.kind === Typescript.SyntaxKind.Identifier &&
    index === 0) {
    disposeJsxAttributeKey(data)
  }

  // jsx expression
  if(node.kind === Typescript.SyntaxKind.JsxExpression){
    disposeJsxExpression(data)
  }

  if(node.kind === Typescript.SyntaxKind.JsxText){
    disposeJsxText(data)
  }

}

const walkAST = (data: Data) => {
  disposeNode(data)

  let counter = 0
  Typescript.forEachChild(data.node, (child: Typescript.Node) =>
    walkAST({
      ...data,
      node: child,
      index: counter++
    })
  )
}

const withDefaultConfig = (config?: Config): Config => {
  const {jsxTagCycle = 3} = (config || {} as Config)
  return {
    jsxTagCycle
  }
}

const analysisTsx = (filePath: string, code: string, config?: Config) => {
  try {
    const classifications: Classification[] = []
    const sourceFile = Typescript.createSourceFile(
      filePath,
      code,
      Typescript.ScriptTarget.ES2020,
      true
    )
    // 切割分析每一行的长度
    const lines = code.split('\n').map((line) => line.length + 1)
    walkAST({
      node: sourceFile,
      lines,
      context: {jsxTagOrder: 1},
      classifications,
      config: withDefaultConfig(config),
      index: 0
    })
    return classifications
  } catch (e) {
    console.error(e)
    return undefined
  }
}

// Respond to message from parent thread
self.addEventListener('message', (event) => {
  const { code, filePath, version, config } = event.data
  try {
    const result = analysisTsx(filePath, code, config)

    self.postMessage({ classifications: result, version, filePath })
  } catch (e) {
    /* Ignore error */
  }
})
