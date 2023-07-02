const Router = require('koa-router');

const router = new Router();

// entrega todos los usuarios de la tabla de usuarios de la base de datos
router.get('users.list', '/', async (ctx) => {
  try {
    const users = await ctx.orm.User.findAll();
    ctx.body = users;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

// entrega un usuario, el especificado en el id de la ruta
router.get('user.show', '/:id', async (ctx) => {
  try {
    const user = await ctx.orm.User.findOne({ where: { id: ctx.params.id } });
    ctx.body = user;
    ctx.status = 200;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
