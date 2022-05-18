
interface UserRepository {

  createNewUser(user: any): Promise<void>

  fetchUserData(userID: string): Promise<any>

}