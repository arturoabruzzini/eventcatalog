import { Domain } from '@eventcatalog/types';
import { FunctionInitInterface, WriteDomainToCatalogOptions, WriteDomainToCatalogResponse } from './types';
export declare const getDomainFromCatalog: ({ catalogDirectory }: FunctionInitInterface) => (domainName: string) => {
    data: {
        [key: string]: any;
    };
    content: string;
    raw: string;
} | null;
export declare const buildDomainMarkdownForCatalog: () => (domain: Domain, { markdownContent, renderMermaidDiagram, renderNodeGraph }?: any) => string;
export declare const writeDomainToCatalog: ({ catalogDirectory }: FunctionInitInterface) => (domain: Domain, options?: WriteDomainToCatalogOptions | undefined) => WriteDomainToCatalogResponse;
