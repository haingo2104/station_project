import express from "express"
import middlewares from "./config/middlewares/middlewares.js"
import routes from "./config/routes/index.js"
import { config } from "dotenv"

config()

const app = express()
const port = process.env.PORT || 8000

middlewares.forEach(md => app.use(md))
routes.forEach(route => app.use(route.prefix , route.group))

app.use((error , req , res , next)=>{
    if (error) {
        switch (error.name) {
            case "ClientError" : {
                return res.status(error.code).json({message: error.message})
            }
            case "ForbiddenError" : {
                return res.status(error.code).json({message: error.message})
            }
            case "NotFoundError" : {
                return res.status(error.code).json({message: error.message})
            }
            case "ServerError" : {
                return res.status(error.code).json({message: error.message})
            }
            default : {
                return res.status(500).json({message:error.message})
            }    
        }
    }
    next()
}) 

app.listen(port , () => console.log(`http://localhost:${port}`))