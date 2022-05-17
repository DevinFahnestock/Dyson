import { Server } from "socket.io"
import { createNewUserStarterPlanets, fetchUserData, createUser, updatePlanet, fetchPlanet } from "./lib/firebase/"

import admin from "firebase-admin"
import fetchAllPlanetDataByUser from "./lib/firebase/fetchAllPlanetsByUser"
import checkForUpgradeComplete from "./lib/firebase/checkForUpgradeComplete"

require("dotenv").config()

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
})

const port = 25145

const server = new Server(port)
console.log("Server Started on port", port)

server.on("connection", (socket) => {
  console.log("Connection established with socket ID: ", socket.handshake.address)

  socket.on("checkCompleteUpgrade", async (planetID) => {
    const newPlanetData = await checkForUpgradeComplete(admin, planetID)
   
    if (newPlanetData) {
      socket.emit("planetUpdate", newPlanetData)
    } else {
      //planet is not finished upgrading yet
      console.log('planet upgrade not finished yet')
    }
  })

  socket.on("userStateChanged", async (userUID) => {
    // if user has account, send back the save data, otherwise create a new account
    const userGameData = await fetchUserData(admin, userUID)
    console.log("logging in with id:", userUID)
    if (userGameData) {
      socket.emit("updateAllGameData", await fetchAllPlanetDataByUser(admin, userUID))
    } else {
      console.log("fetching user data from client to create account")
      socket.emit("NoUserExists")
    }
  })

  socket.on("CreateNewUserData", async (data) => {
    console.log("Creating a new user")
    const newData = await createUser(admin, data)
    await createNewUserStarterPlanets(admin, newData.uid)
    socket.emit("updateAllGameData", await fetchAllPlanetDataByUser(admin, newData.uid))
  })

  socket.on("upgradePlanet", async ({ planetID, userUID }) => {
    const updatedPlanet = await updatePlanet(admin, planetID, userUID)
    socket.emit("planetUpdate", updatedPlanet)
  })
})
