import { app } from 'firebase-admin'

export class Auth {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  public validateToken(token: string) {
    this.admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        const uid = decodedToken.uid
        this.admin.auth().getUser(uid)
      })
  }

  public getUsers() {
    this.admin
      .auth()
      .listUsers(1000)
      .then((listOfUsers) => {
        listOfUsers.users.forEach((user) => {
          if (user.email != 'devinmfahnestock@gmail.com') {
            console.log(user.email)
          }
        })
      })
  }
}
