import MongoDB, { MongoClient, Db } from "mongodb"
import config from "./config"
const mongoClient = MongoClient

class DBConnection {
    url: string
    dbName: string
    instances: number
    db: Db | null
    client: MongoClient | null
    constructor() {
        this.url = <string>config.mongo_uri
        this.dbName = <string>config.db_name
        this.instances = 0
        this.db = null
        this.client = null
    }

    async getMongoConnection() {
        try {
            if (this.db === null) {
                this.client = await mongoClient.connect(this.url)
                this.db = this.client.db(this.dbName)
                this.instances += 1
                console.log(`MongoDB successfully connected`, this.instances)
                return this.db
            } else {
                // console.log(`Mongo: Getting existing connection`)
                return this.db
            }
        } catch (e) {
            console.log(e)
            throw new Error("DB Connection failed")
        }
    }

    async clientClose() {
        console.log(`Closing connection with MongoDB`)
        this.client?.close()
    }
}

const dbConnection: DBConnection = new DBConnection()
;(async () => {
    await dbConnection.getMongoConnection()
})()

export default dbConnection

export const clientClose = dbConnection.clientClose
