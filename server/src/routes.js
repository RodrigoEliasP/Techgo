const express = require('express');
const {celebrate, Segments, Joi} = require('celebrate');

const authController = require('./controllers/authController');
const tecnicosController = require('./controllers/tecnicosController');
const usuariosController = require('./controllers/usuariosController');
const pedidosController = require('./controllers/pedidosController');
const categoriasController = require('./controllers/categoriasController');

const authMiddleware = require('./middleware/authMiddleware');
const imageMiddleware = require('./middleware/imageMiddleware');

const routes = express.Router();

routes.get('/', (req, res) =>{
    res.sendStatus(200).json({message: "api on"})
});

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
        email: Joi.string().required().email(),
        senha: Joi.string().required()
    })
}), authController.authTecnico);

routes.patch('/tecnicosPfp/', authMiddleware, imageMiddleware, tecnicosController.editPfp);

routes.delete('/tecnicosDelete/', authMiddleware, tecnicosController.delete)
routes.patch('/tecnicosPremium/', authMiddleware, tecnicosController.premium)


routes.get('/usuariosGet/', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}), usuariosController.index);

routes.post('/usuariosPost/', celebrate({
    [Segments.BODY]: Joi.object().keys({
        cpf: Joi.string().required().length(11),
        nome: Joi.string().required().min(10).max(80),
        email: Joi.string().required().email(),
        senha: Joi.string().required().min(6),
        nascimento: Joi.date().required()
    })
}), usuariosController.create);

routes.patch('/usuariosPfp/', authMiddleware, imageMiddleware, usuariosController.editPfp);

routes.post('/usuarioLog/', celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().required().email(),
        senha: Joi.string().required()
    })
}), authController.authUsuario);

routes.delete('/usuariosDelete/', authMiddleware, usuariosController.delete)

routes.get('/pedidosGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}), pedidosController.search);

routes.get('/pedidosGet/own',celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive(),
        usuarioTipo: Joi.string().required(),
        status: Joi.string().required()
    })
}), authMiddleware, pedidosController.selectOwn)

routes.post('/pedidosPost', celebrate({
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required(),
        localizacao: Joi.string().required()
    })
}), authMiddleware, pedidosController.create);

routes.put('/pedidosDemand', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id_pedido: Joi.string().required().uuid(),
        valor_fechado: Joi.number().positive()
    })
}), authMiddleware, pedidosController.demand);

routes.put('/pedidosPut', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id_pedido: Joi.string().required().uuid(),
        descricao: Joi.string().required(),
        localizacao: Joi.string().required()
    })
}), authMiddleware, pedidosController.put);

routes.patch('/pedidosPay/:id_pedido', authMiddleware, pedidosController.pay);

routes.delete('/pedidosDelete/:id_pedido', authMiddleware, pedidosController.delete);

routes.patch('/pedidosDispatch/:id_pedido', authMiddleware, pedidosController.dispatch);

routes.get('/categoriasGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}),  categoriasController.index)


module.exports = routes;