/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

// @ts-ignore
self.importScripts(['https://cdnjs.cloudflare.com/ajax/libs/typescript/4.6.4/typescript.min.js']);
var Typescript = self.ts;

var JsxToken = {
    angleBracket: 'jsx-tag-angle-bracket',
    attributeKey: 'jsx-tag-attribute-key',
    tagName: 'jsx-tag-name',
    expressionBraces: 'jsx-expression-braces',
    text: 'jsx-text'
};

/**
 * 获取对应下标所处行列数据
 * @param {*} index 索引下标(以1开始)
 * @param {*} lines 每行长度数据
 * @returns
 */
var getRowAndColumn = function (index, lines) {
    var line = 0;
    var offset = 0;
    while (offset + lines[line] < index) {
        offset += lines[line];
        line += 1;
    }
    return { row: line + 1, column: index - offset };
};
/**
 * 获取节点位置
 * @param {} node 节点
 * @returns
 */
var getNodeRange = function (node) {
    if (typeof node.getStart === 'function' && typeof node.getEnd === 'function') {
        return [node.getStart(), node.getEnd()];
    }
    else if (typeof node.pos !== 'undefined' && typeof node.end !== 'undefined') {
        return [node.pos, node.end];
    }
    return [0, 0];
};
// 计算开始结束行列位置
var calcPosition = function (node, lines) {
    var _a = getNodeRange(node), start = _a[0], end = _a[1];
    return {
        indexes: [start, end],
        positions: [getRowAndColumn(start + 1, lines), getRowAndColumn(end, lines)]
    };
};

/**
 * 处理 jsx element 或者 fragment
 * @param {*} data
 */
var disposeJsxElementOrFragment = function (data) {
    var node = data.node, lines = data.lines, classifications = data.classifications;
    var config = data.config;
    var context = data.context;
    var orderToken = "jsx-tag-order-".concat(context.jsxTagOrder);
    context.jsxTagOrder = (context.jsxTagOrder + 1) > config.jsxTagCycle ? 1 : (context.jsxTagOrder + 1);
    // em <div />
    if (node.kind === Typescript.SyntaxKind.JsxSelfClosingElement) {
        var positions = calcPosition(node, lines).positions;
        var tagNamePositions = calcPosition(node.tagName, lines).positions;
        // <div /> => "<"
        classifications.push({
            start: positions[0],
            end: positions[0],
            tokens: [JsxToken.angleBracket, orderToken]
        });
        // <div /> => "/>"
        classifications.push({
            start: __assign(__assign({}, positions[1]), { column: positions[1].column - 1 }),
            end: positions[1],
            tokens: [JsxToken.angleBracket, orderToken]
        });
        // <div /> => "div"
        classifications.push({
            start: tagNamePositions[0],
            end: tagNamePositions[1],
            tokens: [JsxToken.tagName, orderToken]
        });
    }
    else {
        var openingNode = node.kind === Typescript.SyntaxKind.JsxFragment ? node.openingFragment : node.openingElement;
        var closingNode = node.kind === Typescript.SyntaxKind.JsxFragment ? node.closingFragment : node.closingElement;
        var openingPositions = calcPosition(openingNode, lines).positions;
        var closingPositions = calcPosition(closingNode, lines).positions;
        // <div> => "<"
        classifications.push({
            start: openingPositions[0],
            end: openingPositions[0],
            tokens: [JsxToken.angleBracket, orderToken]
        });
        // <div> => ">"
        classifications.push({
            start: openingPositions[1],
            end: openingPositions[1],
            tokens: [JsxToken.angleBracket, orderToken]
        });
        // </div> => "</"
        classifications.push({
            start: closingPositions[0],
            end: __assign(__assign({}, closingPositions[0]), { column: closingPositions[0].column + 1 }),
            tokens: [JsxToken.angleBracket, orderToken]
        });
        // </div> => ">"
        classifications.push({
            start: closingPositions[1],
            end: closingPositions[1],
            tokens: [JsxToken.angleBracket, orderToken]
        });
        // <div> </div> => "div"
        if (node.kind === Typescript.SyntaxKind.JsxElement) {
            var openingTagNamePositions = calcPosition(openingNode.tagName, lines).positions;
            var closingTagNamePositions = calcPosition(closingNode.tagName, lines).positions;
            classifications.push({
                start: openingTagNamePositions[0],
                end: openingTagNamePositions[1],
                tokens: [JsxToken.tagName, orderToken]
            });
            classifications.push({
                start: closingTagNamePositions[0],
                end: closingTagNamePositions[1],
                tokens: [JsxToken.tagName, orderToken]
            });
        }
    }
};

