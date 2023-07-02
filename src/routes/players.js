const Router = require('koa-router');

const router = new Router();

// crear el jugador. Una vez conectado con el frontend, cuando el usuario
// presione play se debe crear un jugador asociado a ese usuario
// espera recibir el id del usuario que crea el jugador, como user_id
/*
{
    "user_id": 1
}

*/
router.post('players.create', '/', async (ctx) => {
  try {
    const existingPlayer = await ctx.orm.Player.findOne({
      where: {
        user_id: ctx.request.body.user_id,
      },
    });

    if (existingPlayer) {
      ctx.body = { error: 'Player already exists' };
      ctx.status = 400;
      return;
    }
    // Crear una nueva instancia de jugador

    const player = await ctx.orm.Player.create({

      // por ahora se recibe el id del usuario tal cual, pero en el futuro se
      // debería recibir el token y buscar el usuario asociado
      user_id: ctx.request.body.user_id,
      score: 0, // inicializa el puntaje en 0
    });

    // Cuerpo de la respuesta
    ctx.body = player;
    ctx.status = 201;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
