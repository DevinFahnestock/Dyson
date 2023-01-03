import { app } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'

export class Auth {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async fetchGoogleAuthUserData(userID: string): Promise<any> {
    const result = await this.admin.auth().getUser(userID)
    return result
  }

  async decodeToken(token: string): Promise<DecodedIdToken> {
    const decodedToken = await this.admin.auth().verifyIdToken(token)
    return decodedToken
  }

  public getUsers(limit: number) {
    this.admin
      .auth()
      .listUsers(limit)
      .then((listOfUsers) => {
        listOfUsers.users.forEach((user) => {
          if (user.email != 'devinmfahnestock@gmail.com') {
            console.log(user.email)
          }
        })
      })
  }
}
