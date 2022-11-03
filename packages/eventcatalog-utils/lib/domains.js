"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDomainToCatalog = exports.buildDomainMarkdownForCatalog = exports.getDomainFromCatalog = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const markdown_builder_1 = __importDefault(require("./markdown-builder"));
const readMarkdownFile = (pathToFile) => {
    const file = fs_extra_1.default.readFileSync(pathToFile, {
        encoding: 'utf-8',
    });
    return {
        parsed: (0, gray_matter_1.default)(file),
        raw: file,
    };
};
const getDomainFromCatalog = ({ catalogDirectory }) => (domainName) => {
    try {
        // Read the directory to get the stuff we need.
        const { parsed: parsedService, raw } = readMarkdownFile(path_1.default.join(catalogDirectory, 'domains', domainName, 'index.md'));
        return {
            data: parsedService.data,
            content: parsedService.content,
            raw,
        };
    }
    catch (error) {
        return null;
    }
};
exports.getDomainFromCatalog = getDomainFromCatalog;
const buildDomainMarkdownForCatalog = () => (domain, { markdownContent, renderMermaidDiagram = true, renderNodeGraph = false } = {}) => (0, markdown_builder_1.default)({
    frontMatterObject: domain,
    customContent: markdownContent,
    renderMermaidDiagram,
    renderNodeGraph,
});
exports.buildDomainMarkdownForCatalog = buildDomainMarkdownForCatalog;
const writeDomainToCatalog = ({ catalogDirectory }) => (domain, options) => {
    const { name: domainName } = domain;
    const { useMarkdownContentFromExistingDomain = true, renderMermaidDiagram = true, renderNodeGraph = false } = options || {};
    let markdownContent;
    if (!domainName)
        throw new Error('No `name` found for given domain');
    if (useMarkdownContentFromExistingDomain) {
        const data = (0, exports.getDomainFromCatalog)({ catalogDirectory })(domainName);
        markdownContent = (data === null || data === void 0 ? void 0 : data.content) ? data === null || data === void 0 ? void 0 : data.content : '';
    }
    const data = (0, exports.buildDomainMarkdownForCatalog)()(domain, {
        markdownContent,
        useMarkdownContentFromExistingDomain,
        renderMermaidDiagram,
        renderNodeGraph,
    });
    fs_extra_1.default.ensureDirSync(path_1.default.join(catalogDirectory, 'domains', domain.name));
    fs_extra_1.default.writeFileSync(path_1.default.join(catalogDirectory, 'domains', domain.name, 'index.md'), data);
    return {
        path: path_1.default.join(catalogDirectory, 'domains', domain.name),
    };
};
exports.writeDomainToCatalog = writeDomainToCatalog;
