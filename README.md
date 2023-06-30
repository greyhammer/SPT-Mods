# SPT-Mods


This is the current running master copy of OZR mods for Single Player Tarkov

To use these mods, you must already have Single Player Tarkov installed and updated to the latest version.

Install: 
1. Download the latest SPT-Mods.vX.X.zip from here https://github.com/greyhammer/SPT-Mods/releases
2. extract contents
3. copy `BepInEx` and `user` folders to the Single Player Tarkov directory
4. Launch Single Player Tarkov like normal
5. Profit?? 

Also, We made a script for launching the server and launcher in one click.
`SPT.bat` - you will need to edit the file and adjust the first 2 lines to point to your Single Player Tarkov folder.
After editing and saving, you can just double click that `SPT.bat` file
The server and launcher will start, after server window says happy playing, then refresh the launcher and it should connect.

Current Mods
* TheBlacklist version: 1.1.0 by: Platinum
* NoDiscardLimit version: 1.0.0 by: Skwizzy
* SPT Realism Mod version: 0.8.72 by: Fontaine
* Simple Wave AI Generator (SWAG) version: 2.0.0 by: nooky
* Softcore version: 1.4.0 by: x-ODT
* SAIN version: 2.0.0 by: z-Solarint
* DrakiaXYZ-Waypoints version: 1.1.2 by: DrakiaXYZ
* GamePanelHUD by: kmyuhkyuk

### Contributing
Please create feature branch, and increment VERSION according to https://semver.org/
Update CHANGELONG with your changes
Then create Pull Request from your feature branch to main branch 
After PR is approved it will trigger CI/CD pipeline and release generation