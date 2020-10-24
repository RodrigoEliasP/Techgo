const connection = require('../database/db.js');
const uuid = require('uuid');
const crypto = require('crypto');
const {Op} = require('sequelize');


module.exports = {
    async index(req, res){
        try{
            const {page = 1} = req.query;
            
            const tecnicos = await connection.mysqlTrabalhador.findAndCountAll({
                include: [connection.mysqlCategoria],
                limit: 10,
                offset: ((page -1) * 10),

            });

            
            
            return res.status(202).json(tecnicos.rows);
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    
    async create(req, res){
        try{
            const {cpf, nome, email, senha, nascimento , categoria} = req.body;

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
                Categoria_id: categoria
            };
            
            const existe = await connection.mysqlTrabalhador.findAll({where: {
                [Op.or]:{
                    nome,
                    cpf,
                    email
                }
            }});
            
            if(existe[0]){
                throw new Error('Nome Email ou cpf já cadastrados');
            }

            await connection.mysqlTrabalhador.create(data);

            return res.status(202).json({mensagem: "cadastrado com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async log(req, res){
        try{
            const {nome, senha} = req.body;

            const sha = crypto.createHash('sha1')
            sha.update(senha);

            const tecnico = await connection.mysqlTrabalhador.findAll({
                where:{
                    nome: nome,
                    senha: sha.digest('hex'),
                    status: {
                        [Op.or]: ['ativo','premium']
                    }
                },
                include: [connection.mysqlCategoria],
            });
            if(tecnico.length === 1){
                return res.status(202).json(tecnico[0]);
            }else{
                throw new Error('Senha ou nome inválidos');
            }

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async delete(req, res){
        try{
            const {id} = req.params;

            const usuario = await connection.mysqlTrabalhador.findOne({where:{
                id:id
            }});
            usuario.status = 'inativo'
            await usuario.save();
            
            return res.status(202).json({mensagem: "Conta apagada com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async premium(req,res){
        try{
            const {id} = req.params;

            const usuario = await connection.mysqlTrabalhador.findOne({where:{
                id:id
            }});
            usuario.status = 'premium'
            await usuario.save();
            
            return res.status(202).json({mensagem: "Conta vipada com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    }
}
