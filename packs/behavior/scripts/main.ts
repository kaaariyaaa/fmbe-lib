import { world, system } from "@minecraft/server";
import { MinecraftDimensionTypes, MinecraftEntityTypes } from "@minecraft/vanilla-data";
import { FmbeManager, FmbeRenderTypes } from "./lib/fmbe/index.js";
const addonName = "fmbe-lib";
let init = false;

system.runInterval(() => {
  if (!init) {
    world.sendMessage(`[${addonName}] Initialized`);
    init = true;
  }
});

const fmbeManager = new FmbeManager();

// Sample: assign render data to nearby foxes (auto loop runs in the library).
system.runInterval(() => {
  const overworld = world.getDimension(MinecraftDimensionTypes.Overworld);
  const foxes = overworld.getEntities({ type: MinecraftEntityTypes.Fox });

  for (const fox of foxes) {
    const existing = fmbeManager.getRenderData(fox);
    if (existing?.enabled) continue;

    fmbeManager.setRenderData(fox, {
      type: FmbeRenderTypes.Item,
      variables: {
        xpos: 0,
        ypos: 0,
        zpos: 0,
        xrot: 0,
        yrot: 0,
        zrot: 0,
        scale: 1,
        extendScale: 1,
        extendXrot: -90,
        extendYrot: 0,
        xbasepos: 0,
        ybasepos: 0,
        zbasepos: 0,
      },
      enabled: true,
    });
  }
}, 40);
