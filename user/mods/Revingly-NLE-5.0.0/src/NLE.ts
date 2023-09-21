import { InraidController } from "@spt-aki/controllers/InraidController";
import { PlayerScavGenerator } from "@spt-aki/generators/PlayerScavGenerator";
import { HealthHelper } from "@spt-aki/helpers/HealthHelper";
import { InRaidHelper } from "@spt-aki/helpers/InRaidHelper";
import { ItemHelper } from "@spt-aki/helpers/ItemHelper";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { QuestHelper } from "@spt-aki/helpers/QuestHelper";
import { TraderHelper } from "@spt-aki/helpers/TraderHelper";
import { ILocationBase } from "@spt-aki/models/eft/common/ILocationBase";
import { IPmcData } from "@spt-aki/models/eft/common/IPmcData";
import { ISaveProgressRequestData } from "@spt-aki/models/eft/inRaid/ISaveProgressRequestData";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { IAirdropConfig } from "@spt-aki/models/spt/config/IAirdropConfig";
import { IInRaidConfig } from "@spt-aki/models/spt/config/IInRaidConfig";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { SaveServer } from "@spt-aki/servers/SaveServer";
import { InsuranceService } from "@spt-aki/services/InsuranceService";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { TimeUtil } from "@spt-aki/utils/TimeUtil";
import { inject, injectable } from "tsyringe";

// local import
import { ApplicationContext } from "@spt-aki/context/ApplicationContext";
import { InventoryHelper } from "@spt-aki/helpers/InventoryHelper";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { MatchBotDetailsCacheService } from "@spt-aki/services/MatchBotDetailsCacheService";
import { PmcChatResponseService } from "@spt-aki/services/PmcChatResponseService";
import * as config from "../config/config.json";

import { VFS } from "@spt-aki/utils/VFS";

@injectable()
export class NLE extends InraidController 
{
    protected airdropConfig: IAirdropConfig;
    protected inraidConfig: IInRaidConfig;

    // We need to make sure we use the constructor and pass the dependencies to the parent class!
    constructor(
        @inject("WinstonLogger") protected logger: ILogger,
        @inject("SaveServer") protected saveServer: SaveServer,
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("DatabaseServer") protected databaseServer: DatabaseServer,
        @inject("PmcChatResponseService") protected pmcChatResponseService: PmcChatResponseService,
        @inject("MatchBotDetailsCacheService") protected matchBotDetailsCacheService: MatchBotDetailsCacheService,
        @inject("QuestHelper") protected questHelper: QuestHelper,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("PlayerScavGenerator") protected playerScavGenerator: PlayerScavGenerator,
        @inject("HealthHelper") protected healthHelper: HealthHelper,
        @inject("TraderHelper") protected traderHelper: TraderHelper,
        @inject("InsuranceService") protected insuranceService: InsuranceService,
        @inject("InRaidHelper") protected inRaidHelper: InRaidHelper,
        @inject("ApplicationContext") protected applicationContext: ApplicationContext,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("InventoryHelper") protected inventoryHelper: InventoryHelper,
        @inject("VFS") protected vfs: VFS
    ) 
    {
        super(logger, 
            saveServer, 
            jsonUtil, 
            timeUtil, 
            databaseServer, 
            pmcChatResponseService, matchBotDetailsCacheService, questHelper, itemHelper, 
            profileHelper, playerScavGenerator, healthHelper, 
            traderHelper, insuranceService, inRaidHelper, applicationContext, configServer);
        this.airdropConfig = this.configServer.getConfig(ConfigTypes.AIRDROP);
        this.inraidConfig = this.configServer.getConfig(ConfigTypes.IN_RAID);
    }

    public override savePostRaidProgress(offraidData: ISaveProgressRequestData, sessionID: string): void 
    {
        this.logger.info("NLE active");
        if (!this.inraidConfig.save.loot) 
        {
            return;
        }

        if (offraidData.isPlayerScav) 
        {
            this.savePlayerScavProgress(sessionID, offraidData);
        }
        else 
        {
            this.savePmcProgress(sessionID, offraidData);
        }
    }

