import admin from 'firebase-admin'

import {
  IUserRepository,
  IPlanetRepository,
  FirebasePlanetRepository,
  FirebaseUserRepository,
  FirebaseGalaxyRepository,
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

require('dotenv').config()

let administrator = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
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

const galaxyRepository: IGalaxyRepository = new FirebaseGalaxyRepository(administrator)
const galaxyService: IGalaxyService = new GalaxyService(galaxyRepository)

const port = 25145

const network: INetworking = new SocketIONetworking(port, planetService, userService, warehouseService, administrator)

galaxyService.initiateGalaxyCheck()

network.listenForConnections()

//some quick functions to clean up old users that no longer work, or are outdated beyond the want to migrate data

function deleteAllInvalidUsers() {
  userService.queryUsers(100, 0).then((data) => {
    console.log('users with 0 limit: ', data)
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
