
export interface IUserRepository {

  createNewUser(user: any): Promise<void>

  fetchUserData(userID: string): Promise<any>

}