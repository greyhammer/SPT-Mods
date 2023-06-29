"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DisableDiscardLimits {
    postDBLoad(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const logger = container.resolve("WinstonLogger");
        const tables = databaseServer.getTables();
        tables.globals.config.DiscardLimitsEnabled = false;
        logger.info("Global config DiscardLimitsEnabled set to false");
    }
}
module.exports = { mod: new DisableDiscardLimits() };
