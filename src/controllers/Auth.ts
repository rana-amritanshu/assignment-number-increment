import { Request } from "express"
import dbConnection from "../database"
import HTTP_STATUS_CODE from "../helpers/httpStatusCode"
import moment from "moment"
import { hash as passwordHash, verify as passwordVerify } from "argon2"
import { createToken } from "../helpers/auth"
import { Db, Collection } from "mongodb"
import UserModel from "../model/User"

export default class Auth {
    req: Request
    constructor(req: Request) {
        this.req = req
    }

    async register() {
        try {
            const email = this.req.body.email.trim()
            const users: Collection = await UserModel.getUserCollection()
            const user = await users.findOne({ email })

            if (!!user) {
                return {
                    statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                    response: {
                        message: "This email is already registered with us",
                    },
                }
            }

            const password = await passwordHash(this.req.body.password)
            const dateTime = moment().toISOString()

            const saveUser = await users.insertOne({
                email,
                password,
                number: Math.floor(Math.random() * 100),
                createdAt: dateTime,
                updatedAt: dateTime,
                lastLogin: dateTime,
            })

            const token = await createToken(saveUser.ops[0]._id)

            return {
                statusCode: HTTP_STATUS_CODE.OK,
                response: {
                    message: "You have successfully registered with us",
                    data: {
                        token,
                        type: "Bearer",
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

    async login() {
        try {
            const email = this.req.body.email.trim()
            const users: Collection = await UserModel.getUserCollection()
            const user = await users.findOne({ email })

            if (!user) {
                return {
                    statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                    response: {
                        message: "Please check your credentials",
                    },
                }
            }

            if (
                !(await passwordVerify(user.password, this.req.body.password))
            ) {
                return {
                    statusCode: HTTP_STATUS_CODE.BAD_REQUEST,
                    response: {
                        message: "Please check your credentials",
                    },
                }
            }

            const dateTime = moment().toISOString()
            const updatedUser = await users.updateOne(
                { email },
                {
                    $set: { lastLogin: dateTime },
                }
            )

            const token = await createToken(user._id)

            return {
                statusCode: HTTP_STATUS_CODE.OK,
                response: {
                    message: "You have successfully logged in",
                    data: {
                        token,
                        type: "Bearer",
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
