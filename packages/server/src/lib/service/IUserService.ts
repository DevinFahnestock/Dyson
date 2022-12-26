import { User } from '@firebase/auth'

export interface IUserService {
  createNewUser(user: User): Promise<User>

  //fetchUser(user: User): Promise<User>

  resolveUserNames(ids: string[]): any

  fetchUserByID(userID: string): Promise<User>
}
