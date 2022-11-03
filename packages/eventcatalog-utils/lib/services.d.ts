import { Service } from '@eventcatalog/types';
import { FunctionInitInterface, WriteServiceToCatalogInterface, WriteServiceToCatalogInterfaceReponse } from './types';
export declare const buildServiceMarkdownForCatalog: () => (service: Service, { markdownContent, renderMermaidDiagram, renderNodeGraph }?: any) => string;
export declare const getAllServicesFromCatalog: ({ catalogDirectory }: FunctionInitInterface) => () => any[];
export declare const getServiceFromCatalog: ({ catalogDirectory }: FunctionInitInterface) => (seriveName: string) => {
    data: {
        [key: string]: any;
    };
    content: string;
    raw: string;
} | null;
export declare const writeServiceToCatalog: ({ catalogDirectory }: FunctionInitInterface) => (service: Service, options?: WriteServiceToCatalogInterface | undefined) => WriteServiceToCatalogInterfaceReponse;
