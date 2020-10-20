const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const tecnicosController = require('./controllers/tecnicosController');
const usuariosController = require('./controllers/usuariosController');
const pedidosController = require('./controllers/pedidosController');
const categoriasController = require('./controllers/categoriasController');

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
        nascimento: Joi.date().required(),
        categoria: Joi.number().required(),
    })
}), tecnicosController.create);

routes.post('/tecnicoLog', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        senha: Joi.string().required()
    })
}), tecnicosController.log);

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
        senha: Joi.string().required().min(6),
        nascimento: Joi.date().required()
    })
}), usuariosController.create);

routes.post('/usuarioLog', celebrate({
    [Segments.BODY]: Joi.object().keys({
        nome: Joi.string().required(),
        senha: Joi.string().required()
    })
}), usuariosController.log);
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

// categorias
routes.get('/categoriasGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}),  categoriasController.index)


module.exports = routes;