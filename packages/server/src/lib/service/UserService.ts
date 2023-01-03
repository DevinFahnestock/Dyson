import { User } from '@firebase/auth'
import { Auth } from '../firebase/auth'

import { IUserRepository } from '../repositories/IUserRepository'
import { IUserService } from './IUserService'

export class UserService implements IUserService {
  protected readonly repository: IUserRepository
  protected readonly auth: Auth

  constructor(repository: IUserRepository, auth: Auth) {
    this.repository = repository
    this.auth = auth
  }

  async deleteUserDatabaseEntries(userID: string): Promise<void> {
    await this.repository.deleteUserDatabaseEntries(userID)
  }

  async queryUsers(limit: number, offset: number): Promise<any[]> {
    const queriedUsers = await this.repository.queryUsers(limit, offset)
    return queriedUsers
  }

  async createNewUser(userID: string): Promise<void> {
    try {
      await this.repository.createNewDatabaseUser(userID)
    } catch (error) {
      throw new error(`User with ID ${userID} already exists, cant create new user`)
    }
  }

  // TODO: Clean this up whatever it is...
  async fetchUser(user: User): Promise<User> {
    const userData = await this.auth.fetchGoogleAuthUserData(user.uid)
    if (userData) {
      return userData
    }
    //this.createNewUser(user.uid)
    return null
  }

  async fetchUserByID(userID: string): Promise<any> {
    let userData: any
    try {
      userData = await this.repository.fetchDatabaseUserData(userID)
    } catch (err) {
      throw new Error(`User Not Found by ID: ${userID}`)
    }
    return userData
  }

  async resolveUserNames(ids: string[]): Promise<Object> {
    let names = {}
    for (const id of ids) {
      names[id] = await this.repository.resolveUserNameByID(id)
    }
    return names
  }
}
