"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAWSConsoleUrlForService = exports.getAWSConsoleUrlForEventBridgeRuleMetrics = exports.getAWSConsoleUrlForEventBridgeRule = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const client_schemas_1 = require("@aws-sdk/client-schemas");
const getSchemas = (schemas, registryName) => async () => {
    // First get all schemas
    const { Schemas: registrySchemas = [] } = await schemas.listSchemas({ RegistryName: registryName });
    const allSchemas = registrySchemas.map(async (registrySchema) => {
        // Get the JSON schema
        const schemaAsJSON = await schemas.exportSchema({
            RegistryName: registryName,
            SchemaName: registrySchema.SchemaName,
            Type: 'JSONSchemaDraft4',
        });
        // Get the OpenAPI schema
        const schemaAsOpenAPI = await schemas.describeSchema({
            RegistryName: registryName,
            SchemaName: registrySchema.SchemaName,
        });
        const jsonSchema = buildSchema(schemaAsJSON);
        const openAPISchema = buildSchema(schemaAsOpenAPI);
        return {
            ...jsonSchema,
            ...openAPISchema,
            Content: {
                jsonSchema: jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.Content,
                openAPISchema: openAPISchema === null || openAPISchema === void 0 ? void 0 : openAPISchema.Content,
            },
            Type: 'Custom-Merged',
            DetailType: jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.Content['x-amazon-events-detail-type'],
            Source: jsonSchema === null || jsonSchema === void 0 ? void 0 : jsonSchema.Content['x-amazon-events-source'],
        };
    });
    return Promise.all(allSchemas);
};
const buildSchema = (rawSchema) => ({
    ...rawSchema,
    Content: JSON.parse(rawSchema.Content || ''),
});
const flattenRules = (busRules) => busRules.reduce((rules, rule) => {
    const eventPattern = JSON.parse(rule.EventPattern);
    const detailType = eventPattern['detail-type'] || [];
    detailType.forEach((detail) => {
        if (!rules[detail]) {
            rules[detail] = { rules: [] };
        }
        rules[detail].rules.push({
            name: rule.Name,
            pattern: JSON.parse(rule.EventPattern),
        });
    });
    return rules;
}, {});
const getAWSConsoleUrlForEventBridgeRule = ({ region, eventBusName, ruleName, }) => {
    const url = new URL(`events/home?region=${region}#/eventbus/${eventBusName}/rules/${ruleName}`, `https://${region}.console.aws.amazon.com`);
    return url.href;
};
exports.getAWSConsoleUrlForEventBridgeRule = getAWSConsoleUrlForEventBridgeRule;
const getAWSConsoleUrlForEventBridgeRuleMetrics = ({ region, eventBusName, ruleName, }) => {
    const query = `*7bAWS*2fEvents*2cEventBusName*2CRuleName*7d*20RuleName*3d*22${ruleName}*22*20EventBusName*3d*22${eventBusName}*22`;
    const url = new URL(`cloudwatch/home?region=${region}#metricsV2:graph=~();query=~'${query}`, `https://${region}.console.aws.amazon.com`);
    return url.href;
};
exports.getAWSConsoleUrlForEventBridgeRuleMetrics = getAWSConsoleUrlForEventBridgeRuleMetrics;
const getAWSConsoleUrlForService = ({ region, service }) => {
    const url = new URL(`${service}/home?region=${region}`, `https://${region}.console.aws.amazon.com`);
    return url.href;
};
exports.getAWSConsoleUrlForService = getAWSConsoleUrlForService;
const getEventBusRulesAndTargets = (eventbridge, eventBusName) => async () => {
    const rulesForEvents = await eventbridge.listRules({ EventBusName: eventBusName, Limit: 100 });
    const rulesByEvent = rulesForEvents.Rules ? flattenRules(rulesForEvents.Rules) : {};
    return Object.keys(rulesByEvent).reduce(async (data, event) => {
        const listOfRulesForEvent = rulesByEvent[event].rules || [];
        const eventTargetsAndRules = listOfRulesForEvent.map(async (rule) => {
            const { Targets = [] } = await eventbridge.listTargetsByRule({ Rule: rule.name, EventBusName: eventBusName });
            const targets = Targets.map(({ Arn: arnString = '' }) => {
                const { service, resource, resourceName } = aws_cdk_lib_1.Arn.split(arnString, aws_cdk_lib_1.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME);
                return { service, resource, resourceName, arn: arnString };
            });
            return { ...rule, targets };
        });
        const eventWithTargetsAndRules = await Promise.all(eventTargetsAndRules);
        return {
            ...(await data),
            [event]: eventWithTargetsAndRules,
        };
    }, {});
};
exports.default = (options) => {
    const { credentials, registryName, region, eventBusName } = options;
    const schemas = new client_schemas_1.Schemas({ credentials, region });
    const eventbridge = new client_eventbridge_1.EventBridge({ credentials, region });
    return {
        getSchemas: getSchemas(schemas, registryName),
        getEventBusRulesAndTargets: getEventBusRulesAndTargets(eventbridge, eventBusName),
    };
};
