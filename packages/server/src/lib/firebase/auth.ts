import { app } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { UserRecord } from 'firebase-functions/v1/auth'

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

  async getUsers(limit: number): Promise<UserRecord[]> {
    const userList = await this.admin.auth().listUsers(limit)
    return userList.users
  }
}
