"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existsInCatalog = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const events_1 = require("./events");
const services_1 = require("./services");
const domains_1 = require("./domains");
const existsInCatalog = ({ catalogDirectory }) => (name, options) => {
    const { type, version } = options;
    const folder = `${type}s`;
    return fs_extra_1.default.existsSync(path_1.default.join(catalogDirectory, folder, name, version ? path_1.default.join('versioned', version) : ''));
};
exports.existsInCatalog = existsInCatalog;
const utils = ({ catalogDirectory }) => ({
    // event funcs
    writeEventToCatalog: (0, events_1.writeEventToCatalog)({ catalogDirectory }),
    getEventFromCatalog: (0, events_1.getEventFromCatalog)({ catalogDirectory }),
    buildEventMarkdownForCatalog: (0, events_1.buildEventMarkdownForCatalog)(),
    getAllEventsFromCatalog: (0, events_1.getAllEventsFromCatalog)({ catalogDirectory }),
    versionEvent: (0, events_1.versionEvent)({ catalogDirectory }),
    // service funcs
    writeServiceToCatalog: (0, services_1.writeServiceToCatalog)({ catalogDirectory }),
    buildServiceMarkdownForCatalog: (0, services_1.buildServiceMarkdownForCatalog)(),
    getServiceFromCatalog: (0, services_1.getServiceFromCatalog)({ catalogDirectory }),
    getAllServicesFromCatalog: (0, services_1.getAllServicesFromCatalog)({ catalogDirectory }),
    // domain funcs
    getDomainFromCatalog: (0, domains_1.getDomainFromCatalog)({ catalogDirectory }),
    writeDomainToCatalog: (0, domains_1.writeDomainToCatalog)({ catalogDirectory }),
    buildDomainMarkdownForCatalog: (0, domains_1.buildDomainMarkdownForCatalog)(),
    // generic
    existsInCatalog: (0, exports.existsInCatalog)({ catalogDirectory }),
});
exports.default = utils;
