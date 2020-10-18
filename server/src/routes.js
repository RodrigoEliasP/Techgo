const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const tecnicosController = require('./controllers/tecnicosController');
const usuariosController = require('./controllers/usuariosController');
const pedidosController = require('./controllers/pedidosController');

const routes = express.Router();

routes.get('/', (req, res) =>{
    res.sendStatus(200).json({message: "api on"})
});

// rotas dos técnicos

routes.get('/tecnicosGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}), tecnicosController.index);

routes.post('/tecnicosPost', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cpf: Joi.string().required().length(11),
        nome: Joi.string().required().min(10).max(80),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6),
        categoria: Joi.number()
    })
}), tecnicosController.create);

// rotas dos usuarios

routes.get('/usuariosGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}), usuariosController.index);

routes.post('/usuariosPost', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cpf: Joi.string().required().length(11),
        nome: Joi.string().required().min(10).max(80),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6)
    })
}), usuariosController.create);

//rotas dos pedidos

routes.get('/pedidosGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}), pedidosController.index);

routes.post('/pedidosPost', celebrate({
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required(),
        usuario: Joi.string().required().uuid(),
    })
}), pedidosController.create);


module.exports = routes;