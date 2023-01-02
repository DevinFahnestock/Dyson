import { User } from '@firebase/auth'

export interface IUserService {
  createNewUser(userID: string): Promise<void>

  fetchUser(user: User): Promise<User>

  resolveUserNames(ids: string[]): Promise<Object>

  fetchUserByID(userID: string): Promise<User>
}
