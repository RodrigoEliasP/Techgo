const connection = require('../database/db.js');
const uuid = require('uuid');

module.exports = {
    async index(req, res){
        try{
            const {page = 1} = req.query;
            
            const pedidos = await connection.mysqlPedidos.findAndCountAll({
                include: [connection.mysqlUsuarios, connection.mysqlTrabalhador],
                limit: 10,
                offset: ((page -1) * 10)
            });

            res.header('X-Total-Count', pedidos.count);
            
            return res.status(200).json(pedidos.rows);

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async selectOwn(req, res){
        try{
            const {page = 1, usuarioId, usuarioTipo} = req.query;

            if(usuarioTipo == "usuario"){

                const pedidos = await connection.mysqlPedidos.findAndCountAll({
                    where:{
                        usuarios_id: usuarioId
                    },
                    include: [connection.mysqlUsuarios, connection.mysqlTrabalhador],
                    limit: 10,
                    offset: ((page -1) * 10)
                });

                res.header('X-Total-Count', pedidos.count);

                return res.status(200).json(pedidos.rows);
            }else{
                const pedidos = await connection.mysqlPedidos.findAndCountAll({
                    where:{
                        trabalhadores_id: usuarioId
                    },
                    include: [connection.mysqlUsuarios, connection.mysqlTrabalhador],
                    limit: 10,
                    offset: ((page -1) * 10)
                });

                res.header('X-Total-Count', pedidos.count);

                return res.status(200).json(pedidos.rows);
            }
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    
    async create(req, res){
        try{
            const {descricao, localizacao, usuario} = req.body;

            const data = {
                id_pedido: uuid.v4(),
                descricao: descricao,
                data_criacao: Date.now(),
                localizacao: localizacao,
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
    async demand(req, res){
        try{
            const {id, trabalhador, valor_fechado} = req.body;

            const pedido = await connection.mysqlPedidos.findOne({where:{id_pedido: id}});

            pedido.valor_fechado = valor_fechado;
            pedido.trabalhadores_id = trabalhador;

            await pedido.save();

            return res.status(202).json({mensagem: "Cobrança feita, aguarde seu pagamento"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async dispatch(req, res){
        try{
            const {id} = req.params;

            const pedido = await connection.mysqlPedidos.findOne({where:{id_pedido: id}});

            pedido.valor_fechado = null;
            pedido.trabalhadores_id = null;

            await pedido.save();

            return res.status(202).json({mensagem: "Pedido recusado com sucesso"});
            
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async pay(req, res){
        try{
            const {id} = req.params;

            const pedido = await connection.mysqlPedidos.findOne({where:{id_pedido: id}});

            pedido.data_conclusao = Date.now()

            await pedido.save();

            return res.status(202).json({mensagem: "Pagamento efetuado"});
            
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    }
}