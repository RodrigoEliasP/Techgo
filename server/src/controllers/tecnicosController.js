const uuid = require('uuid');
const fs = require('fs');
const crypto = require('crypto');
const {Op} = require('sequelize');

const connection = require('../../models');

module.exports = {
    async index(req, res){
        try{
            const {page = 1} = req.query;
            
            const tecnicos = await connection.Trabalhador.findAndCountAll({
                include: [connection.Categoria],
                limit: 10,
                offset: ((page -1) * 10),
                attributes:['id', 'nome', 'email', 'status', 'data_nascimento', 'Categoria_id']
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
            
            const existe = await connection.Trabalhador.findAll({where: {
                [Op.or]:{
                    nome,
                    cpf,
                    email
                }
            }});
            
            if(existe[0]){
                throw new Error('Email ou cpf já cadastrados');
            }

            await connection.Trabalhador.create(data);

            return res.status(202).json({mensagem: "cadastrado com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async delete(req, res){
        try{
            const {Id} = req;

            const usuario = await connection.Trabalhador.findOne({where:{
                id:Id
            }});
            usuario.status = 'inativo'
            await usuario.save();

            const imageDir = __dirname + '/../../public/uploads/';
            const fileName = Id+'.jpg';
            if(fs.readdirSync(imageDir).indexOf(fileName) !== -1)
                fs.unlinkSync(imageDir+fileName)
            
            return res.status(202).json({mensagem: "Conta apagada com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async premium(req,res){
        try{
            const {Id} = req;

            const usuario = await connection.Trabalhador.findOne({where:{
                id:Id
            }});
            usuario.status = 'premium'
            await usuario.save();
            
            return res.status(202).json({mensagem: "Conta vipada com sucesso"});

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    },
    async editPfp(req,res){
        try {
            const {Id} = req;
            const uploadDir = __dirname + '/../../public/uploads/';
            const fileName = Id+'.jpg';
            if(fs.readdirSync(uploadDir).indexOf(fileName) !== -1)
                fs.unlinkSync(uploadDir+fileName)
            req.files.image.mv(uploadDir + fileName, e=>{
                if(e){
                    console.error(e);
                }
            });
            const usuario = await connection.Trabalhador.findOne({where:{
                id:Id
            }});
            const pfpUrl = `http://${req.headers.host}/images/${usuario.id}.jpg`;
            usuario.pfp = pfpUrl
            usuario.save();
            res.status(200).json({mensagem: "foto alterada com sucesso"});
        } catch (e) {
            console.log(e.message)
            return res.status(400).json({error: e.message});
        }
    }
}
