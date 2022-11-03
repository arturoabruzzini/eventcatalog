"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeServiceToCatalog = exports.getServiceFromCatalog = exports.getAllServicesFromCatalog = exports.buildServiceMarkdownForCatalog = void 0;
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
const buildServiceMarkdownForCatalog = () => (service, { markdownContent, renderMermaidDiagram = true, renderNodeGraph = false } = {}) => (0, markdown_builder_1.default)({
    frontMatterObject: service,
    customContent: markdownContent,
    renderMermaidDiagram,
    renderNodeGraph,
});
exports.buildServiceMarkdownForCatalog = buildServiceMarkdownForCatalog;
const getAllServicesFromCatalog = ({ catalogDirectory }) => () => {
    const servicesDir = path_1.default.join(catalogDirectory, 'services');
    const folders = fs_extra_1.default.readdirSync(servicesDir);
    return folders.map((folder) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { raw, ...service } = (0, exports.getServiceFromCatalog)({ catalogDirectory })(folder);
        return service;
    });
};
exports.getAllServicesFromCatalog = getAllServicesFromCatalog;
const getServiceFromCatalog = ({ catalogDirectory }) => (seriveName) => {
    try {
        // Read the directory to get the stuff we need.
        const { parsed: parsedService, raw } = readMarkdownFile(path_1.default.join(catalogDirectory, 'services', seriveName, 'index.md'));
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
exports.getServiceFromCatalog = getServiceFromCatalog;
const writeServiceToCatalog = ({ catalogDirectory }) => (service, options) => {
    const { name: serviceName } = service;
    const { useMarkdownContentFromExistingService = true, renderMermaidDiagram = true, renderNodeGraph = false } = options || {};
    let markdownContent;
    if (!serviceName)
        throw new Error('No `name` found for given service');
    if (useMarkdownContentFromExistingService) {
        const data = (0, exports.getServiceFromCatalog)({ catalogDirectory })(serviceName);
        markdownContent = (data === null || data === void 0 ? void 0 : data.content) ? data === null || data === void 0 ? void 0 : data.content : '';
    }
    const data = (0, exports.buildServiceMarkdownForCatalog)()(service, {
        markdownContent,
        useMarkdownContentFromExistingService,
        renderMermaidDiagram,
        renderNodeGraph,
    });
    fs_extra_1.default.ensureDirSync(path_1.default.join(catalogDirectory, 'services', service.name));
    fs_extra_1.default.writeFileSync(path_1.default.join(catalogDirectory, 'services', service.name, 'index.md'), data);
    return {
        path: path_1.default.join(catalogDirectory, 'services', service.name),
    };
};
exports.writeServiceToCatalog = writeServiceToCatalog;
