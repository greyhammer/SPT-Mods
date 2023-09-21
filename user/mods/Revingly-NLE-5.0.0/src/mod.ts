import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod"
import { NLE } from "./NLE";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

// local import
import * as config from "../config/config.json";

class Mod implements IPreAkiLoadMod
{
    // This example will show you how to override and register your own components and use them
    // The container will by default register all AKI dependencies, but you can inject into it
    // you own custom implementations the server will then use.
    // In this example we will take the LauncherCallbacks class and override the ping() method
    // for our own custom method that will return "Lets dance" instead of "pong!"
    
    // Perform these actions before server fully loads
    public preAkiLoad(container: DependencyContainer): void {

        // get logger
        const logger = container.resolve<ILogger>("WinstonLogger");
        
        logger.info(`Revingly-NeverLoseEquipment: ${config.disableThisMod ? "Not active" : "Active"}`);

        // If the mod is disabled then dont override anything
        if (config.disableThisMod) return;

        container.register<NLE>("NLE", NLE);
        container.register<NLE>("InraidController", { useClass: NLE });
    }
}

module.exports = { mod: new Mod() }