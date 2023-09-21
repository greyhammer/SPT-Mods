"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const config_json_1 = __importDefault(require("../config/config.json"));
const enums_js_1 = require("./enums.js");
class DisableDiscardLimits {
    postDBLoad(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const configServer = container.resolve("ConfigServer");
        const botConf = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const { logInfo } = useLogger(container);
        const tables = databaseServer.getTables();
        const allowedItemTypes = [
            enums_js_1.ParentClasses.THROW_WEAPON,
            enums_js_1.ParentClasses.AMMO,
            enums_js_1.ParentClasses.MEDICAL,
            enums_js_1.ParentClasses.MEDKIT,
            enums_js_1.ParentClasses.DRUGS,
            enums_js_1.ParentClasses.DRINK,
            enums_js_1.ParentClasses.FOOD,
            enums_js_1.ParentClasses.FOOD_DRINK,
            enums_js_1.ParentClasses.STIMULATOR,
        ];
        const pmcConfig = botConf.pmc;
        const emptyInventory = (botTypes) => {
            botTypes.forEach((type) => {
                logInfo(`Removing loot from ${type}`);
                tables.bots.types[type].inventory.items.Pockets = [];
                tables.bots.types[type].inventory.items.Pockets = [];
            });
        };
        if (!config_json_1.default.pmcSpawnWithLoot) {
            emptyInventory(["usec", "bear"]);
            // Do not allow weapons to spawn in PMC bags
            pmcConfig.looseWeaponInBackpackLootMinMax.min = 0;
            pmcConfig.looseWeaponInBackpackLootMinMax.max = 0;
            // Restrict the amount of food/drink items that a PMC can spawn with
            tables.bots.types["usec"].generation.items.looseLoot.max = 4;
            tables.bots.types["bear"].generation.items.looseLoot.max = 4;
            //have to add all loot items we don't want to pmc blacklist because PMCs use "dynamic loot" pool
            for (let item in tables.templates.items) {
                const { _parent, _id } = tables.templates.items[item];
                if (!allowedItemTypes.includes(_parent)) {
                    pmcConfig.pocketLoot.blacklist.push(_id);
                    pmcConfig.backpackLoot.blacklist.push(_id);
                    pmcConfig.vestLoot.blacklist.push(_id);
                }
            }
        }
        if (!config_json_1.default.scavSpawnWithLoot) {
            emptyInventory(["assault"]);
        }
        logInfo("Marking items with DiscardLimits as InsuranceDisabled");
        for (let itemId in tables.templates.items) {
            const template = tables.templates.items[itemId];
            /**
             * When we set DiscardLimitsEnabled to false further down, this will cause some items to be able to be insured when they normally should not be.
             * The DiscardLimit property is used by BSG for RMT protections and their code internally treats things with discard limits as not insurable.
             * For items that have a DiscardLimit >= 0, we need to manually flag them as InsuranceDisabled to make sure they still cannot be insured by the player.
             * Do not disable insurance if the item is marked as always available for insurance.
             */
            if (template._props.DiscardLimit >= 0 &&
                !template._props.IsAlwaysAvailableForInsurance) {
                template._props.InsuranceDisabled = true;
            }
        }
        tables.globals.config.DiscardLimitsEnabled = false;
        logInfo("Global config DiscardLimitsEnabled set to false");
    }
}
function useLogger(container) {
    const logger = container.resolve("WinstonLogger");
    return {
        logInfo: (message) => {
            logger.info(`[NoDiscardLimit] ${message}`);
        },
    };
}
module.exports = { mod: new DisableDiscardLimits() };
