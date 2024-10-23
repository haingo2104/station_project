import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import express from "express"
import path from "path"
import cors from "cors"
import { setUser } from "./setUser.js"
const corsOptions = {
  origin: 'http://localhost:3000', // Assurez-vous que cette URL correspond à celle de votre frontend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
export default [
  cors(corsOptions),
  express.static(path.resolve('public')),
  bodyParser.json({ limit: "4mb" }),
  bodyParser.urlencoded({ extended: false }),
  cookieParser(),
  setUser
]