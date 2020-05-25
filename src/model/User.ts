import Base from "./Base"
import { Collection } from "mongodb"

class User extends Base {
    async getUserCollection() {
        return await this.getCollection("users")
    }
}

const user: User = new User()

export default user
