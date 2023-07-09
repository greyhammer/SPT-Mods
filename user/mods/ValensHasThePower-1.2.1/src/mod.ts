import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

class Mod implements IPreAkiLoadMod {
    // Code added here will load BEFORE the server has started loading
    preAkiLoad(container: DependencyContainer): void {
        // get the logger from the server container
        const logger = container.resolve<ILogger>("WinstonLogger");

        logger.logWithColor("Loading Valens Has The Power 1.2.1", 'blue', 'yellowBG');
    }
}

module.exports = { mod: new Mod() }