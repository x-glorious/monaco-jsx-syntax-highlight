import { Node as NodeOriginal } from 'typescript'
// @ts-ignore
self.importScripts(['https://cdnjs.cloudflare.com/ajax/libs/typescript/4.6.4/typescript.min.js'])

export const Typescript = (self as any).ts

export declare namespace Typescript {
  type Node = NodeOriginal
}