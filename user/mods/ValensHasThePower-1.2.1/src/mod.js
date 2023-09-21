"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mod {
    // Code added here will load BEFORE the server has started loading
    preAkiLoad(container) {
        // get the logger from the server container
        const logger = container.resolve("WinstonLogger");
        logger.logWithColor("Loading Valens Has The Power 1.2.1", 'blue', 'yellowBG');
    }
}
module.exports = { mod: new Mod() };
