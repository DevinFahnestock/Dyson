import planetNames from '../../resources/planet-names.json'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

const starterPlanets = [
  {
    id: null,
    imgsrc: "assets/planets/3064649268.gif",
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
  },
  {
    id: null,
    imgsrc: "assets/planets/3445279529.gif",
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
  },
  {
    id: null,
    imgsrc: "assets/planets/3847122958.gif",
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
  },
  {
    id: null,
    imgsrc: "assets/planets/1143784589.gif",
    name: null,
    level: 0,
    owner: null,
    created: null,
    upgrading: false,
    upgradeFinishedTime: null,
  },
]

dayjs.extend(utc)

const createNewUserStarterPlanets = async (admin, userUID) => {
  const batch = admin.firestore().batch()

  await starterPlanets.map(async (planet) => {
    const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc()

    const writeData = planet
    writeData.id = docref.id
    writeData.name = planetNames[Math.floor(Math.random()*planetNames.length)]
    writeData.owner = userUID
    writeData.created = dayjs().utc().toISOString()
    batch.set(docref, writeData)
  })

  await batch.commit()
  console.log("Starter Planet creation successful")
}

export default createNewUserStarterPlanets
