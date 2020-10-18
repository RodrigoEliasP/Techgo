const connection = require('../database/db.js');
const uuid = require('uuid');

module.exports = {
    async index(req, res){
        try{
            const {page = 1} = req.query;
            
            const pedidos = await connection.mysqlPedidos.findAndCountAll({
                limit: 10,
                offset: ((page -1) * 10)
            });
            
            return res.status(202).json(pedidos.rows);

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    
    async create(req, res){
        try{
            const {descricao, usuario} = req.body;

            const data = {
                id_pedido: uuid.v4(),
                descricao: descricao,
                data_criacao: Date.now(),
                data_conclusao: null,
                valor_fechado: null,
                trabalhadores_id: null,
                usuarios_id: usuario
            }

            await connection.mysqlPedidos.create(data)


            return res.status(202).json({mensagem: "criado com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async confirm(req, res){
        try{
            const {trabalhador, valor_fechado}
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    }
}