const express = require("express")

const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//configurar pasta public
server.use(express.static("public"))

//habilitar o uso do rq.bosy na nossa aplicação
server.use(express.urlencoded({ extend: true }))

//utilizando template nunjucks

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da minha aplicação


//página inicial

// req: requisição
//res: resposta

server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })

})

server.get("/create-point", (req, res) => {

    //req.query: Query strings da nossa url
    //req.

    return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {

    //req.body: o corpo do nosso formulário
    //console.log(req.bosy)

    //inserir dados no banco de dados

    //inserir dados na tabela
    const query = `
        INSERT INTO places (
            image,
            name,
            adress,
            addres2,
            state,
            city,
            items
        ) 
        VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.adress,
        req.body.addres2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            return console.log(err)
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {

    const search = req.query.search
    if (search == "") {
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    }

    //pegar os dados do banco de dados

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
            console.log(rows)
        }

        console.log("Aqui estão seus registros")
        console.log(rows)

        const total = rows.length

        //mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total })
    })

})

//ligar o servidor
server.listen(3000)

