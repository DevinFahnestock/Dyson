
import { User } from "@dyson/shared/dist/User"

export interface IUserRepository {

  createNewUser(user: User): Promise<User>

  fetchUserData(userID: string): Promise<User>

}