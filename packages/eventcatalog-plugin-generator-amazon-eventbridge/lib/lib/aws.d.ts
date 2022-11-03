import { ExportSchemaCommandOutput } from '@aws-sdk/client-schemas';
import { PluginOptions } from '../types';
export interface CustomSchema extends ExportSchemaCommandOutput {
    Content?: any;
    DetailType?: string;
    Source?: string;
    Description?: string;
}
export declare const getAWSConsoleUrlForEventBridgeRule: ({ region, eventBusName, ruleName, }: {
    region: string;
    eventBusName: string;
    ruleName: string;
}) => string;
export declare const getAWSConsoleUrlForEventBridgeRuleMetrics: ({ region, eventBusName, ruleName, }: {
    region: string;
    eventBusName: string;
    ruleName: string;
}) => string;
export declare const getAWSConsoleUrlForService: ({ region, service }: {
    region: string;
    service: string;
}) => string;
declare const _default: (options: PluginOptions) => {
    getSchemas: () => Promise<CustomSchema[]>;
    getEventBusRulesAndTargets: () => Promise<{}>;
};
export default _default;
