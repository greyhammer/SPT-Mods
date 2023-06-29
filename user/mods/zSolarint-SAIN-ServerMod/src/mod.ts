/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/brace-style */

import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IBotConfig } from "@spt-aki/models/spt/config/IBotConfig";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { DependencyContainer } from "tsyringe";

let botConfig: IBotConfig;
let configServer: ConfigServer;
let logger: ILogger;

class SAIN implements IPostDBLoadMod {
    public postDBLoad(container: DependencyContainer): void {
        logger = container.resolve<ILogger>("WinstonLogger");
        configServer = container.resolve<ConfigServer>("ConfigServer");
        botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();

        // Get all PMCTypes dynamically
        const pmcTypes = Object.keys(botConfig.pmc.pmcType);

        // Loop through each PMCTypes
        for (const pmcType of pmcTypes) {
            const maps = Object.keys(botConfig.pmc.pmcType[pmcType]);

            // Loop through each map
            for (const map of maps) {
                const brain = botConfig.pmc.pmcType[pmcType][map];
                brain.bossKilla = 0;
                brain.bossKnight = 0;
                brain.bossGluhar = 0;
                brain.bossSanitar = 0;
                brain.bossTagilla = 0;
                brain.bossZryachiy = 0;
                brain.followerGluharAssault = 0;
                brain.followerBully = 0;
                brain.followerBigPipe = 0;
                brain.followerSanitar = 0;
                brain.assault = 0;
                brain.cursedAssault = 0;
                brain.exUsec = 0;
                brain.pmcBot = 1;
            }
        }
        
        const locationSettings = {
            woods: tables.locations.woods.base.BotLocationModifier,
            customs: tables.locations.bigmap.base.BotLocationModifier,
            reserve: tables.locations.rezervbase.base.BotLocationModifier,
            shoreline: tables.locations.shoreline.base.BotLocationModifier,
            streets: tables.locations.tarkovstreets.base.BotLocationModifier,
            lighthouse: tables.locations.lighthouse.base.BotLocationModifier,
            factoryday: tables.locations.factory4_day.base.BotLocationModifier,
            factorynight: tables.locations.factory4_night.base.BotLocationModifier,
            labs: tables.locations.laboratory.base.BotLocationModifier,
            interchange: tables.locations.interchange.base.BotLocationModifier
        };

        for (const location in locationSettings) {
            if (locationSettings.hasOwnProperty(location)) {
                const settings = locationSettings[location];
                settings.AccuracySpeed = 1;
                settings.GainSight = 1;
                settings.Scattering = 1;
                settings.VisibleDistance = 1;
            }
        }
    }
}
module.exports = { mod: new SAIN() }