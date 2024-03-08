import app from "./app"
import dbConnect from "../../Config/DbConfig"

const port = process.env.SERVER_PORT

dbConnect()
    .then(() => {
    app.listen(port, () => {
        console.log(`Server rodando em ${process.env.BACKEND_URL_API}`)
    })
}
).catch(err => console.log("Erro ao conectar ao banco", err))