const connection = require('../database/db.js');
const uuid = require('uuid');
const crypto = require('crypto');

module.exports = {
    async index(req, res){
        try{
            const {page = 1} = req.query;
            
            const usuarios = await connection.mysqlUsuarios.findAndCountAll({
                limit: 10,
                offset: ((page -1) * 10),
            });

            return res.json(usuarios.rows);

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    
    async create(req, res){
        try{
            const {cpf, nome, email, senha} = req.body;

            const sha = crypto.createHash('sha1')
            sha.update(senha);

            const data = {
                id: uuid.v4(),
                cpf, 
                nome, 
                email, 
                senha: sha.digest('hex'), 
                status:'ativo', 
                data_nascimento: Date.now(),
                data_registro: Date.now(),
            };

            await connection.mysqlUsuarios.create(data);

            return res.json({mensagem: "criado com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
        
    }
}