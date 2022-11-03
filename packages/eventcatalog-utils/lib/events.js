"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeEventToCatalog = exports.versionEvent = exports.buildEventMarkdownForCatalog = exports.getAllEventsFromCatalog = exports.getEventFromCatalog = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const markdown_builder_1 = __importDefault(require("./markdown-builder"));
const index_1 = require("./index");
const parseEventFrontMatterIntoEvent = (eventFrontMatter) => {
    const { name, version, summary, producers = [], consumers = [], owners = [] } = eventFrontMatter;
    return { name, version, summary, producers, consumers, owners };
};
const readMarkdownFile = (pathToFile) => {
    const file = fs_extra_1.default.readFileSync(pathToFile, {
        encoding: 'utf-8',
    });
    return {
        parsed: (0, gray_matter_1.default)(file),
        raw: file,
    };
};
const getEventFromCatalog = ({ catalogDirectory }) => (eventName, options) => {
    const { version } = options || {};
    if (!(0, index_1.existsInCatalog)({ catalogDirectory })(eventName, { type: 'event', version })) {
        return null;
    }
    // Read the directory to get the stuff we need.
    const { parsed: parsedEvent, raw } = readMarkdownFile(path_1.default.join(catalogDirectory, 'events', eventName, version ? path_1.default.join('versioned', version) : '', 'index.md'));
    return {
        data: parseEventFrontMatterIntoEvent(parsedEvent.data),
        content: parsedEvent.content,
        raw,
    };
};
exports.getEventFromCatalog = getEventFromCatalog;
const getAllEventsFromCatalog = ({ catalogDirectory }) => () => {
    const eventsDir = path_1.default.join(catalogDirectory, 'events');
    const folders = fs_extra_1.default.readdirSync(eventsDir);
    const events = folders.map((folder) => (0, exports.getEventFromCatalog)({ catalogDirectory })(folder));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return events.filter((event) => event !== null).map(({ raw, ...event }) => event);
};
exports.getAllEventsFromCatalog = getAllEventsFromCatalog;
const buildEventMarkdownForCatalog = () => (event, { markdownContent, includeSchemaComponent, renderMermaidDiagram, renderNodeGraph, defaultFrontMatter = {} } = {}) => {
    const frontMatter = (0, deepmerge_1.default)(event, defaultFrontMatter);
    return (0, markdown_builder_1.default)({
        frontMatterObject: frontMatter,
        customContent: markdownContent,
        includeSchemaComponent,
        renderMermaidDiagram,
        renderNodeGraph,
    });
};
exports.buildEventMarkdownForCatalog = buildEventMarkdownForCatalog;
const versionEvent = ({ catalogDirectory }) => (eventName, { removeOnVersion = true } = {}) => {
    const eventPath = path_1.default.join(catalogDirectory, 'events', eventName);
    const versionedPath = path_1.default.join(catalogDirectory, 'events', eventName, 'versioned');
    if (!fs_extra_1.default.existsSync(eventPath))
        throw new Error(`Cannot find event "${eventName}" to version`);
    const { parsed: parsedEvent, raw } = readMarkdownFile(path_1.default.join(eventPath, 'index.md'));
    const { data: { version } = {} } = parsedEvent;
    if (!version)
        throw new Error(`Trying to version "${eventName}" but no 'version' value found on the event`);
    fs_extra_1.default.copySync(eventPath, path_1.default.join(eventPath, '../tmp', eventName));
    if (fs_extra_1.default.existsSync(path_1.default.join(eventPath, '../tmp', eventName, 'versioned'))) {
        fs_extra_1.default.rmdirSync(path_1.default.join(eventPath, '../tmp', eventName, 'versioned'), { recursive: true });
    }
    fs_extra_1.default.moveSync(path_1.default.join(eventPath, '../tmp', eventName), path_1.default.join(versionedPath, version), {
        overwrite: true,
    });
    fs_extra_1.default.rmdirSync(path_1.default.join(eventPath, '../tmp'), { recursive: true });
    if (removeOnVersion) {
        fs_extra_1.default.copySync(path_1.default.join(eventPath, 'versioned'), path_1.default.join(eventPath, '../tmp', eventName, 'versioned'));
        fs_extra_1.default.rmdirSync(path_1.default.join(eventPath), { recursive: true });
        fs_extra_1.default.moveSync(path_1.default.join(eventPath, '../tmp', eventName, 'versioned'), path_1.default.join(eventPath, 'versioned'), { overwrite: true });
        fs_extra_1.default.rmdirSync(path_1.default.join(eventPath, '../tmp'), { recursive: true });
    }
    return {
        version,
        versionedPath: path_1.default.join(versionedPath, version),
        event: parsedEvent,
        raw,
    };
};
exports.versionEvent = versionEvent;
const writeEventToCatalog = ({ catalogDirectory }) => (event, options) => {
    const { name: eventName, version } = event;
    const { useMarkdownContentFromExistingEvent = true, renderMermaidDiagram = true, renderNodeGraph = false, versionExistingEvent = true, isLatestVersion = true, schema, codeExamples = [], markdownContent: setMarkdownContent, frontMatterToCopyToNewVersions, } = options || {};
    let markdownContent = setMarkdownContent;
    if (!eventName)
        throw new Error('No `name` found for given event');
    if (!isLatestVersion && !version)
        throw new Error('No `version` found for given event');
    const eventAlreadyInCatalog = (0, index_1.existsInCatalog)({ catalogDirectory })(eventName, {
        type: 'event',
        version: !isLatestVersion ? version : undefined,
    });
    if (!markdownContent && useMarkdownContentFromExistingEvent && eventAlreadyInCatalog) {
        try {
            const data = (0, exports.getEventFromCatalog)({ catalogDirectory })(eventName, { version: !isLatestVersion ? version : undefined });
            markdownContent = (data === null || data === void 0 ? void 0 : data.content) ? data === null || data === void 0 ? void 0 : data.content : '';
        }
        catch (error) {
            // TODO: do nothing
            console.log(error);
        }
    }
    let defaultFrontMatterForNewEvent = {};
    // Check if we should carry frontmatter from previous event into the new one.
    if (eventAlreadyInCatalog && frontMatterToCopyToNewVersions) {
        const eventFromCatalog = (0, exports.getEventFromCatalog)({ catalogDirectory })(eventName, {
            version: !isLatestVersion ? version : undefined,
        });
        defaultFrontMatterForNewEvent = Object.keys(frontMatterToCopyToNewVersions).reduce((defaultValues, key) => 
        // @ts-ignore
        frontMatterToCopyToNewVersions[key] ? { ...defaultValues, [key]: eventFromCatalog === null || eventFromCatalog === void 0 ? void 0 : eventFromCatalog.data[key] } : defaultValues, {});
    }
    if (eventAlreadyInCatalog && versionExistingEvent && isLatestVersion) {
        (0, exports.versionEvent)({ catalogDirectory })(eventName);
    }
    const eventPath = path_1.default.join(catalogDirectory, 'events', eventName, !isLatestVersion ? path_1.default.join('versioned', version) : '');
    fs_extra_1.default.ensureDirSync(eventPath);
    const data = (0, exports.buildEventMarkdownForCatalog)()(event, {
        markdownContent,
        renderMermaidDiagram,
        renderNodeGraph,
        includeSchemaComponent: !!schema,
        defaultFrontMatter: defaultFrontMatterForNewEvent,
    });
    fs_extra_1.default.writeFileSync(path_1.default.join(eventPath, 'index.md'), data);
    if (schema && schema.extension && schema.fileContent) {
        fs_extra_1.default.writeFileSync(path_1.default.join(eventPath, `schema.${schema.extension}`), schema.fileContent);
    }
    if (codeExamples.length > 0) {
        fs_extra_1.default.ensureDirSync(path_1.default.join(eventPath, 'examples'));
        codeExamples.forEach((codeExample) => {
            fs_extra_1.default.writeFileSync(path_1.default.join(eventPath, 'examples', codeExample.fileName), codeExample.fileContent);
        });
    }
    return {
        path: path_1.default.join(eventPath),
    };
};
exports.writeEventToCatalog = writeEventToCatalog;
