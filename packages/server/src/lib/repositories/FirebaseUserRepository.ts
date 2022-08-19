import type { User } from '@dyson/shared/dist/User'

import FieldValue from 'firebase/firestore'
import { app } from 'firebase-admin'
import { IUserRepository } from './IUserRepository'

export class FirebaseUserRepository implements IUserRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createNewUser(user: User): Promise<User> {
    await this.admin.firestore().collection('admin').doc('gameData').collection('userData').doc(user.uid).set(user)
    this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('counters')
      .doc('Jl2JWvpXIVqDRFMlf6LF')
      .set({ users: FieldValue.increment(1) }, { merge: true })
    return user
  }

  async fetchUserData(userID: string): Promise<User> {
    const result = await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('userData')
      .doc(userID)
      .get()
    return result.data() as User
  }

  async resolveUserID(id: string): Promise<string> {
    const user = await this.admin.firestore().collection('admin').doc('gameData').collection('userData').doc(id).get()
    return user.data().displayName
  }
}
