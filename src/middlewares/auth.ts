import { Request, Response, NextFunction } from "express"
import HTTP_STATUS_CODES from "../helpers/httpStatusCode"
import { validateToken } from "../helpers/auth"
import { JwtToken } from "../helpers/types"
import UserModel from "../model/User"
import { Collection, ObjectId } from "mongodb"

export const validateAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let authorization = req.header("authorization")

        if (!authorization) {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
                message: "Unauthorized access",
            })
        }

        let splitTokens: Array<string> = <Array<string>>(
            authorization?.split(" ")
        )

        if (splitTokens.length !== 2) {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
                message: "Unauthorized access",
            })
        }

        let [type, token] = splitTokens

        if (type.toLowerCase() !== "bearer") {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
                message: "Unauthorized access",
            })
        }

        let decoded: JwtToken = await validateToken(token)
        const users: Collection = await UserModel.getUserCollection()
        const user = await users.findOne({ _id: new ObjectId(decoded.id) })

        if (!user) {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
                message: "Unauthorized access",
            })
        }

        if (decoded && user) {
            req.body.auth = () => {
                return {
                    email: user.email,
                    number: user.number,
                    id: user._id,
                }
            }
            req.body.userId = () => {
                return decoded.id
            }

            next()
        }
    } catch (e) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
            message: e,
        })
    }
}
