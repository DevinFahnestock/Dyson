import { app } from 'firebase-admin'

export class Auth {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  public validateToken(token: string): string {
    this.admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid
        this.admin.auth().getUser(uid)
      })
  }
}
