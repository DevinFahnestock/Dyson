import { app, firestore } from 'firebase-admin'
import { Counters, ICounterRepository } from './ICounterRepository'

export class FirebaseCounterRepository implements ICounterRepository {
  protected readonly admin: app.App

  constructor(admin: app.App) {
    this.admin = admin
  }

  async getCounter(counterToGet: string): Promise<number> {
    const query = await this._getCounterDocumentReference().get()
    return query.data()[counterToGet]
  }

  async getCounters(): Promise<Counters> {
    const query = await this._getCounterDocumentReference().get()
    return query.data() as Counters
  }

  private _getCounterDocumentReference() {
    return this.admin.firestore().collection('admin').doc('gameData').collection('counters').doc('Jl2JWvpXIVqDRFMlf6LF')
  }

  async incrementCounter(counterToIncrement: string, valueToIncrementBy: number): Promise<void> {
    await this._getCounterDocumentReference().set(
      { [counterToIncrement]: firestore.FieldValue.increment(valueToIncrementBy) },
      { merge: true }
    )
  }
}
