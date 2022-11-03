import { Event, Service, Domain } from '@eventcatalog/types';
declare const _default: ({ frontMatterObject, customContent, includeSchemaComponent, renderMermaidDiagram, renderNodeGraph, }: {
    frontMatterObject: Service | Event | Domain;
    customContent?: string | undefined;
    includeSchemaComponent?: boolean | undefined;
    renderMermaidDiagram?: boolean | undefined;
    renderNodeGraph?: boolean | undefined;
}) => string;
export default _default;
