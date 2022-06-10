
import admin from "firebase-admin"

import { IUserRepository, IPlanetRepository, FirebasePlanetRepository, FirebaseUserRepository } from "./lib/repositories"
import { IPlanetService, IUserService, IWarehouseService, PlanetService, UserService, WarehouseService } from "./lib/service"
import { INetworking } from "./lib/Networking/INetworking"
import { SocketIONetworking } from "./lib/Networking/SocketIONetworking"
import { IWarehouseRepository } from "./lib/repositories/IWarehouseRepository"
import { FirebaseWarehouseRepository } from "./lib/repositories/FirebaseWarehouseRepository"


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

const warehouseRepository: IWarehouseRepository = new FirebaseWarehouseRepository(administrator)
const warehouseService: IWarehouseService = new WarehouseService(warehouseRepository)

const port = 25145

const network: INetworking = new SocketIONetworking(port, planetService, userService, warehouseService)

network.listenForConnections()