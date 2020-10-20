const connection = require('../database/db.js');
const uuid = require('uuid');
const crypto = require('crypto');
const {Op} = require('sequelize');

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
            const {cpf, nome, email, senha, nascimento} = req.body;

            const sha = crypto.createHash('sha1')
            sha.update(senha);

            const data = {
                id: uuid.v4(),
                cpf, 
                nome, 
                email, 
                senha: sha.digest('hex'), 
                status:'ativo', 
                data_nascimento: nascimento,
                data_registro: Date.now(),
            };

            const existe = await connection.mysqlUsuarios.findAll({where: {
                [Op.or]:{
                    nome,
                    cpf,
                    email
                }
            }});
            
            if(existe[0]){
                throw new Error('Nome Email ou cpf já cadastrados');
            }

            await connection.mysqlUsuarios.create(data);

            return res.json({mensagem: "cadastrado com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
        
    },
    async log(req, res){
        try{
            const {nome, senha} = req.body;

            const sha = crypto.createHash('sha1')
            sha.update(senha);

            const usuario = await connection.mysqlUsuarios.findAll({
                where:{
                    nome: nome,
                    senha: sha.digest('hex'),
                    status: 'ativo'
                }
            });
            if(usuario.length === 1){
                return res.status(202).json(usuario[0]);
            }else{
                throw new Error('Senha ou nome inválidos');
            }

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    }
}