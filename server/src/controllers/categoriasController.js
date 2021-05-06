const connection = require('../../models');

module.exports = {
    async index(req, res){
        try{
            const {page = 1} = req.query;
            
            const categorias = await connection.Categoria.findAndCountAll({
                limit: 10,
                offset: ((page -1) * 10),
            });

            return res.json(categorias.rows);

        }catch(e){
            return res.status(400).json({error: e.message});
        }
    }
}