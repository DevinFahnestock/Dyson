import { Server } from "socket.io"
//import { createNewUserStarterPlanets, fetchUserData, createUser, updatePlanet, fetchPlanet } from "./lib/firebase/"

import admin from "firebase-admin"
// import fetchAllPlanetDataByUser from "./lib/firebase/fetchAllPlanetsByUser"
// import checkForUpgradeComplete from "./lib/firebase/checkForUpgradeComplete"

import { IUserRepository, IPlanetRepository, FirebasePlanetRepository, FirebaseUserRepository } from "./lib/repositories"
import { IPlanetService, IUserService, PlanetService, UserService } from "./lib/service"
//import { PlanetType } from "./lib/shared"
import { INetworking } from "./lib/Networking/INetworking"
import { SocketIONetworking } from "./lib/Networking/SocketIONetworking"


require("dotenv").config()

let administrator = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL,
  }),
  databaseURL: process.env.DATABASE_URL,
})

const userRepository: IUserRepository = new FirebaseUserRepository(administrator)
const userService: IUserService = new UserService(userRepository)

const planetRepository: IPlanetRepository = new FirebasePlanetRepository(administrator)
const planetService: IPlanetService = new PlanetService(planetRepository)

const port = 25145

const network: INetworking = new SocketIONetworking(port, planetService, userService)

network.listenForConnections()

//const server = new Server(port)
//console.log("Server Started on port", port)

// server.on("connection", (socket) => {
//   console.log("Connection established with socket ID: ", socket.handshake.address)

//   socket.on("checkCompleteUpgrade", async (planetID: string, userID: string) => {
//     const newPlanetData = await planetService.checkForUpgradeCompleted(planetID, userID)

//     if (newPlanetData) {
//       socket.emit("planetUpdate", newPlanetData)
//     }
//   })

//   socket.on("userStateChanged", async (userUID) => {
//     // if user has account, send back the save data, otherwise create a new account
//     const userGameData = await userService.fetchUser(userUID)
//     console.log("logging in with id:", userUID)
//     if (userGameData) {
//       socket.emit("updateAllGameData", await planetService.getUserPlanets(userUID))
//     } else {
//       console.log("fetching user data from client to create account")
//       socket.emit("NoUserExists")
//     }
//   })

//   socket.on("CreateNewUserData", async (data) => {
//     console.log("Creating a new user")
//     const newData = await userService.createNewUser(data)
//     await planetService.createPlanet(data.id, PlanetType.Wet)
//     socket.emit("updateAllGameData", await planetService.getUserPlanets(newData.uid))
//   })

//   socket.on("upgradePlanet", async ({ planet, userID }) => {
//     const updatedPlanet = await planetService.updatePlanet(planet, userID)
//     socket.emit("planetUpdate", updatedPlanet)
//   })
// })