/**
 * 分析jsx attribute key
 * @param data
 */
var disposeJsxAttributeKey = function (data) {
    var node = data.node, lines = data.lines, classifications = data.classifications;
    var positions = calcPosition(node, lines).positions;
    classifications.push({
        start: positions[0],
        end: positions[1],
        tokens: [JsxToken.attributeKey]
    });
};

var disposeJsxExpression = function (data) {
    var node = data.node, lines = data.lines, classifications = data.classifications;
    var positions = calcPosition(node, lines).positions;
    // className={`666`} => "{"
    classifications.push({
        start: positions[0],
        end: positions[0],
        tokens: [JsxToken.expressionBraces]
    });
    // className={`666`} => "}"
    classifications.push({
        start: positions[1],
        end: positions[1],
        tokens: [JsxToken.expressionBraces]
    });
};

var disposeJsxText = function (data) {
    var node = data.node, lines = data.lines, classifications = data.classifications;
    var positions = calcPosition(node, lines).positions;
    classifications.push({
        start: positions[0],
        end: positions[1],
        tokens: [JsxToken.text]
    });
};

var disposeNode = function (data) {
    var node = data.node, index = data.index;
    // 寻找到 jsx element or fragment 节点
    if ([
        Typescript.SyntaxKind.JsxFragment,
        Typescript.SyntaxKind.JsxElement,
        Typescript.SyntaxKind.JsxSelfClosingElement
    ].includes(node.kind)) {
        disposeJsxElementOrFragment(data);
    }
    Typescript.SyntaxKind[node.kind];
    // jsx attribute key
    if (node.parent &&
        node.parent.kind === Typescript.SyntaxKind.JsxAttribute &&
        node.kind === Typescript.SyntaxKind.Identifier &&
        index === 0) {
        disposeJsxAttributeKey(data);
    }
    // jsx expression
    if (node.kind === Typescript.SyntaxKind.JsxExpression) {
        disposeJsxExpression(data);
    }
    if (node.kind === Typescript.SyntaxKind.JsxText) {
        disposeJsxText(data);
    }
};
var walkAST = function (data) {
    disposeNode(data);
    var counter = 0;
    Typescript.forEachChild(data.node, function (child) {
        return walkAST(__assign(__assign({}, data), { node: child, index: counter++ }));
    });
};
var withDefaultConfig = function (config) {
    var _a = (config || {}).jsxTagCycle, jsxTagCycle = _a === void 0 ? 3 : _a;
    return {
        jsxTagCycle: jsxTagCycle
    };
};
var analysisTsx = function (filePath, code, config) {
    try {
        var classifications = [];
        var sourceFile = Typescript.createSourceFile(filePath, code, Typescript.ScriptTarget.ES2020, true);
        // 切割分析每一行的长度
        var lines = code.split('\n').map(function (line) { return line.length + 1; });
        walkAST({
            node: sourceFile,
            lines: lines,
            context: { jsxTagOrder: 1 },
            classifications: classifications,
            config: withDefaultConfig(config),
            index: 0
        });
        return classifications;
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
};
// Respond to message from parent thread
self.addEventListener('message', function (event) {
    var _a = event.data, code = _a.code, filePath = _a.filePath, version = _a.version, config = _a.config;
    try {
        var result = analysisTsx(filePath, code, config);
        self.postMessage({ classifications: result, version: version, filePath: filePath });
    }
    catch (e) {
        /* Ignore error */
    }
});