    /**
     * Handle updating the profile post-pmc raid
     * @param sessionID session id
     * @param offraidData post-raid data of raid
     */
    protected savePmcProgress(sessionID: string, offraidData: ISaveProgressRequestData): void 
    {
        const currentProfile = this.saveServer.getProfile(sessionID);
        const locationName = currentProfile.inraid.location.toLowerCase();

        const map: ILocationBase = this.databaseServer.getTables().locations[locationName].base;
        var insuranceEnabled = map.Insurance;
        let pmcData = currentProfile.characters.pmc;
        const isDead = this.isPlayerDead(offraidData.exit);
        const preRaidGear = this.inRaidHelper.getPlayerGear(pmcData.Inventory.items);

        currentProfile.inraid.character = "pmc";

        pmcData = this.inRaidHelper.updateProfileBaseStats(pmcData, offraidData, sessionID);

        // Check for exit status
        this.markOrRemoveFoundInRaidItems(offraidData, pmcData, false);

        offraidData.profile.Inventory.items = this.itemHelper.replaceIDs(offraidData.profile, offraidData.profile.Inventory.items, pmcData.InsuredItems, offraidData.profile.Inventory.fastPanel);
        this.inRaidHelper.addUpdToMoneyFromRaid(offraidData.profile.Inventory.items);
    
        // skips overwriting the new inventory if restoreInitialKit is enabled and player is dead
        // if true disables Insurance
        if (config.restoreInitialKit && isDead) {
            this.logger.log("PMC DIED!!!", "red", "white");
            this.logger.log("RESTORING INITIAL EQUIPPMENT!!!", "red", "white");
            insuranceEnabled = false;
        } else {
            pmcData = this.inRaidHelper.setInventory(sessionID, pmcData, offraidData.profile);
        }
        
        this.healthHelper.saveVitality(pmcData, offraidData.health, sessionID);

        if (insuranceEnabled)
        {
            this.insuranceService.storeLostGear(pmcData, offraidData, preRaidGear, sessionID, isDead);
        }
        else
        {
            if (locationName.toLowerCase() === "laboratory")
            {
                this.insuranceService.sendLostInsuranceMessage(sessionID);
            }
        }

        if (isDead)
        {
            this.pmcChatResponseService.sendKillerResponse(sessionID, pmcData, offraidData.profile.Stats.Aggressor);
            this.matchBotDetailsCacheService.clearCache();

            pmcData = this.performPostRaidActionsWhenDead(offraidData, pmcData, insuranceEnabled, preRaidGear, sessionID);
        }

        const victims = offraidData.profile.Stats.Victims.filter(x => x.Role === "sptBear" || x.Role === "sptUsec");
        if (victims?.length > 0)
        {
            this.pmcChatResponseService.sendVictimResponse(sessionID, victims, pmcData);
        }

        if (insuranceEnabled)
        {
            this.insuranceService.sendInsuredItems(pmcData, sessionID, map.Id);
        }
    }

    protected filterItemsByParentIdRecursive(items: Item[], parentId: String): Item[] {
        const filteredItems = [];
        const stack = [...items]; // Use a stack to keep track of items to process

        while (stack.length > 0) {
            const currentItem = stack.pop();

            if (currentItem.parentId === parentId) {
                filteredItems.push(currentItem);
                const res = this.filterItemsByParentIdRecursive(items, currentItem._id);
                for (const item of res) {
                    filteredItems.push(item);
                }
            }
        }

        return filteredItems;
    }

    protected markOrRemoveFoundInRaidItems(offraidData: ISaveProgressRequestData, pmcData: IPmcData, isPlayerScav: boolean): void 
    {
        if (offraidData.exit.toLowerCase() === "survived" || config.enableFoundInRaid) 
        {
            // Mark found items and replace item ID's if the player survived
            offraidData.profile = this.inRaidHelper.addSpawnedInSessionPropertyToItems(pmcData, offraidData.profile, isPlayerScav);
        }
        else 
        {
            // Remove FIR status if the player havn't survived
            offraidData.profile = this.inRaidHelper.removeSpawnedInSessionPropertyFromItems(offraidData.profile);
        }
    }

    protected performPostRaidActionsWhenDead(postRaidSaveRequest: ISaveProgressRequestData, pmcData: IPmcData, insuranceEnabled: boolean, preRaidGear: Item[], sessionID: string): IPmcData 
    {
        this.updatePmcHealthPostRaid(postRaidSaveRequest, pmcData);

        if (config.restoreInitialKit && config.keepSecuredContainer) {
            this.logger.log("KEEPING SECURED CONTAINER!!!", "red", "white");
            this.keepSecuredContainer(postRaidSaveRequest.profile.Inventory.items, pmcData, sessionID);
        }

        if (this.inRaidHelper.removeQuestItemsOnDeath())
        {
            for (const questItem of postRaidSaveRequest.profile.Stats.CarriedQuestItems)
            {
                const findItemConditionIds = this.questHelper.getFindItemIdForQuestHandIn(questItem);
                this.profileHelper.resetProfileQuestCondition(sessionID, findItemConditionIds);
            }

            pmcData.Stats.CarriedQuestItems = [];
        }

        return pmcData;
    }

    // Keeps the secured Container from the raid and replaces initial one
    private keepSecuredContainer(offRaidItems: Item[], pmcData: IPmcData, sessionID: string): void {

        const raidSecuredContainer = offRaidItems.find(item => item.slotId === "SecuredContainer");
        const raidSecuredItems = this.filterItemsByParentIdRecursive(offRaidItems, raidSecuredContainer._id);
                
        const initialSecuredContainer = pmcData.Inventory.items.find(item => item.slotId === "SecuredContainer");
        const initialSecuredItems = this.filterItemsByParentIdRecursive(pmcData.Inventory.items, initialSecuredContainer._id);

        // removes the old items in the secured Container
        for (const item of initialSecuredItems) {
            this.inventoryHelper.removeItem(pmcData, item._id, sessionID);
        }

        // Replace the old parentId with the new ParentId with the inital ParentId of the Secure Container
        const res = this.replaceParentId(raidSecuredItems, raidSecuredContainer._id, initialSecuredContainer._id);

        // Add secured items from raid to current inventory
        pmcData.Inventory.items = [...pmcData.Inventory.items, ...res];
    }

    private replaceParentId(items: Item[], oldParentId: string, newParentId: string): Item[] {
        var stack = [...items];

        stack.forEach(item => {
            if (item.parentId === oldParentId) {
                item.parentId = newParentId;
            }
        });

        return stack;
    }
}