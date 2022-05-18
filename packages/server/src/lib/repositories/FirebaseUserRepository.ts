import { app } from "firebase-admin"

class FirebaseUserRepository implements UserRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async createNewUser(user: any): Promise<void> {
    const defaultUserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }
    await this.admin.firestore().collection("admin").doc("gameData").collection("userData").doc(user.uid).set(defaultUserData)
  }

  async fetchUserData(userID: string): Promise<any> {
    const result = await this.admin.firestore().collection("admin").doc("gameData").collection("userData").doc(userID).get()
    return result.data()
  }
}
