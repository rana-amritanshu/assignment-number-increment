// require("dotenv").config()
import config from "./config"
import express, { Application, Request, Response } from "express"
import bodyParser from "body-parser"
import { clientClose } from "./database"
import { validateRegistration } from "./middlewares/validation"
import HTTP_STATUS_CODE from "./helpers/httpStatusCode"
import Auth from "./controllers/Auth"
import { validateAccessToken } from "./middlewares/auth"
import Counter from "./controllers/Counter"

const app: Application = express()

app.use(bodyParser.json())
app.get("/", (req, res) => {
    res.send({ message: "Hello" })
})

app.post(
    "/register",
    validateRegistration,
    async (req: Request, res: Response) => {
        try {
            const auth: Auth = new Auth(req)
            const { statusCode, response } = await auth.register()

            res.status(statusCode).send(response)
        } catch (error) {
            console.error(error)
            res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
                message: "Something went wrong, Internal server error",
                error,
            })
        }
    }
)

app.post(
    "/login",
    validateRegistration,
    async (req: Request, res: Response) => {
        try {
            const auth: Auth = new Auth(req)
            const { statusCode, response } = await auth.login()

            res.status(statusCode).send(response)
        } catch (error) {
            console.error(error)
            res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
                message: "Something went wrong, Internal server error",
                error,
            })
        }
    }
)

app.get("/current", validateAccessToken, (req: Request, res: Response) => {
    res.send({
        message: "Current value successfully fetched",
        data: {
            number: req.body.auth().number,
        },
    })
})

app.get("/next", validateAccessToken, async (req: Request, res: Response) => {
    const counter: Counter = new Counter(req)
    const { statusCode, response } = await counter.nextCounter()
    res.status(statusCode).send(response)
})

app.put(
    "/current",
    validateAccessToken,
    async (req: Request, res: Response) => {
        const counter: Counter = new Counter(req)
        const { statusCode, response } = await counter.resetCounter()

        res.status(statusCode).send(response)
    }
)

app.listen(config.port, () => {
    console.log(`Server is running at port ${config.port}`)
})

process.on("exit", async () => {
    await clientClose()
})
