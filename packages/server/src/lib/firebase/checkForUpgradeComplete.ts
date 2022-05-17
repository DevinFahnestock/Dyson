import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import dayjs from "dayjs"

dayjs.extend(duration)
dayjs.extend(utc)

const checkForUpgradeComplete = async (admin, planetID) => {
  const planetRefString = planetID.toString()
  const docref = await admin.firestore().collection("admin").doc("gameData").collection("planetData").doc(planetRefString)
  const result = await docref.get()
  const planetData = result.data()

  
  if (planetData.upgrading) {
    const upgradeFinishedTime = dayjs.utc(planetData.upgradeFinishedTime)
    const durationLeft = dayjs.duration(upgradeFinishedTime.diff(dayjs.utc()))

    if (durationLeft.asSeconds() <= 0) {
      //upgrade is finished, update planet

      planetData.level++
      planetData.upgradeFinishedTime = null
      planetData.upgrading = false

      console.log(`Planet ${planetData.id} finished upgrading to level ${planetData.level}`)

      await docref.set(planetData)

      return planetData

    } 
  
    return null
  }

  
}

export default checkForUpgradeComplete
