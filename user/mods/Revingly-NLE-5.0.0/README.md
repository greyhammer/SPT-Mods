# Never Lose Equipments

## Description:

This mod allows you to keep all your equipped items after your death. Nothing is removed. (Default Behavior)
Anything you pick up during the raid and put it inside your pocket, rig, backpack or container will stay if you die but they will lose the FIR status. (unless "enableFoundInRaid" is set to true)
You can insure your items and drop them during raid if you want to commit insurance fraud (drop ur stuff, get other stuff from raid and receive ur items later from insurance)

It also enables you to get all your initial items back after you died but not keep any items found in raid, if "restoreInitialKit" is true.
- if items in secured Container should be reset or kept as they were in raid can also be configured ("keepSecuredContainer")

## Work in progress:

 - Add possibility to configure whether you want to keep stuff you found during raid or not
    - For now this cover only the backpack but I'm working on adding the tactical vest as well as the pockets

 - Add option to recover the items from scav if you die


## Configurable values:

 - disableThisMod: true/false => as the name indicate, if you want to go full YOLO then set this value to true
 - restoreInitialKit: true/false => when you die you get back everything you had before entering the raid
 - keepSecuredContainer: true/false => Only matters when "restoreInitialKit" is true. When false your Secured Container also gets reset to its inital State. If true you keep all your items you put in the Secured Container during a raid. Warning can be abused for item duplicating if you put something you brought into raid into your secured Container and then die you have it in your inventory and the secured container.
 - enableFoundInRaid: true/false => If you really want to make things even easier, you can set the "enableFoundInRaid" to true to keep all the items you found during your raid as FIR after your death so you don't have to rat your way to the extract when you have that quest item. Has no affect when "restoreInitialKit" is true.