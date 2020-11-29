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

routes.delete('/tecnicosDelete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), tecnicosController.delete)
routes.patch('/tecnicosPremium/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), tecnicosController.premium)


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

routes.delete('/usuariosDelete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), usuariosController.delete)

routes.get('/pedidosGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}), pedidosController.index);

routes.get('/pedidosGet/own',celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive(),
        usuarioId: Joi.string().required(),
        usuarioTipo: Joi.string().required(),
        status: Joi.string().required()
    })
}), pedidosController.selectOwn)

routes.post('/pedidosPost', celebrate({
    [Segments.BODY]: Joi.object().keys({
        descricao: Joi.string().required(),
        usuario: Joi.string().required().uuid(),
        localizacao: Joi.string().required()
    })
}), pedidosController.create);

routes.put('/pedidosDemand', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        valor_fechado: Joi.number().positive(),
        trabalhador: Joi.string().required()
    })
}), pedidosController.demand);

routes.put('/pedidosPut', celebrate({
    [Segments.BODY]: Joi.object().keys({
        id: Joi.string().required(),
        descricao: Joi.string().required(),
        localizacao: Joi.string().required()
    })
}), pedidosController.put);

routes.patch('/pedidosPay/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), pedidosController.pay);

routes.patch('/pedidosDelete/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), pedidosController.delete);

routes.patch('/pedidosDispatch/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required()
    })
}), pedidosController.dispatch);

routes.get('/categoriasGet', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number().positive()
    })
}),  categoriasController.index)


module.exports = routes;