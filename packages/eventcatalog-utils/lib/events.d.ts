import matter from 'gray-matter';
import { Event } from '@eventcatalog/types';
import { FunctionInitInterface, GetEventFromCatalogOptions, WriteEventToCatalogOptions, WriteEventToCatalogResponse } from './types';
export declare const getEventFromCatalog: ({ catalogDirectory }: FunctionInitInterface) => (eventName: string, options?: GetEventFromCatalogOptions | undefined) => {
    data: Event;
    content: string;
    raw: string;
} | null;
export declare const getAllEventsFromCatalog: ({ catalogDirectory }: FunctionInitInterface) => () => any[];
export declare const buildEventMarkdownForCatalog: () => (event: Event, { markdownContent, includeSchemaComponent, renderMermaidDiagram, renderNodeGraph, defaultFrontMatter }?: any) => string;
export declare const versionEvent: ({ catalogDirectory }: FunctionInitInterface) => (eventName: string, { removeOnVersion }?: {
    removeOnVersion?: boolean | undefined;
}) => {
    version: any;
    versionedPath: string;
    event: matter.GrayMatterFile<string>;
    raw: string;
};
export declare const writeEventToCatalog: ({ catalogDirectory }: FunctionInitInterface) => (event: Event, options?: WriteEventToCatalogOptions | undefined) => WriteEventToCatalogResponse;
