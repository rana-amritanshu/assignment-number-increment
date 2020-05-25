import { Request } from "express"
import HTTP_STATUS_CODE from "../helpers/httpStatusCode"
import { Collection, ObjectId } from "mongodb"
import UserModel from "../model/User"
import validator from "validator"
import { isNumber } from "util"

export default class Counter {
    req: Request
    constructor(req: Request) {
        this.req = req
    }

    async nextCounter() {
        try {
            const users: Collection = await UserModel.getUserCollection()
            const incrementedNumber = this.req.body.auth().number + 1
            const user = await users.updateOne(
                {
                    _id: new ObjectId(this.req.body.userId()),
                },
                {
                    $set: { number: incrementedNumber },
                }
            )

            return {
                statusCode: HTTP_STATUS_CODE.OK,
                response: {
                    message: "Your number has been incremented successfully",
                    data: {
                        number: incrementedNumber,
                    },
                },
            }
        } catch (error) {
            console.log(error)
            return {
                statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                response: {
                    message: "Something went wrong, internal server error",
                    error,
                },
            }
        }
    }

    async resetCounter() {
        try {
            if (!this.req.body.number || !isNumber(this.req.body.number)) {
                return {
                    statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                    response: {
                        message: "Please enter a valid number",
                    },
                }
            }

            if (this.req.body.number > 1_000_000_000_000) {
                return {
                    statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                    response: {
                        message: "Please enter a smaller number",
                    },
                }
            }

            const number: number = parseInt(this.req.body.number)

            const users: Collection = await UserModel.getUserCollection()
            const user = await users.updateOne(
                {
                    _id: new ObjectId(this.req.body.userId()),
                },
                {
                    $set: { number },
                }
            )

            return {
                statusCode: HTTP_STATUS_CODE.OK,
                response: {
                    message: `Your number has been successfully reset to ${number}`,
                    data: {
                        number,
                    },
                },
            }
        } catch (error) {
            console.log(error)
            return {
                statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                response: {
                    message: "Something went wrong, internal server error",
                    error,
                },
            }
        }
    }
}
