import type { app } from 'firebase-admin'
import { IUserRepository } from './IUserRepository'
import { ICounterRepository } from './ICounterRepository'

export class FirebaseUserRepository implements IUserRepository {
  protected readonly admin: app.App
  protected readonly counterRepository: ICounterRepository

  constructor(admin: app.App, counterRepository: ICounterRepository) {
    this.admin = admin
    this.counterRepository = counterRepository
  }

  async queryUsers(limit: number, offset: number): Promise<any[]> {
    const usersRef = this.admin.firestore().collection('admin').doc('gameData').collection('userData')

    const usersQuery = await usersRef.limit(limit).offset(offset).get()
    let users = []

    usersQuery.forEach((userDocumentReference) => {
      users.push(userDocumentReference.data())
    })
    return users
  }

  async createNewDatabaseUser(userID: string): Promise<void> {
    const userDocumentReference = await this._getUserDocumentReference(userID)

    const userDocSnapshot = await userDocumentReference.get()

    if (userDocSnapshot.exists) {
      throw new Error(`User with ID ${userID} already exists. Cannot create new user`)
    } else {
      await userDocumentReference.set({ newAccount: false })
      await this.counterRepository.incrementCounter('users', 1)
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

  async deleteUserDatabaseEntries(userID: string): Promise<void> {
    const userDocumentReference = await this._getUserDocumentReference(userID)
    userDocumentReference.delete()
    await this.counterRepository.incrementCounter('users', -1)
  }
}
