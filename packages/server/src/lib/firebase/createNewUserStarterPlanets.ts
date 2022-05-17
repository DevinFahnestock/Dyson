import planetNames from "../../resources/planet-names.json"
import utc from "dayjs/plugin/utc"
import dayjs from "dayjs"

import { PlanetType } from "../../lib/shared"

const starterPlanets = [
  {
    id: null,
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
    type: PlanetType.Lava,
    seed: 8,
  },
  {
    id: null,
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
    type: PlanetType.NoAtmosphere,
    seed: 8,
  },
  {
    id: null,
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
    type: PlanetType.Wet,
    seed: 8,
  },
  {
    id: null,
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
    type: PlanetType.Lava,
    seed: 8,
  },
]

dayjs.extend(utc)

const createNewUserStarterPlanets = async (admin, userUID) => {
  const batch = admin.firestore().batch()

  await starterPlanets.map(async (planet) => {
    const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc()

    const writeData = planet
    writeData.id = docref.id
    writeData.name = planetNames[Math.floor(Math.random() * planetNames.length)]
    writeData.owner = userUID
    writeData.created = dayjs().utc().toISOString()
    batch.set(docref, writeData)
  })

  await batch.commit()
  console.log("Starter Planet creation successful")
}

export default createNewUserStarterPlanets
