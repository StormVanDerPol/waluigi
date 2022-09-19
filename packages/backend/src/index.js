const { Router } = require("express");
const express = require("express");
const appleAuth = require("./apple-auth");


const app = express();


const requestHandler = (handler) => async (req, res) => {
    try {
        const result = await handler(req, res);
        res.status(result ? 200 : 204)
        res.send(result)
    } catch (error) {
        console.error("[request handler error]:", error)
        res.status(500);
        res.end()
    }
}

app.use(express.json())

const api = Router();
api.get("/hello", requestHandler(() => "ok"));
api.post("/auth-apple", requestHandler(appleAuth));
app.use("/api", api);

const server = app.listen(6060, () => console.log("Node listening @ :6060"));