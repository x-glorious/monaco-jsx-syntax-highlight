var MonacoJsxSyntaxHighlight = /** @class */ (function () {
    function MonacoJsxSyntaxHighlight(worker, monaco) {
        var _this = this;
        this.createWorkerFromPureString = function (content) {
            // URL.createObjectURL
            window.URL = window.URL || window.webkitURL;
            var blob;
            try {
                blob = new Blob([content], { type: 'application/javascript' });
            }
            catch (e) {
                // Backwards-compatibility
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                blob = new window.BlobBuilder();
                blob.append(content);
                blob = blob.getBlob();
            }
            return new Worker(URL.createObjectURL(blob));
        };
        this.generateCallbackKey = function (filePath, version) { return "<".concat(filePath, "><").concat(version, ">"); };
        this.highlighterBuilder = function (context) {
            var editor = context.editor, _a = context.filePath, filePath = _a === void 0 ? editor.getModel().uri.toString() : _a;
            var decorationsRef = { current: [] };
            var disposeMessage = function (event) {
                var _a = event.data, classifications = _a.classifications, version = _a.version, disposeFilePath = _a.filePath;
                requestAnimationFrame(function () {
                    // 确认为本文件，并且为最新版本
                    if (disposeFilePath === filePath &&
                        version === editor.getModel().getVersionId()) {
                        var preDecoration = decorationsRef.current;
                        decorationsRef.current = editor.deltaDecorations(preDecoration, classifications.map(function (classification) { return ({
                            range: new _this.monaco.Range(classification.start.row, classification.start.column, classification.end.row, classification.end.column + 1),
                            options: {
                                inlineClassName: classification.tokens.join(' ')
                            }
                        }); }));
                    }
                });
            };
            // 注册监听事件
            _this.worker.addEventListener('message', disposeMessage);
            return {
                highlighter: function (code) {
                    requestAnimationFrame(function () {
                        var disposeCode = code || editor.getModel().getValue();
                        // send message to worker
                        _this.worker.postMessage({
                            code: disposeCode,
                            filePath: filePath,
                            version: editor.getModel().getVersionId()
                        });
                    });
                },
                dispose: function () {
                    _this.worker.removeEventListener('message', disposeMessage);
                }
            };
        };
        this.monaco = monaco;
        if (typeof worker === 'string') {
            this.worker = new Worker(worker);
        }
        else if (worker.worker && typeof worker.worker === 'string') {
            this.worker = this.createWorkerFromPureString(worker.worker);
        }
        else {
            this.worker = worker;
        }
    }
    return MonacoJsxSyntaxHighlight;
}());

export { MonacoJsxSyntaxHighlight };
