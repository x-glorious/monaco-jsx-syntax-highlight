import { Typescript } from './typescript'

export interface Position {
  row: number
  column: number
}

export interface Classification {
  start: Position
  end: Position
  tokens: string[]
}

export interface Config {
  /**
   * jsx tag 序号循环值
   * - 主要用作给相邻的tag渲染不同颜色作区分
   */
  jsxTagCycle: number
  /**
   * 是否开启console
   */
  enableConsole?: boolean
}

export interface Context {
  /**
   * 当前的jsx标签序号
   */
  jsxTagOrder: number
}

export interface Data {
  node: Typescript.Node
  lines: number[]
  context: Context
  classifications: Classification[]
  config: Config
  index: number
}
