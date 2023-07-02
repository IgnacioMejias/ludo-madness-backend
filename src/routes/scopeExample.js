const Router = require('koa-router');
const authUtils = require('../lib/auth/jwt');

const router = new Router();

router.get('/protectedUser', authUtils.isUser, async (ctx) => {
    ctx.body = {
        message: "Bienvenido a la ruta protegida con el scope user!", user: ctx.state.user
    }
});

router.get('/protectedAdmin', authUtils.isAdmin, async (ctx) => {
    ctx.body = {
        message: "Bienvenido a la ruta protegida con el scope admin!", user: ctx.state.user
    }
});

module.exports = router;