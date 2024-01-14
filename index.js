import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import rutasJoyeria from "./routes/rutasJoyas.js"

const app = express();
app.use(express.json());
app.use(cors());
app.use("/joyas", rutasJoyeria);

app.use("*", (req, res) => {
    res.json({ ok: false, result: "404 Pagina no Encontrada" });
});

const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log("Server up and running en: http://localhost:" + PORT);
    });
