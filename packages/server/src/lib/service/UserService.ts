import { User } from '@firebase/auth'

import { IUserRepository } from '../repositories/IUserRepository'
import { IUserService } from './IUserService'

export class UserService implements IUserService {
  protected readonly repository: IUserRepository

  constructor(repository: IUserRepository) {
    this.repository = repository
  }

  async createNewUser(user: User): Promise<User> {
    return await this.repository.createNewUser(user)
  }

  async fetchUser(user: User): Promise<User> {
    const userData = await this.repository.fetchUserData(user.uid)
    if (userData) {
      return userData
    }
    this.createNewUser(user)
    return null
  }

  async fetchUserByID(userID: string): Promise<User> {
    console.log('getting user data for user ', userID)
    let userData: any
    try {
      userData = await this.repository.fetchUserData(userID)
    } catch (err) {
      throw new Error(`User Not Found by ID: ${userID}`)
    }
    return userData
  }

  async resolveUserNames(ids: string[]): Promise<Object> {
    let names = {}
    for (const id of ids) {
      names[id] = await this.repository.resolveUserID(id)
    }
    return names
  }
}
