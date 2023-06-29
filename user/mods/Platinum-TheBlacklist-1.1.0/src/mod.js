"use strict";
// Copyright (C) 2023 Platinum
// 
// This file is part of spt-the-blacklist.
// 
// spt-the-blacklist is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// spt-the-blacklist is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with spt-the-blacklist.  If not, see <http://www.gnu.org/licenses/>.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const config_json_1 = __importDefault(require("../config.json"));
const advancedConfig_json_1 = __importDefault(require("../advancedConfig.json"));
class TheBlacklistMod {
    constructor() {
        this.modName = "[The Blacklist]";
        // Store the category IDs of all attachments in the handbook so we don't have to manually enter them in json
        this.attachmentCategoryIds = [];
    }
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        // Easiest way to make mod compatible with Lua's flea updater is let the user choose when to load the mod...
        setTimeout(() => this.initialiseMod(container), (advancedConfig_json_1.default.startDelayInSeconds || 7) * 1000);
    }
    initialiseMod(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const configServer = container.resolve("ConfigServer");
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        const ragfairPriceService = container.resolve("RagfairPriceService");
        const ragfairOfferGenerator = container.resolve("RagfairOfferGenerator");
        const itemTable = tables.templates.items;
        const handbookItems = tables.templates.handbook.Items;
        const prices = tables.templates.prices;
        ragfairConfig.dynamic.blacklist.enableBsgList = !config_json_1.default.disableBsgBlacklist;
        this.baselineBullet = itemTable[advancedConfig_json_1.default.baselineBulletId];
        this.baselineArmour = itemTable[advancedConfig_json_1.default.baselineArmourId];
        let blacklistedItemsCount = 0;
        let attachmentPriceLimitedCount = 0;
        if (config_json_1.default.limitMaxPriceOfAttachments) {
            this.initialiseAttachmentCategoryIds(tables.templates.handbook.Categories);
        }
        // Find all items to update by looping through handbook which is a better indicator of useable items.
        handbookItems.forEach(handbookItem => {
            const item = itemTable[handbookItem.Id];
            const customItemConfig = config_json_1.default.customItemConfigs.find(conf => conf.itemId === item._id);
            const originalPrice = prices[item._id];
            // We found a custom price override to use. That's all we care about for this item. Move on to the next item.
            if (customItemConfig?.fleaPriceOverride) {
                prices[item._id] = customItemConfig.fleaPriceOverride;
                this.debug(`Updated ${item._id} - ${item._name} flea price from ${originalPrice} to ${prices[item._id]} (price override).`);
                blacklistedItemsCount++;
                return;
            }
            if (config_json_1.default.limitMaxPriceOfAttachments && this.attachmentCategoryIds.includes(handbookItem.ParentId)) {
                const handbookPrice = handbookItem.Price;
                const existingFleaPrice = prices[item._id];
                const maxFleaPrice = handbookPrice * config_json_1.default.maxFleaPriceOfAttachmentsToHandbookPrice;
                if (existingFleaPrice > maxFleaPrice) {
                    prices[item._id] = maxFleaPrice;
                    attachmentPriceLimitedCount++;
                    this.debug(`Attachment ${item._id} - ${item._name} was updated from ${existingFleaPrice} to ${maxFleaPrice}.`);
                }
            }
            const itemProps = item._props;
            if (!itemProps.CanSellOnRagfair) {
                // Some blacklisted items are hard to balance or just shouldn't be allowed so we will keep them blacklisted.
                if (advancedConfig_json_1.default.excludedCategories.some(category => category === handbookItem.ParentId)) {
                    ragfairConfig.dynamic.blacklist.custom.push(item._id);
                    this.debug(`Blacklisted item ${item._id} - ${item._name} because we are excluding handbook category ${handbookItem.ParentId}.`);
                    return;
                }
                itemProps.CanSellOnRagfair = config_json_1.default.disableBsgBlacklist;
                prices[item._id] = this.getUpdatedPrice(item, prices);
                if (!prices[item._id]) {
                    this.debug(`There are no flea prices for ${item._id} - ${item._name}!`);
                    return;
                }
                this.debug(`Updated ${item._id} - ${item._name} flea price from ${originalPrice} to ${prices[item._id]}.`);
                blacklistedItemsCount++;
            }
            const itemSpecificPriceMultiplier = customItemConfig?.priceMultiplier || 1;
            prices[item._id] *= itemSpecificPriceMultiplier;
        });
        // Typescript hack to call protected method
        ragfairPriceService.generateDynamicPrices();
        ragfairOfferGenerator.generateDynamicOffers().then(() => {
            this.logger.success(`${this.modName}: Success! Found ${blacklistedItemsCount} blacklisted items to update.`);
            this.logger.success(`${this.modName}: config.limitMaxPriceOfAttachments is enabled! Updated ${attachmentPriceLimitedCount} flea prices of attachments.`);
        });
    }
    initialiseAttachmentCategoryIds(handbookCategories) {
        const weaponPartsAndModsId = "5b5f71a686f77447ed5636ab";
        const weaponPartsChildrenCategories = this.getChildCategoriesRecursively(handbookCategories, weaponPartsAndModsId);
        const childrenIds = weaponPartsChildrenCategories.map(category => category.Id);
        this.attachmentCategoryIds.push(weaponPartsAndModsId);
        this.attachmentCategoryIds = this.attachmentCategoryIds.concat(childrenIds);
    }
    getChildCategoriesRecursively(handbookCategories, parentId) {
        const childCategories = handbookCategories.filter(category => category.ParentId === parentId);
        const grandChildrenCategories = childCategories.reduce((memo, category) => memo.concat(this.getChildCategoriesRecursively(handbookCategories, category.Id)), []);
        return childCategories.concat(grandChildrenCategories);
    }
    getUpdatedPrice(item, prices) {
        // Note that this price can be affected by other mods like Lua's market updater.
        const currentFleaPrice = prices[item._id];
        let newPrice;
        if (item._props.ammoType === "bullet") {
            newPrice = this.getUpdatedAmmoPrice(item);
        }
        else if (Number(item._props.armorClass) > 0 && item._props.armorZone?.some(zone => zone === "Chest")) {
            newPrice = this.getUpdatedArmourPrice(item);
        }
        // Avoids NaN. Also we shouldn't have any prices of 0.
        const price = newPrice || currentFleaPrice;
        return price && price * config_json_1.default.blacklistedItemPriceMultiplier;
    }
    getUpdatedAmmoPrice(item) {
        const baselinePen = this.baselineBullet._props.PenetrationPower;
        const baselineDamage = this.baselineBullet._props.Damage;
        const penetrationMultiplier = item._props.PenetrationPower / baselinePen;
        const baseDamageMultiplier = item._props.Damage / baselineDamage;
        // Reduces the effect of the damage multiplier so high DMG rounds aren't super expensive.
        // Eg. let baseDamageMultiplier = 2 & bulletDamageMultiplierRedutionFactor = 0.7. Instead of a 2x price when a bullet is 2x damage, we instead get:
        // 2 + (1 - 2) * 0.7 = 2 - 0.7 = 1.3x the price.
        const damageMultiplier = baseDamageMultiplier + (1 - baseDamageMultiplier) * advancedConfig_json_1.default.bulletDamageMultiplierRedutionFactor;
        return advancedConfig_json_1.default.baselineBulletPrice * penetrationMultiplier * damageMultiplier * config_json_1.default.blacklistedAmmoAdditionalPriceMultiplier;
    }
    // Some default armour prices are too high like the Zabralo so I want a more balanced way to calculate the price.
    getUpdatedArmourPrice(item) {
        const baselineArmourClass = Number(this.baselineArmour._props.armorClass);
        // Instead of doing a simple multiplier by dividing the two armour classes, this will give us a much bigger price range for different tiered armours.
        const armourClassCost = (Number(item._props.armorClass) - baselineArmourClass) * advancedConfig_json_1.default.pricePerArmourClassStep;
        const baseArmourWeightMultiplier = advancedConfig_json_1.default.baselineArmourWeight / item._props.Weight;
        // Reduces the effect of the weight multiplier so some lighter armour aren't super expensive.
        // Eg. let baseArmourWeightMultiplier = 2 & armourWeightMultiplierReductionFactor = 0.7. Instead of a 2x price when an armour is half as light as the baseline, we instead get:
        // 2 + (1 - 2) * 0.7 = 2 - 0.7 = 1.3x the price.
        const armourWeightMultiplier = baseArmourWeightMultiplier + (1 - baseArmourWeightMultiplier) * advancedConfig_json_1.default.armourWeightMultiplierReductionFactor;
        return (advancedConfig_json_1.default.baselineArmourPrice + armourClassCost) * armourWeightMultiplier * config_json_1.default.blacklistedArmourAdditionalPriceMultiplier;
    }
    debug(message) {
        if (advancedConfig_json_1.default.enableDebug) {
            this.logger.debug(`${this.modName}: ${message}`);
        }
    }
}
module.exports = { mod: new TheBlacklistMod() };
