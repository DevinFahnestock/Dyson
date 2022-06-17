import type { User } from "@dyson/shared/dist/User"

export interface IUserService {

  createNewUser(user: User): Promise<User>

  fetchUser(user: User): Promise<User>

}