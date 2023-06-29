"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAmountProper = exports.validMaps = exports.pmcType = exports.diffProper = exports.reverseMapNames = exports.roleCase = exports.roles = exports.Props = exports.Center = exports.ColliderParams = exports.Position = exports.SpawnPointParam = exports.MapWrapper = exports.GroupPattern = exports.Bot = exports.GlobalRandomWaveTimer = void 0;
class GlobalRandomWaveTimer {
}
exports.GlobalRandomWaveTimer = GlobalRandomWaveTimer;
class Bot {
}
exports.Bot = Bot;
class GroupPattern {
}
exports.GroupPattern = GroupPattern;
class MapWrapper {
}
exports.MapWrapper = MapWrapper;
class SpawnPointParam {
}
exports.SpawnPointParam = SpawnPointParam;
class Position {
}
exports.Position = Position;
class ColliderParams {
}
exports.ColliderParams = ColliderParams;
class Center {
}
exports.Center = Center;
class Props {
}
exports.Props = Props;
exports.roles = [
    "assault",
    "exusec",
    "marksman",
    "pmcbot",
    "sectantpriest",
    "sectantwarrior",
    "assaultgroup",
    "bossbully",
    "bosstagilla",
    "bossgluhar",
    "bosskilla",
    "bosskojaniy",
    "bosssanitar",
    "followerbully",
    "followergluharassault",
    "followergluharscout",
    "followergluharsecurity",
    "followergluharsnipe",
    "followerkojaniy",
    "followersanitar",
    "followertagilla",
    "cursedassault",
    "pmc",
    "usec",
    "bear",
    "sptbear",
    "sptusec",
    "bosstest",
    "followertest",
    "gifter",
    "bossknight",
    "followerbigpipe",
    "followerbirdeye",
    "bosszryachiy",
    "followerzryachiy",
];
exports.roleCase = {
    assault: "assault",
    exusec: "exUsec",
    marksman: "marksman",
    pmcbot: "pmcBot",
    sectantpriest: "sectantPriest",
    sectantwarrior: "sectantWarrior",
    assaultgroup: "assaultGroup",
    bossbully: "bossBully",
    bosstagilla: "bossTagilla",
    bossgluhar: "bossGluhar",
    bosskilla: "bossKilla",
    bosskojaniy: "bossKojaniy",
    bosssanitar: "bossSanitar",
    followerbully: "followerBully",
    followergluharassault: "followerGluharAssault",
    followergluharscout: "followerGluharScout",
    followergluharsecurity: "followerGluharSecurity",
    followergluharsnipe: "followerGluharSnipe",
    followerkojaniy: "followerKojaniy",
    followersanitar: "followerSanitar",
    followertagilla: "followerTagilla",
    cursedassault: "cursedAssault",
    pmc: "pmc",
    usec: "usec",
    bear: "bear",
    sptbear: "sptBear",
    sptusec: "sptUsec",
    bosstest: "bossTest",
    followertest: "followerTest",
    gifter: "gifter",
    bossknight: "bossKnight",
    followerbigpipe: "followerBigPipe",
    followerbirdeye: "followerBirdEye",
    bosszryachiy: "bossZryachiy",
    followerzryachiy: "followerZryachiy",
    bloodhound: "arenaFighterEvent"
};
exports.reverseMapNames = {
    factory4_day: "factory",
    factory4_night: "factory_night",
    bigmap: "customs",
    woods: "woods",
    shoreline: "shoreline",
    lighthouse: "lighthouse",
    rezervbase: "reserve",
    interchange: "interchange",
    laboratory: "laboratory",
    tarkovstreets: "streets"
};
exports.diffProper = {
    easy: "easy",
    asonline: "normal",
    normal: "normal",
    hard: "hard",
    impossible: "impossible",
    random: "random",
};
exports.pmcType = ["sptbear", "sptusec"];
exports.validMaps = [
    "bigmap",
    "factory4_day",
    "factory4_night",
    "interchange",
    "laboratory",
    "lighthouse",
    "rezervbase",
    "shoreline",
    "tarkovstreets",
    "woods",
];
exports.aiAmountProper = {
    low: 0.5,
    asonline: 1,
    medium: 1,
    high: 2,
    horde: 4,
};
