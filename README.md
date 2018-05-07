# Node-ArkSaveGameToolKit
This is Node.js library will require postgres 10+ to be setup prior to using the library when it is complete. Currently everything is being saved to memory when it's ran and it's not saving it all to postegres quite yet.

# Settings
Currently you have to edit lib/reader/arkCache.js#6 to where your ark is, this will be changed to a setting later on.

```
 fileName: "D:\\Steam\\steamapps\\common\\ARK\\ShooterGame\\Saved\\Saves\\TheIsland.ark", //Path to your ark
```

# Usage

Currently you can just run ``` node . ``` and it will run all it's reading functions and exit. The ``` save.loadEverything() ``` function is what returns all the data and will probably be setup to push to postgres via a different service at some point.

# Acknowledgements
This library is a rough port from tsebring's C# ArkSavegameToolkitNet (https://github.com/tsebring/ArkSavegameToolkitNet), which was ported from Qowyn's Java ark-savegame-toolkit (https://github.com/Qowyn/ark-savegame-toolkit).
