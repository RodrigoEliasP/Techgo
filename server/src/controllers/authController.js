const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {Op} = require('sequelize');

const connection = require('../../models');

module.exports = {
    async authTecnico(req, res){
        try{
            const {email, senha} = req.body;

            const sha = crypto.createHash('sha1')
            sha.update(senha);

            const tecnico = await connection.Trabalhador.findOne({
                attributes:['id','nome', 'pfp', 'email', 'status'],
                where:{
                    email,
                    senha: sha.digest('hex'),
                    status: {
                        [Op.or]: ['ativo','premium']
                    }
                },
                include: [connection.Categoria],
            });
            if(tecnico){
                const token = jwt.sign({id: tecnico.dataValues.id, tipo:"Trabalhador"}, process.env.APP_SECRET, {expiresIn:'1d'});
                return res.status(202).json({
                    usuario: tecnico.dataValues,
                    token
                });
            }else{
                throw new Error('Senha ou nome inválidos');
            }

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async authUsuario(req, res){
        try{
            const {email, senha} = req.body;

            const sha = crypto.createHash('sha1')
            sha.update(senha);

            const usuario = await connection.Usuario.findOne({
                attributes:['id', 'nome', 'pfp', 'email', 'status'],
                where:{
                    email: email,
                    senha: sha.digest('hex'),
                    status: 'ativo'
                }
            });

            if(usuario){
                const token = jwt.sign({id: usuario.dataValues.id, tipo:"Usuario"}, process.env.APP_SECRET, {expiresIn:'1d'});
                return res.status(202).json({
                    usuario: usuario.dataValues,
                    token
                });
            }else{
                throw new Error('Senha ou nome inválidos');
            }

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    }
}