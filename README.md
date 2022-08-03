# monaco-jsx-syntax-highlight

[![npm version](https://img.shields.io/npm/v/monaco-jsx-syntax-highlight.svg)](https://www.npmjs.com/package/monaco-jsx-highlighter)
[![npm downloads](https://img.shields.io/npm/dm/monaco-jsx-syntax-highlight.svg)](https://www.npmjs.com/package/monaco-jsx-highlighter)

Support monaco jsx syntax highlight

Monaco just support the jsx syntax checker

## Installing
```shell
$ npm install monaco-jsx-syntax-highlight
```

## Use

The main part of this package is a worker for **analysing jsx syntax**
So we have to way to init the **Controller class**

### Use blob create worker
```tsx
import { MonacoJsxSyntaxHighlight } from 'monaco-jsx-syntax-highlight'
import Worker from 'monaco-jsx-syntax-highlight/worker/index.json'

const controller = new MonacoJsxSyntaxHighlight(Worker, monaco)
```

### Use js worker file
If your browser do not support to use blob worker, you can download the [worker file](https://github.com/ordinaryP/monaco-jsx-syntax-highlight/blob/main/lib/worker/index.js) and save it

```tsx
import { MonacoJsxSyntaxHighlight } from 'monaco-jsx-syntax-highlight'
import Worker from 'monaco-jsx-syntax-highlight/worker/index.json'

const controller = new MonacoJsxSyntaxHighlight('https://xxxx', monaco)
```
---
### Controller

Remember, when this editor is disposed(`editor.dispose`), we should **invoke the `dispose`** function returned by the highlighterBuilder too

- `highlighter`: send latest content to worker for analysing
- `dispose`: remove event listener of the worker

```tsx
// editor is the result of monaco.editor.create
const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder({
    editor: editor,
})
// init hightlight
highlighter()

editor.onDidChangeModelContent(() => {
  // content change, highlight
  highlighter()
})
```

### Highlight

Use css class to highlight the jsx syntax

- `'jsx-tag-angle-bracket'`: `<`、`>`、`/>`
- `'jsx-tag-attribute-key'`: the attribute key
- `'jsx-expression-braces'`: the braces of attribute value
- `'jsx-text'`: the text in jsx tag content
- `'jsx-tag-name'`: the tag name of jsx tag


## FAQ

### monaco do not **check** the jsx syntax

You can try below config code

PS: the file name must end with `jsx` or `tsx`

```tsx
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    esModuleInterop: true
})

const model = monaco.editor.createModel(
  'const test: number = 666',
  'typescript',
  monaco.Uri.parse('index.tsx')
)

editor.current = monaco.editor.create(editorElement.current)
editor.current.setModel(model)
```
