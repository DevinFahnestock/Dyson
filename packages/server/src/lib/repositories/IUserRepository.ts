
import { User } from "@dyson/shared/src/User"

export interface IUserRepository {

  createNewUser(user: User): Promise<User>

  fetchUserData(userID: string): Promise<User>

}