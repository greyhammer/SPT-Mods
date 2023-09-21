"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAmountProper = exports.validMaps = exports.pmcType = exports.diffProper = exports.reverseMapNames = exports.reverseBossNames = exports.roleCase = exports.Props = exports.Center = exports.ColliderParams = exports.Position = exports.SpawnPointParam = exports.MapWrapper = exports.GroupPattern = exports.Bot = void 0;
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
    bloodhound: "arenaFighterEvent",
    crazyscavs: "crazyAssaultEvent"
};
exports.reverseBossNames = {
    bossbully: "reshala",
    bosstagilla: "tagilla",
    bossgluhar: "glukhar",
    bosskilla: "killa",
    bosskojaniy: "shturman",
    bosssanitar: "sanitar",
    bossknight: "goons",
    bosszryachiy: "zryachiy",
    marksman: "snipers",
    sectantpriest: "cultists",
    exusec: "rogues",
    crazyassaultevent: "crazyscavs",
    arenafighterevent: "bloodhounds"
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
