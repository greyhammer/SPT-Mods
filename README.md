# SPT-Mods


This is the current running master copy of OZR mods for Single Player Tarkov, designed to be used with SPT-AKI 3.6.1

To use these mods, you must already have Single Player Tarkov installed and updated to the latest version.

Install: 
1. Download the latest SPT-Mods.vX.X.zip from here https://github.com/greyhammer/SPT-Mods/releases
2. extract contents
3. copy `BepInEx` and `user` folders to the Single Player Tarkov directory
4. Launch Single Player Tarkov like normal
5. Profit?? 

Also, We made a script for launching the server and launcher in one click.
`SPT.bat`, which is included in the release zip archive.
```
E:
cd E:\SinglePlayerTarkov
start "" .\Aki.Server.exe
timeout 15
start "" .\Aki.Launcher.exe
exit
```
You will need to edit the file and adjust the first 2 lines to point to your Single Player Tarkov folder.  
In the example above, its in E:\SinglePlayerTarkov  
After editing and saving, you can just double click that `SPT.bat` file  
The server and launcher will start, after server window says happy playing, then refresh the launcher and it should connect.  

Current Mods
* [Amands's Graphics](https://hub.sp-tarkov.com/files/file/813-amands-s-graphics/) v1.5.2
* [BigBrain](https://hub.sp-tarkov.com/files/file/1219-bigbrain/) v0.2.0
* [Custom Interactions](https://hub.sp-tarkov.com/files/file/1278-custom-interactions) v1.2.0
* [EFT API](https://hub.sp-tarkov.com/files/file/1215-eft-api/) v1.1.6
* [GamePanelHUD](https://hub.sp-tarkov.com/files/file/652-game-panel-hud/) v2.7.5
* [Item Context Menu Extended](https://hub.sp-tarkov.com/files/file/1283-item-context-menu-extended) v1.1.0
* [Looting Bots](https://hub.sp-tarkov.com/files/file/1096-looting-bots/) v1.1.3
* [Never Lose Equipments]() v5.0.0
* [Realistic Flir Thermal Scope](https://hub.sp-tarkov.com/files/file/1201-realistic-flir-thermal-scope-60hz-320-240px-and-range/) v1.4.2
* [Realistic Reap-Ir Thermal Scope](https://hub.sp-tarkov.com/files/file/1302-realistic-reap-ir-thermal-scope-60hz-640-320px/) v1.0.2
* [SAIN 2.0](https://hub.sp-tarkov.com/files/file/1062-sain-2-0-solarint-s-ai-modifications-full-ai-combat-system-replacement/) Version 2.0 BETA 3.5.4 FOR SPT 3.6.1
* [Softcore](https://hub.sp-tarkov.com/files/file/998-softcore) v1.4.0
* [SPT Realism Mod](https://hub.sp-tarkov.com/files/file/606-spt-realism-mod/) v0.11.2
* [Swag + Donuts - Dynamic Spawn Waves And Custom Spawn Points](https://hub.sp-tarkov.com/files/file/878-swag-simple-wave-ai-generator/#tab_dbb2762a38dd640140e33993c19f0e5cd129c780) v3.1.4
* [TheBlacklist](https://hub.sp-tarkov.com/files/file/1012-the-blacklist-flea-market-enhancements) v1.3.0
* [Valens Has The Power](https://hub.sp-tarkov.com/files/file/613-valens-has-the-power) v1.2.1
* [Visceral Dismemberment](https://hub.sp-tarkov.com/files/file/1092-visceral-dismemberment/#tab_9a55fd25c7cb92ce0fe6aa067b18169b3daa3f7c) v1.1 (3.6.0)
* [Waypoints - Expanded Bot Patrols And Navmesh](https://hub.sp-tarkov.com/files/file/1119-waypoints-expanded-bot-patrols-and-navmesh/) v1.2.0

### Contributing
Please create feature branch, and increment VERSION according to https://semver.org/  
Update CHANGELONG with your changes  
Then create Pull Request from your feature branch to main branch   
After PR is approved it will trigger CI/CD pipeline and release generation  
