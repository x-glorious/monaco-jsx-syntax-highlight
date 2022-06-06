interface WorkerContentInJson {
    worker: string;
}
export declare class MonacoJsxSyntaxHighlight {
    private worker;
    private monaco;
    constructor(worker: string | Worker | WorkerContentInJson, monaco: any);
    private createWorkerFromPureString;
    private generateCallbackKey;
    highlighterBuilder: (context: {
        editor: any;
        filePath?: string | undefined;
    }) => {
        highlighter: (code?: string | undefined) => void;
        dispose: () => void;
    };
}
export {};
