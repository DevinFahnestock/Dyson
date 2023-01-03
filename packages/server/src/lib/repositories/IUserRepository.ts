export interface IUserRepository {
  createNewDatabaseUser(userID: string): Promise<void>

  fetchDatabaseUserData(userID: string): Promise<any>

  resolveUserNameByID(id: string): Promise<string>

  deleteUserDatabaseEntries(userID: string): Promise<void>

  queryUsers(limit: number, offset: number): Promise<any>
}
