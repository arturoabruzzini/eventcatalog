"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yamljs_1 = __importDefault(require("yamljs"));
const json2md_1 = __importDefault(require("json2md"));
exports.default = ({ frontMatterObject, customContent, includeSchemaComponent = false, renderMermaidDiagram = true, renderNodeGraph = false, }) => {
    const customJSON2MD = (content) => {
        json2md_1.default.converters.mermaid = (render) => (render ? '<Mermaid />' : '');
        json2md_1.default.converters.schema = (render) => (render ? '<Schema />' : '');
        json2md_1.default.converters.nodeGraph = (render) => (render ? '<NodeGraph />' : '');
        return (0, json2md_1.default)(content);
    };
    const content = [{ mermaid: renderMermaidDiagram }, { nodeGraph: renderNodeGraph }, { schema: includeSchemaComponent }];
    return `---
${yamljs_1.default.stringify(frontMatterObject)}---
${customContent || customJSON2MD(content)}`;
};
