import { MonacoJsxSyntaxHighlight } from '../lib'
import Editor from '@monaco-editor/react'
import * as React from 'react'
import { useCallback } from 'react'
import ReactDOM from 'react-dom'
import WorkerJson from '../lib/worker/index.json'
import './index.scss'

function App() {
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true
    })

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(WorkerJson, monaco)

    // editor is the result of monaco.editor.create
    const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder({
      editor: editor
    })
    // init highlight
    highlighter()

    editor.onDidChangeModelContent(() => {
      // content change, highlight
      highlighter()
    })

    return dispose
  }, [])

  return (
    <Editor
      className={'editor'}
      height={'100vh'}
      onMount={handleEditorDidMount}
      theme={'vs-dark'}
      path={'file:///index.tsx'}
      defaultLanguage="typescript"
      options={{
        fontSize: 16,
        lineHeight: 28,
        automaticLayout: true
      }}
      defaultValue="export const test = () => <div />"
    />
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
