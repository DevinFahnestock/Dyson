import { User } from '@firebase/auth'
import { firestore } from 'firebase-admin'

import type { app } from 'firebase-admin'
import { IUserRepository } from './IUserRepository'

export class FirebaseUserRepository implements IUserRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createNewDatabaseUser(userID: string): Promise<void> {
    const userDocumentReference = await this._getUserDocumentReference(userID)

    const userDocSnapshot = await userDocumentReference.get()

    if (userDocSnapshot.exists) {
      throw new Error(`User with ID ${userID} already exists. Cannot create new user`)
    } else {
      await userDocumentReference.set({ newAccount: true })
      await this.incrementUserCounter(1)
    }
  }

  async fetchDatabaseUserData(userID: string): Promise<any> {
    const userDocumentReference = await this._getUserDocumentReference(userID)

    const userDocSnapshot = await userDocumentReference.get()

    if (!userDocSnapshot.exists) {
      throw new Error(`User with ID ${userID} does not exist`)
    } else {
      return userDocSnapshot.data()
    }
  }

  // TODO: change the location of this function. It is fetching the auth user, not the database user
  async fetchGoogleAuthUserData(userID: string): Promise<any> {
    const result = await this.admin.auth().getUser(userID)
    return result
  }

  async resolveUserNameByID(userID: string): Promise<string> {
    const userDocumentReference = await this._getUserDocumentReference(userID)

    const userDocSnapshot = await userDocumentReference.get()
    const displayName = await userDocSnapshot.data().displayName
    return displayName
  }

  private async _getUserDocumentReference(userID: string) {
    return await this.admin.firestore().collection('admin').doc('gameData').collection('userData').doc(userID)
  }

  private async incrementUserCounter(valueToIncrementBy: number) {
    await this.admin
      .firestore()
      .collection('admin')
      .doc('gameData')
      .collection('counters')
      .doc('Jl2JWvpXIVqDRFMlf6LF')
      .set({ users: firestore.FieldValue.increment(valueToIncrementBy) }, { merge: true })
  }
}
