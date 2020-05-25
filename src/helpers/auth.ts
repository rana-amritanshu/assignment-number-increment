import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken"
import config from "../config"
import { JwtToken } from "./types"

export const createToken = (id: string) => {
    return new Promise((resolve, reject) => {
        const userId: string = id
        jwtSign(
            {
                id: userId,
                subject: userId,
            },
            <string>config.server_key,
            {
                algorithm: "HS256",
                expiresIn: "30d",
            },
            (err, token) => {
                if (err) reject(err)

                resolve(token)
            }
        )
    })
}

export const validateToken = (token: string): Promise<JwtToken> => {
    return new Promise((resolve, reject) => {
        jwtVerify(token, <string>config.server_key, (err, decoded) => {
            if (err) reject(err)

            resolve(<JwtToken>decoded)
        })
    })
}
