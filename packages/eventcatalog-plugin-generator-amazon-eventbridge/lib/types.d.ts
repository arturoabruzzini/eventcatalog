import { Credentials } from '@aws-sdk/types';
export declare enum SchemaTypes {
    JSONSchemaDraft4 = 0,
    OpenAPI = 1
}
export interface PluginOptions {
    credentials: Credentials;
    region: string;
    eventBusName: string;
    registryName: string;
    schemaTypeToRenderToEvent?: SchemaTypes;
    versionEvents?: boolean;
}
