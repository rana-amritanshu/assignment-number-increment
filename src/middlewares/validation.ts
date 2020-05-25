import { Request, Response, NextFunction } from "express"
import validator from "validator"
import HTTP_STATUS_CODE from "../helpers/httpStatusCode"
import dbConnection from "../database"

export const validateRegistration = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
            message: "Please enter a valid email",
        })
    } else if (!req.body.password || validator.isEmpty(req.body.password)) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
            message: "Please enter a valid password",
        })
    } else {
        next()
    }
}
