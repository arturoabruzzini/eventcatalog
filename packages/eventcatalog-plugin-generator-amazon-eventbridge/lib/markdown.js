"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMarkdownForEvent = exports.buildMarkdownForEventWithoutRules = void 0;
const aws_1 = require("./lib/aws");
const buildRulesAndTargetMermaidGraph = ({ eventName, rules }) => `flowchart LR
${rules
    .map((rule) => `event>"${eventName}"]:::event-- fa:fa-filter rule -->${rule.name}:::rule
classDef event stroke:#ed8ece,stroke-width: 2px, fill:#ffa7e2, color: #160505;
classDef rule stroke:#7b7fcb,stroke-width: 2px, fill: #c0c3ff;
classDef target stroke:#bec9c7,stroke-width: 2px, fill: #dbf3ef;
${rule.targets
    .map((target) => `${rule.name}{{${rule.name}}}:::rule-- fa:fa-cloud service:${target.service}, resource:${target.resource} --> ${target.resourceName}:::target\n`)
    .join('')}`)
    .join('')}`;
const buildMarkdownForEventWithoutRules = () => `No matched rules or targets found for event.
<Schema />
<EventExamples />
`;
exports.buildMarkdownForEventWithoutRules = buildMarkdownForEventWithoutRules;
const buildMarkdownForEvent = ({ rules, eventBusName, eventName, region }) => `## Matched rules for event
${rules.length > 0
    ? `
The event \`${eventName}\` has **${rules.length}** matched rules on the event bus **'${eventBusName}'**.  

| Rules | Number Of Targets | Targets | Metrics |
| --- | ------ | ----------- | ----------- |`
    : ''}
${rules
    .map((rule) => `| [${rule === null || rule === void 0 ? void 0 : rule.name}](${(0, aws_1.getAWSConsoleUrlForEventBridgeRule)({ region, eventBusName, ruleName: rule === null || rule === void 0 ? void 0 : rule.name })}) | ${rule.targets.length} | ${rule.targets
    .map((target) => `[${target.resourceName} (${target.resource})](${(0, aws_1.getAWSConsoleUrlForService)({ region, service: target.service })})`)
    .join(', ')
    .toString()} | [View](${(0, aws_1.getAWSConsoleUrlForEventBridgeRuleMetrics)({ region, eventBusName, ruleName: rule === null || rule === void 0 ? void 0 : rule.name })}) |`)
    .join('\n')}

<Mermaid title="Targets and Rules" charts={[\`${buildRulesAndTargetMermaidGraph({ eventName, rules })}\`]}/>

<Schema />

<EventExamples />
    
    `;
exports.buildMarkdownForEvent = buildMarkdownForEvent;
