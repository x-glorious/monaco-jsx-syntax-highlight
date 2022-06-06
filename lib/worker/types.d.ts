import { Typescript } from './typescript';
export interface Position {
    row: number;
    column: number;
}
export interface Classification {
    start: Position;
    end: Position;
    tokens: string[];
}
export interface Config {
    jsxTagCycle: number;
    enableConsole?: boolean;
}
export interface Context {
    jsxTagOrder: number;
}
export interface Data {
    node: Typescript.Node;
    lines: number[];
    context: Context;
    classifications: Classification[];
    config: Config;
    index: number;
}
