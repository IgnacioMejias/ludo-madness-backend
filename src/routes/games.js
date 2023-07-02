const Router = require('koa-router');

const router = new Router();

const colors = {
  1: 'yellow',
  2: 'green',
  3: 'red',
  4: 'blue',
};

const basePositions = {
  1: 1,
  2: 14,
  3: 27,
  4: 40,
};

const enterPositions = {
  1: 51,
  2: 12,
  3: 25,
  4: 38,
};

const pieceStatus = {
  0: 'home',
  1: 'onBoard',
  2: 'finalRow',
  3: 'finished',
};

// crear el juego. Una vez conectado con el frontend, cuando el usuario
// presione create game se debe crear un juego asociado a ese usuario
// espera recibir el id del usuario que crea el juego, como creator_id
router.post('games.create', '/', async (ctx) => {
  try {
    const { userId } = ctx.request.body;

    // Comprobamos si existe el jugador

    // por primary key (id de player)
    // const player = await ctx.orm.Player.findByPk(player_id);

    const player = await ctx.orm.Player.findOne({ where: { user_id: userId } });

    if (!player) {
      ctx.body = { error: 'Player not found' };
      ctx.status = 404;
      return;
    }

    // Crear una nueva instancia de Juego
    const game = await ctx.orm.Game.create({});

    // Crear una nueva instancia de Participante con el jugador como creador
    await ctx.orm.Participant.create({
      player_id: player.id,
      game_id: game.id,
      number: 1, // El número de jugador puede ser establecido por el orden
      // de llegada o de alguna otra forma
      color: 'red', // Esto es un placeholder. El color puede ser seleccionado de alguna otra forma.
    });

    // Creador del juego siempre será amarillo y tendrá como base_position el valor 1
    // Crea las 4 fichas para este participante
    for (let i = 0; i < 4; i += 1) {
      await ctx.orm.Piece.create({
        player_id: player.id,
        game_id: game.id,
        base_position: basePositions[1],
        enter_position: enterPositions[1],
        position: 0,
        status: pieceStatus[0],
        left_to_finish: 5,
        number: i + 1,
      });
    }

    // Cuerpo de la respuesta
    ctx.body = game;
    ctx.status = 201;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

// unirse a partida en espera. Cuando un jugador presione join game,
// se debe crear un participante asociado a ese jugador y a ese juego
// espera recibir el id del jugador que se une, como player_id en el
// body, y el id del juego al que se une, como game_id en los params

//  Por ejemplo, si un jugador con id 2 quiere unirse a un juego con id 1,
// se enviaría una petición POST a /games/1/participants con el siguiente cuerpo:
/*
{
    "playerId": 2
}

*/

// REVISAR Y PROBAR ESTE ENDPOINT
router.post('/:gameId/participants', async (ctx) => {
  try {
    // Obtener el id del juego de la ruta
    const { gameId } = ctx.params;

    // Obtener el id del jugador del cuerpo de la solicitud
    const { playerId } = ctx.request.body;

    // Buscar el juego en la base de datos
    const game = await ctx.orm.Game.findByPk(gameId);
    if (!game) {
      ctx.body = 'Juego no encontrado';
      ctx.status = 404;
      return;
    }

    // Buscar al jugador en la base de datos
    const player = await ctx.orm.Player.findOne({ where: { id: playerId } });

    if (!player) {
      ctx.body = 'Jugador no encontrado';
      ctx.status = 404;
      return;
    }

    // Buscar el número de participantes existentes en el juego
    const participants = await ctx.orm.Participant.count({ where: { game_id: gameId } });
    if (participants >= 4) {
      ctx.body = 'El juego ya está lleno';
      ctx.status = 400;
      return;
    }

    // Asignar un número y un color al nuevo participante
    const number = participants + 1;
    const color = colors[number];
    // agregamos la posicion base por color
    const basePosition = basePositions[number];
    const enterPosition = enterPositions[number];

    // Crear un nuevo participante
    const participant = await ctx.orm.Participant.create({
      player_id: playerId,
      game_id: gameId,
      number,
      color,
    });

    // Crea las 4 fichas para este participante
    for (let i = 0; i < 4; i += 1) {
      // modificado, agregamos base_position
      await ctx.orm.Piece.create({
        player_id: player.id,
        game_id: gameId,
        base_position: basePosition,
        enter_position: enterPosition,
        position: 0,
        status: pieceStatus[0],
        left_to_finish: 5,
        number: i + 1,
      });
    }

    // Cuerpo de la respuesta
    ctx.body = participant;
    ctx.status = 201;
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

// Entrega el estado de un game específico
router.get('games.show', '/:gameId', async (ctx) => {
  try {
    const { gameId } = ctx.params;
    const participants = await ctx.orm.Participant.findAll({ where: { game_id: gameId } });
    const pieces = await ctx.orm.Piece.findAll({ where: { game_id: gameId } });

    const gameData = {};

    participants.forEach((participant, index) => {
      const playerData = {};
      const playerPieces = pieces.filter((piece) => piece.player_id === participant.player_id);

      playerPieces.forEach((piece, pieceIndex) => {
        playerData[`piece${pieceIndex + 1}`] = {
          // Add desired properties from the piece object
          piece,
          // Add more properties as needed
        };
      });
      gameData[`player${index + 1}`] = playerData;
    });

    ctx.body = {
      state: gameData,
      status: 201,
    };
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
