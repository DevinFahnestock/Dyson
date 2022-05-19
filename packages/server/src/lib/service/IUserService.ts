export interface IUserService {

  createNewUser(user: User): Promise<User>

  fetchUser(user: User): Promise<User>

}