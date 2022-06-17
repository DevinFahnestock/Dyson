import type { User } from "@dyson/shared/src/User"

import { app } from "firebase-admin"
import { IUserRepository } from './IUserRepository'

export class FirebaseUserRepository implements IUserRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createNewUser(user: User): Promise<User> {
    await this.admin.firestore().collection("admin").doc("gameData").collection("userData").doc(user.uid).set(user)
    return user
  }

  async fetchUserData(userID: string): Promise<User> {
    const result = await this.admin.firestore().collection("admin").doc("gameData").collection("userData").doc(userID).get()
    return result.data() as User
  }
}
