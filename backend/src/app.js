import  express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRouter from './modules/auth/index.js'
import usersRouter from "./modules/users/index.js";
import chatsRouter from "./modules/chats/index.js";
import messagesRouter from "./modules/messages/index.js";

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))




app.get('/',(req,res)=>{
  res.json({
    success: true,
    message : "server is running ..."
  })
})

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/messages", messagesRouter);

export default app