// monsters.js

 const MONSTERS = {
  mosq: { name: "Black Mosquito", hp: 12, maxHp: 12, str: 5, def: 2, xp: 20, gold: 3, img: "mosq.png", lootTable: [{name:"tiny Wing", value: 3, icon:"🪽", type:"junk"}] },
  slime: { name: "Blue Slime", hp: 45, maxHp: 45, str: 7, def: 3, xp: 35, gold: 5, img: "slime.png", lootTable: [{name:"iron Core", heal:15, value: 10, icon:"🔮", type:"food"}] },
  torquen: { name: "Blue torque", hp: 145, maxHp: 145, str: 7, def: 3, xp: 35, gold: 5, img: "torquen.png", lootTable: [{name:"healing wing", heal:115, value: 10, icon:"🪽", type:"food"}] },
  dragonleach_lhead: { name: "LeachLHead", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_head.png", lootTable: [{name:"Silver Helmet", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 225, icon: "🪖"}] },
  dragonleach_rhead: { name: "LeachRHead", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_head.png", lootTable: [{name:"Bronze Helmet", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 225, icon: "🪖"}] },
  dragonleach_body1: { name: "Body1", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_body.png", lootTable: [{name:"Silver bracers", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 125, icon: "🪖"}] },
  dragonleach_body2: { name: "Body2", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_body.png", lootTable: [{name:"Silver boots", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 125, icon: "🪖"}] },
  dragonleach_body3: { name: "Body3", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_body.png", lootTable: [{name:"Silver gloves", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 125, icon: "🪖"}] },
  dragonleach_body4: { name: "Body4", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_body.png", lootTable: [{name:"Silver cape", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 125, icon: "🪖"}] },
  dragonleach_bone:  { name: "xtreme bone", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_bone.png", lootTable: [{name:"Silver necklace", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 125, icon: "🪖"}] },
  dragonleach_tail:  { name: "Leachtail", hp: 100, maxHp: 100, str: 25, def: 9, xp: 200, gold: 45, img: "leach_tail.png", lootTable: [{name:"Silver bracelet", type: "armor", dice: 3, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", value: 125, icon: "🪖"}] },
  dweables: { name: "tiny dweables", hp: 4, maxHp: 4, str: 7, def: 3, xp: 35, gold: 115, img: "dweables.png", lootTable: [{name:"gold socks", heal:115, value: 10, icon:"🥇", type:"food"}] },
  bugmug: { name: "dark beetle", hp: 12, maxHp: 12, str: 5, def: 2, xp: 20, gold: 3, img: "bugmug.png", lootTable: [{name:"antenna", value: 3, icon:"🪽", type:"junk"}] },
  flame: { name: "red ball", hp: 45, maxHp: 45, str: 7, def: 3, xp: 35, gold: 5, img: "flame.png", lootTable: [{name:"ash", heal:15, value: 10, icon:"🔮", type:"food"}] },
  "red eagle": { name: "drack ", hp: 112, maxHp: 112, str: 15, def: 2, xp: 220, gold: 113, img: "redeagle.png", lootTable: [{name:"High Wing", value: 3, icon:"🪽", type:"junk"}] },
  termi: { name: "colonial robot", hp: 445, maxHp: 445, str: 17, def: 13, xp: 535, gold: 555, img: "termi.png", lootTable: [{name:"Atom Core", heal:215, value: 10, icon:"🔮", type:"food"}] },
  alpha_ant: { name: "Alpha Ant", hp: 60, maxHp: 60, str: 13, def: 10, xp: 60, gold: 35, img: "alpha_ant.png", customDrop: { type: "weapon", name: "Ant Pincer", dice: 8, wpnStr: 0, wpnDef: 0, armStr: 0, armDef: 0, value: 2, icon: "🔪", chance: 0.99 }, lootTable: [{ name: "Ant Mandible", value: 5, icon: "🦷", type:"junk" }] },
  guardian: { name: "Arundo Guardian", hp: 180, maxHp: 180, str: 26, def: 20, xp: 200, gold: 150, img: "guardian.png", lootTable: [{ name: "Giant Reed", value: 15, icon: "🎋", type:"junk" }] }
};