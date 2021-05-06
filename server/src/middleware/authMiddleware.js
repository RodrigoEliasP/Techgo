const jwt = require('jsonwebtoken');

const connection = require('../../models');

module.exports = async (req,res,next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.sendStatus(401);
    }

    const token = authorization.split(' ')[1];

    try{
        const tokenDecodificado = jwt.verify(token, process.env.APP_SECRET);
        const {id, tipo} = tokenDecodificado;
        const Ator = await connection[tipo].findOne({where:{id}});
        if(!Ator){
            throw new Error();
        }
        req.Id = tokenDecodificado.id;
        return next();
    }catch(e){
        return res.sendStatus(401);
    }
}