import { User } from '@firebase/auth'

export interface IUserRepository {
  createNewDatabaseUser(userID: string): Promise<void>

  fetchGoogleAuthUserData(userID: string): Promise<User>

  fetchDatabaseUserData(userID: string): Promise<any>

  resolveUserNameByID(id: string): Promise<string>

  deleteUserDatabaseEntries(userID: string): Promise<void>

  queryUsers(limit: number, offset: number): Promise<any>
}
