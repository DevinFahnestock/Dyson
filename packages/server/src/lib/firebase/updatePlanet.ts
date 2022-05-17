import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

import upgradeTimes from '../../resources/upgrade-times.json'

dayjs.extend(utc)

const updatePlanet = async (admin, planetID, userUID) => {
  const planetRefString = planetID.toString()
  const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc(planetRefString)

  const result = await docref.get()
  const planetData = result.data()


  if (!planetData.owner === userUID) {
    console.log("User doesnt own the planet they are trying to update")
    return
  }

  const batch = admin.firestore().batch()
  
  if (planetData.upgrading) return planetData

  const timed = upgradeTimes[planetData.level].split(':')

  planetData.upgrading = true
  planetData.upgradeFinishedTime = dayjs.utc()
  .add(parseInt(timed[0]), 'hour')
  .add(parseInt(timed[1]), 'minute')
  .add(parseInt(timed[2]), 'second')
  .toISOString()

  batch.set(docref, planetData)

  await batch.commit()
  return planetData
}

export default updatePlanet
