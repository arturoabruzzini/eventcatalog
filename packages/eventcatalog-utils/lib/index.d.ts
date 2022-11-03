import { FunctionInitInterface } from './types';
interface ExistsInCatalogInterface {
    type: 'service' | 'event';
    version?: string;
}
export declare const existsInCatalog: ({ catalogDirectory }: FunctionInitInterface) => (name: string, options: ExistsInCatalogInterface) => boolean;
declare const utils: ({ catalogDirectory }: FunctionInitInterface) => {
    writeEventToCatalog: (event: import("@eventcatalog/types").Event, options?: import("./types").WriteEventToCatalogOptions | undefined) => import("./types").WriteEventToCatalogResponse;
    getEventFromCatalog: (eventName: string, options?: import("./types").GetEventFromCatalogOptions | undefined) => {
        data: import("@eventcatalog/types").Event;
        content: string;
        raw: string;
    } | null;
    buildEventMarkdownForCatalog: (event: import("@eventcatalog/types").Event, { markdownContent, includeSchemaComponent, renderMermaidDiagram, renderNodeGraph, defaultFrontMatter }?: any) => string;
    getAllEventsFromCatalog: () => any[];
    versionEvent: (eventName: string, { removeOnVersion }?: {
        removeOnVersion?: boolean | undefined;
    }) => {
        version: any;
        versionedPath: string;
        event: import("gray-matter").GrayMatterFile<string>;
        raw: string;
    };
    writeServiceToCatalog: (service: import("@eventcatalog/types").Service, options?: import("./types").WriteServiceToCatalogInterface | undefined) => import("./types").WriteServiceToCatalogInterfaceReponse;
    buildServiceMarkdownForCatalog: (service: import("@eventcatalog/types").Service, { markdownContent, renderMermaidDiagram, renderNodeGraph }?: any) => string;
    getServiceFromCatalog: (seriveName: string) => {
        data: {
            [key: string]: any;
        };
        content: string;
        raw: string;
    } | null;
    getAllServicesFromCatalog: () => any[];
    getDomainFromCatalog: (domainName: string) => {
        data: {
            [key: string]: any;
        };
        content: string;
        raw: string;
    } | null;
    writeDomainToCatalog: (domain: import("@eventcatalog/types").Domain, options?: import("./types").WriteDomainToCatalogOptions | undefined) => import("./types").WriteDomainToCatalogResponse;
    buildDomainMarkdownForCatalog: (domain: import("@eventcatalog/types").Domain, { markdownContent, renderMermaidDiagram, renderNodeGraph }?: any) => string;
    existsInCatalog: (name: string, options: ExistsInCatalogInterface) => boolean;
};
export default utils;
