import dbConnection from "../database"
import { Collection, Db } from "mongodb"

export default class Base {
    async getCollection(collection: string) {
        const db: Db = await dbConnection.getMongoConnection()
        return db.collection(collection)
    }
}
