import {Typescript} from './typescript'

/**
 * 获取对应下标所处行列数据
 * @param {*} index 索引下标(以1开始)
 * @param {*} lines 每行长度数据
 * @returns
 */
export const getRowAndColumn = (index: number, lines: number[]) => {
  let line = 0
  let offset = 0
  while (offset + lines[line] < index) {
    offset += lines[line]
    line += 1
  }

  return {row: line + 1, column: index - offset}
}

/**
 * 获取节点位置
 * @param {} node 节点
 * @returns
 */
export const getNodeRange = (node: Typescript.Node) => {
  if (typeof node.getStart === 'function' && typeof node.getEnd === 'function') {
    return [node.getStart(), node.getEnd()]
  } else if (typeof node.pos !== 'undefined' && typeof node.end !== 'undefined') {
    return [node.pos, node.end]
  }
  return [0, 0]
}

// 计算开始结束行列位置
export const calcPosition = (node: Typescript.Node, lines: number[]) => {
  const [start, end] = getNodeRange(node)

  return {
    indexes: [start, end],
    positions: [getRowAndColumn(start + 1, lines), getRowAndColumn(end, lines)]
  }
}