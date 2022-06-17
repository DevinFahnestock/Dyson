import type { User } from "@dyson/shared/dist/User"
 
import { IUserRepository } from "../repositories/IUserRepository";
import { IUserService } from "./IUserService";

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

  

}