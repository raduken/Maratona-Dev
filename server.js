//configurando o servidor
const express = require("express")
const server = express()

//configurar o servidor para apresentar arquivos extra

server.use(express.static('public'))

//habilitar body do form.
server.use(express.urlencoded({extended: true}))

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'asdfg123',
    host: 'localhost',
    port: 5432,
    database: 'doe'

})

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})




//configurar a apresentacao da pagina
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de Banco de dados")

        const donors = result.rows

        return res.render("index.html", { donors })
    })
    
})

server.post("/", function(req, res) {
    //pegar dados do form.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    }


    // colocar valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) {
            console.log(err)
            return res.send("erro no bando de dados.")
        }        
        //fluxo ideal
        return res.redirect("/")
    })

    

})

server.listen(3000, function() {
    console.log("iniciei o servidor.")
})