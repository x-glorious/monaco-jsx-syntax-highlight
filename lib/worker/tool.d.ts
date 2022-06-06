import { Typescript } from './typescript';
/**
 * 获取对应下标所处行列数据
 * @param {*} index 索引下标(以1开始)
 * @param {*} lines 每行长度数据
 * @returns
 */
export declare const getRowAndColumn: (index: number, lines: number[]) => {
    row: number;
    column: number;
};
/**
 * 获取节点位置
 * @param {} node 节点
 * @returns
 */
export declare const getNodeRange: (node: Typescript.Node) => number[];
export declare const calcPosition: (node: Typescript.Node, lines: number[]) => {
    indexes: number[];
    positions: {
        row: number;
        column: number;
    }[];
};
