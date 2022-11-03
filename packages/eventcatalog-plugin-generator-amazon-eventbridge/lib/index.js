"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("@eventcatalog/utils"));
const chalk_1 = __importDefault(require("chalk"));
const types_1 = require("./types");
const aws_1 = __importDefault(require("./lib/aws"));
const markdown_1 = require("./markdown");
const buildEventFromEventBridgeSchema = (schema, region, eventBusName, schemaType) => {
    const { SchemaName, DetailType, Source, SchemaVersion, Description, Content } = schema;
    const externalLinks = [];
    if (SchemaName) {
        const url = new URL(`events/home?region=${region}#/registries/discovered-schemas/schemas/${SchemaName}`, `https://${region}.console.aws.amazon.com`);
        externalLinks.push({ label: 'View Schema AWS Console', url: url.href });
    }
    const schemaToUse = schemaType === types_1.SchemaTypes.JSONSchemaDraft4 ? Content.jsonSchema : Content.openAPISchema;
    const examples = schemaType === types_1.SchemaTypes.JSONSchemaDraft4
        ? { fileName: `${SchemaName}-openapi-schema.json`, fileContent: JSON.stringify(Content.openAPISchema, null, 4) }
        : { fileName: `${SchemaName}-json-schema.json`, fileContent: JSON.stringify(Content.jsonSchema, null, 4) };
    return {
        name: SchemaName || `${Source}@${DetailType}`,
        version: SchemaVersion || '',
        summary: Description || `Found on the "${eventBusName}" Amazon EventBridge bus.`,
        externalLinks,
        schema: schemaToUse,
        examples: [examples],
        badges: [],
    };
};
exports.default = async (_, options) => {
    const { region, eventBusName, schemaTypeToRenderToEvent = types_1.SchemaTypes.JSONSchemaDraft4, versionEvents = true } = options;
    if (!process.env.PROJECT_DIR) {
        throw new Error('Please provide catalog url (env variable PROJECT_DIR)');
    }
    const { getSchemas, getEventBusRulesAndTargets } = (0, aws_1.default)(options);
    const { writeEventToCatalog, getEventFromCatalog } = (0, utils_1.default)({ catalogDirectory: process.env.PROJECT_DIR });
    const schemas = await getSchemas();
    const rules = await getEventBusRulesAndTargets();
    const events = schemas.map((schema) => ({
        event: buildEventFromEventBridgeSchema(schema, region, eventBusName, schemaTypeToRenderToEvent),
        awsSchema: schema,
    }));
    events.forEach(({ event, awsSchema }) => {
        var _a;
        const { examples, schema, ...eventData } = event;
        const detailType = awsSchema === null || awsSchema === void 0 ? void 0 : awsSchema.DetailType;
        const eventRules = detailType && rules[detailType] ? rules[detailType] : [];
        const matchingEventsAlreadyInCatalog = getEventFromCatalog(eventData.name);
        const versionChangedFromPreviousEvent = ((_a = matchingEventsAlreadyInCatalog === null || matchingEventsAlreadyInCatalog === void 0 ? void 0 : matchingEventsAlreadyInCatalog.data) === null || _a === void 0 ? void 0 : _a.version) !== eventData.version;
        writeEventToCatalog(eventData, {
            codeExamples: examples,
            schema: {
                extension: 'json',
                fileContent: JSON.stringify(schema, null, 4),
            },
            frontMatterToCopyToNewVersions: {
                owners: true,
            },
            versionExistingEvent: versionEvents && versionChangedFromPreviousEvent,
            useMarkdownContentFromExistingEvent: true,
            markdownContent: eventRules.length > 0
                ? (0, markdown_1.buildMarkdownForEvent)({ rules: eventRules, eventBusName, eventName: eventData.name, region })
                : (0, markdown_1.buildMarkdownForEventWithoutRules)(),
        });
    });
    console.log(chalk_1.default.green(`  
  Succesfully parsed "${schemas.length}" schemas from "${eventBusName}" event bus. 
  
  Generated ${events.length} events for EventCatalog.
`));
};
