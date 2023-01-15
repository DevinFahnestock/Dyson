import admin from 'firebase-admin'

import {
  IUserRepository,
  IPlanetRepository,
  FirebasePlanetRepository,
  FirebaseUserRepository,
  FirebaseGalaxyRepository,
  ICounterRepository,
  FirebaseCounterRepository,
} from './lib/repositories'
import {
  IPlanetService,
  IUserService,
  IWarehouseService,
  PlanetService,
  UserService,
  WarehouseService,
} from './lib/service'
import { INetworking } from './lib/Networking/INetworking'
import { SocketIONetworking } from './lib/Networking/SocketIONetworking'
import { IWarehouseRepository } from './lib/repositories/IWarehouseRepository'
import { FirebaseWarehouseRepository } from './lib/repositories/FirebaseWarehouseRepository'
import { IGalaxyRepository } from './lib/repositories/IGalaxyRepository'
import { IGalaxyService } from './lib/service/IGalaxyService'
import { GalaxyService } from './lib/service/GalaxyService'
import { Auth } from './lib/firebase/auth'
import { Server, Socket } from 'socket.io'

require('dotenv').config()

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

let administrator = admin.initializeApp({ projectId: 'dyson-game' })

// let administrator = admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.PROJECT_ID,
//     privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     clientEmail: process.env.CLIENT_EMAIL,
//   }),
//   databaseURL: process.env.DATABASE_URL,
// })

const auth: Auth = new Auth(administrator)

const counterRepository: ICounterRepository = new FirebaseCounterRepository(administrator)

const userRepository: IUserRepository = new FirebaseUserRepository(administrator, counterRepository)
const userService: IUserService = new UserService(userRepository, auth)

const planetRepository: IPlanetRepository = new FirebasePlanetRepository(administrator, counterRepository)
const planetService: IPlanetService = new PlanetService(planetRepository)

const warehouseRepository: IWarehouseRepository = new FirebaseWarehouseRepository(administrator)
const warehouseService: IWarehouseService = new WarehouseService(warehouseRepository)

const galaxyRepository: IGalaxyRepository = new FirebaseGalaxyRepository(administrator, counterRepository)
const galaxyService: IGalaxyService = new GalaxyService(galaxyRepository, counterRepository)

const port = 25145

const server: Server = new Server(port)

initiateServer()

async function initiateServer() {
  await createNewServerDatabase()
  await galaxyService.initiateGalaxyCheck()
  startServerSocket()
}

function startServerSocket() {
  server.on('connection', (socket: Socket) => {
    console.log('Connection established with socket ID: ', socket.handshake.address)

    new SocketIONetworking(
      port,
      planetService,
      userService,
      warehouseService,
      counterRepository,
      administrator,
      auth,
      socket
    )
  })
}

async function createNewServerDatabase() {
  let countersDocumentRef = admin
    .firestore()
    .collection('admin')
    .doc('gameData')
    .collection('counters')
    .doc('Jl2JWvpXIVqDRFMlf6LF')
  let counterDocumentSnapshot = await countersDocumentRef.get()
  if (!counterDocumentSnapshot.exists) {
    await countersDocumentRef.create({
      planets: 0,
      warehouses: 0,
      users: 0,
      galaxyPlanets: 0,
    })
  }

  //some quick functions to clean up old users that no longer work, or are outdated beyond the want to migrate data

  function deleteAllInvalidUsers() {
    userService.queryUsers(100, 0).then((data) => {
      data.forEach((user) => {
        if (!user.newAccount) {
          userService.deleteUserDatabaseEntries(user.uid)
          planetService.deleteAllPlanetsByUserID(user.uid)
          warehouseService.deleteAllWarehousesByUserID(user.uid)
        }
      })
    })
  }

  function deleteAllOtherUsers() {
    const oldusers = []
    return () => {
      admin
        .auth()
        .listUsers(1000)
        .then((listOfUsers) => {
          listOfUsers.users.forEach((user) => {
            if (user.email != 'devinmfahnestock@gmail.com') {
              oldusers.push(user.uid)
              console.log(user.uid)
            }
          })
        })
        .then(() => {
          admin
            .auth()
            .deleteUsers(oldusers)
            .then((data) => {
              console.log(data)
            })
        })
    }
  }
}
