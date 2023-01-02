import { User } from '@firebase/auth'

export interface IUserRepository {
  createNewDatabaseUser(userID: string): Promise<void>

  fetchGoogleAuthUserData(userID: string): Promise<User>

  fetchDatabaseUserData(userID: string): Promise<any>

  resolveUserNameByID(id: string): Promise<string>
}
