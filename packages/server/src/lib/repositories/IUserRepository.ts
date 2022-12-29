import { User } from '@firebase/auth'

export interface IUserRepository {
  createNewUser(user: User): Promise<User>

  fetchUserData(userID: string): Promise<User>

  resolveUserID(id: string): Promise<string>
}
