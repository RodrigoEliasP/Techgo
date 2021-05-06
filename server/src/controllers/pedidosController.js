const uuid = require('uuid');

const connection = require('../../models');

const objetosJoin = {
    usuario:
    {
        model: connection.Usuario,
        attributes:['id', 'pfp', 'nome','email','status','data_nascimento','data_registro']
    },
    trabalhador:
    {
        model: connection.Trabalhador,
        attributes:['id', 'pfp', 'nome','email','status','data_nascimento','data_registro'],
        include: [connection.Categoria]
    }
}

module.exports = {
    async search(req, res){
        try{
            const {page = 1} = req.query;
            
            const pedidos = await connection.Pedido.findAndCountAll({
                
                include: [objetosJoin.usuario, objetosJoin.trabalhador],
                where:{
                    status: 'pendente'
                },
                order:[
                    ['data_criacao','desc']
                ],
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
            const {Id} = req;
            const {page = 1, usuarioTipo, status} = req.query;

            if(usuarioTipo == "usuario"){

                const pedidos = await connection.Pedido.findAndCountAll({
                    where:{
                        usuarios_id: Id,
                        status
                    },
                    order:[
                        ['data_criacao','desc']
                    ],
                    include: [objetosJoin.usuario, objetosJoin.trabalhador],
                    limit: 10,
                    offset: ((page -1) * 10)
                });

                res.header('X-Total-Count', pedidos.count);

                return res.status(200).json(pedidos.rows);
            }else{
                const pedidos = await connection.Pedido.findAndCountAll({
                    where:{
                        trabalhadores_id: Id,
                        status
                    },
                    include: [objetosJoin.usuario, objetosJoin.trabalhador],
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
            const{Id} = req;
            const {descricao, localizacao} = req.body;

            const data = {
                id_pedido: uuid.v4(),
                descricao: descricao,
                data_criacao: Date.now(),
                localizacao: localizacao,
                data_conclusao: null,
                valor_fechado: null,
                status: 'pendente',
                trabalhadores_id: null,
                usuarios_id: Id
            }

            await connection.Pedido.create(data)


            return res.status(202).json({mensagem: "criado com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async demand(req, res){
        try{
            const {Id} = req; 
            const {id_pedido, valor_fechado} = req.body;

            

            const pedido = await connection.Pedido.findOne({where:{id_pedido}});

            pedido.valor_fechado = valor_fechado;
            pedido.trabalhadores_id = Id;
            pedido.status =  'cobrar';

            await pedido.save();

            return res.status(202).json({mensagem: "Cobrança feita, aguarde seu pagamento"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async dispatch(req, res){
        try{
            const {Id} = req;
            const {id_pedido} = req.params;

            const pedido = await connection.Pedido.findOne({where:{id_pedido, usuarios_id: Id}});
            if(!pedido){
                return res.status(401);
            }

            pedido.valor_fechado = null;
            pedido.trabalhadores_id = null;
            pedido.status =  'pendente';

            await pedido.save();

            return res.status(202).json({mensagem: "Pedido recusado com sucesso"});
            
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async pay(req, res){
        try{
            const {Id} = req;
            const {id_pedido} = req.params;

            const pedido = await connection.Pedido.findOne({where:{id_pedido, usuarios_id: Id}});
            if(!pedido){
                return res.status(401);
            }

            pedido.data_conclusao = Date.now()
            pedido.status = 'fechado'

            await pedido.save();

            return res.status(202).json({mensagem: "Pagamento efetuado"});
            
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async delete(req, res){
        try{
            const {Id} = req;
            const {id_pedido} = req.params;
            const pedido = await connection.Pedido.findOne({where:{id_pedido, usuarios_id: Id}});

            if(!pedido){
                return res.status(400);
            }

            await pedido.destroy();

            return res.status(202).json({mensagem: "Pedido cancelado"});
            
        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async put(req, res){
        try{
            const {Id} = req;
            const {id_pedido, localizacao, descricao} = req.body;

            const pedido = await connection.Pedido.findOne({where:{id_pedido, usuarios_id: Id}});
            if(!pedido){
                return res.status(401);
            }

            pedido.localizacao = localizacao;
            pedido.descricao = descricao;

            await pedido.save();

            return res.status(202).json({mensagem: "Alteração feita"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
}