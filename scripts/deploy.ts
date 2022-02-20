import hre, { ethers } from 'hardhat'

async function main() {
  const RARITY_EXTENDED_FARM_CORE = '0xEDb761eDE0Fc6f722cb544a6148BE4ccFd6D3a88'
  const MURDERFARM_CASHBOX = '0xbC8Ac3F5b4e116B6D71c2EdA677F6EeDE57d41D5'

  const RARITY_EXTENDED_COPPER_ORE = '0x80200b05D353a7df9e0053fd33C46765BE57AE7d'
  const RARITY_EXTENDED_IRON_ORE = '0x734Eb586D5cCB690E238f0926fA802B2C51036d3'
  const RARITY_EXTENDED_GOLD_ORE = '0x1eaf946DE3DF00BE8A3cEB152B191b334f0Dabba'
  const RARITY_EXTENDED_PLATINUM_ORE = '0xEF2679A075B52A32fb421134C5A614E58eD9325d'
  const RARITY_EXTENDED_MITHRIL_ORE = '0x9a59DC0577ADFa376999CC3930895444e6233456'

  const FARMING_CORE = await ethers.getContractAt('rarity_extended_farming_core', RARITY_EXTENDED_FARM_CORE)
  console.log('FARMING_CORE', FARMING_CORE.address)
  console.log('FARMING_CORE.NAME()', await FARMING_CORE.NAME())

  const LOOT = await ethers.getContractFactory('Loot')
  const PREMIUM_FARM = await ethers.getContractFactory('rarity_extended_farming_base_premium')

  const COLD_IRON = await LOOT.deploy('Cold Iron Ore', 'Cold Iron Ore (Loot)')
  await COLD_IRON.deployed()
  console.log('COLD_IRON deployed', COLD_IRON.address)

  const COLD_IRON_FARM = await PREMIUM_FARM.deploy(
    MURDERFARM_CASHBOX, 
    ethers.utils.parseEther("17"),
    RARITY_EXTENDED_FARM_CORE, 
    COLD_IRON.address, 
    2, // farm type, 2 = mining
    3, // required farming level
    "Rarity Cold Iron Ore",
    [RARITY_EXTENDED_COPPER_ORE, RARITY_EXTENDED_IRON_ORE, RARITY_EXTENDED_GOLD_ORE], 
    [6, 18, 72]
  )
  await COLD_IRON_FARM.deployed()
  console.log('COLD_IRON_FARM deployed', COLD_IRON_FARM.address)

  await COLD_IRON.setMinter(COLD_IRON_FARM.address)
  console.log('COLD_IRON_FARM set to mint COLD_IRON')

  const ADAMANTINE = await LOOT.deploy('Adamantine Ore', 'Adamantine Ore (Loot)')
  await ADAMANTINE.deployed()
  console.log('ADAMANTINE deployed', ADAMANTINE.address)

  const ADAMANTINE_FARM = await PREMIUM_FARM.deploy(
    MURDERFARM_CASHBOX, 
    ethers.utils.parseEther("30"),
    RARITY_EXTENDED_FARM_CORE, 
    ADAMANTINE.address, 
    2, // farm type, 2 = mining
    5, // required farming level
    "Rarity Adamantine Ore",
    [RARITY_EXTENDED_COPPER_ORE, RARITY_EXTENDED_IRON_ORE, RARITY_EXTENDED_GOLD_ORE, COLD_IRON.address, RARITY_EXTENDED_MITHRIL_ORE], 
    [6, 18, 36, 180, 90]
  )
  await ADAMANTINE_FARM.deployed()
  console.log('ADAMANTINE_FARM deployed', ADAMANTINE_FARM.address)

  await(await (ADAMANTINE.setMinter(ADAMANTINE_FARM.address))).wait(2)
  console.log('ADAMANTINE_FARM set to mint ADAMANTINE')

  await hre.run("verify:verify", {
    address: COLD_IRON.address,
    constructorArguments: ['Cold Iron Ore', 'Cold Iron Ore (Loot)'],
  });

  await hre.run("verify:verify", {
    address: COLD_IRON_FARM.address,
    constructorArguments: [
      MURDERFARM_CASHBOX, 
      ethers.utils.parseEther("17"),
      RARITY_EXTENDED_FARM_CORE, 
      COLD_IRON.address, 
      2, // farm type, 2 = mining
      3, // required farming level
      "Rarity Cold Iron Ore",
      [RARITY_EXTENDED_COPPER_ORE, RARITY_EXTENDED_IRON_ORE, RARITY_EXTENDED_GOLD_ORE], 
      [6, 18, 72]
    ],
  });

  await hre.run("verify:verify", {
    address: ADAMANTINE.address,
    constructorArguments: ['Adamantine Ore', 'Adamantine Ore (Loot)'],
  });

  await hre.run("verify:verify", {
    address: ADAMANTINE_FARM.address,
    constructorArguments: [
      MURDERFARM_CASHBOX, 
      ethers.utils.parseEther("30"),
      RARITY_EXTENDED_FARM_CORE, 
      ADAMANTINE.address, 
      2, // farm type, 2 = mining
      5, // required farming level
      "Rarity Adamantine Ore",
      [RARITY_EXTENDED_COPPER_ORE, RARITY_EXTENDED_IRON_ORE, RARITY_EXTENDED_GOLD_ORE, COLD_IRON.address, RARITY_EXTENDED_MITHRIL_ORE], 
      [6, 18, 36, 180, 90]
    ],
  });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
