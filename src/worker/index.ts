import { analysis } from './analysis'

// Respond to message from parent thread
self.addEventListener('message', (event) => {
  const { code, filePath, version, config } = event.data
  try {
    const result = analysis(filePath, code, config)

    self.postMessage({ classifications: result, version, filePath })
  } catch (e) {
    // 根据配置打印错误
    if (config?.enableConsole) {
      console.error(e)
    }
  }
})
