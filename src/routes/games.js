const Router = require('koa-router');
const { route } = require('./authentication');

const router = new Router();

const colors = {
  1: 'red',
  2: 'green',
  3: 'yellow',
  4: 'blue',
};

const basePositions = {
  1: 1,
  2: 15,
  3: 29,
  4: 43,
};

const enterPositions = {
  1: 56,
  2: 14,
  3: 28,
  4: 42,
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
    const { game_code, user_name} = ctx.request.body;

    // Comprobamos si existe el jugador
    console.log(user_name, game_code);
    // por primary key (id de player)
    // const player = await ctx.orm.Player.findByPk(player_id);
    const user = await ctx.orm.User.findOne({ where: { name: user_name } });
    const player = await ctx.orm.Player.findOne({ where: { user_id: user.id } });
    console.log(user_name);
    if (!player) {
      ctx.body = { error: 'Player not found' };
      ctx.status = 404;
      return;
    }

    // Crear una nueva instancia de Juego
    const game = await ctx.orm.Game.create({ game_code: '1234' });

    // Crear una nueva instancia de Participante con el jugador como creador
    await ctx.orm.Participant.create({
      player_id: player.id,
      game_id: game.id,
      number: 1, // El número de jugador puede ser establecido por el orden
      // de llegada o de alguna otra forma
      color: 'red', // Esto es un placeholder. El color puede ser seleccionado de alguna otra forma.
    });

    // Creador del juego siempre será rojo y tendrá como base_position el valor 1
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
        color: 'red'
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
router.post('/:game_code/participants', async (ctx) => {
  try {
    // Obtener el id del juego de la ruta
    const { game_code } = ctx.params;

    // Obtener el id del jugador del cuerpo de la solicitud
    const { playerId } = ctx.request.body;
    console.log("QUEE");
    // Buscar el juego en la base de datos
    const game = await ctx.orm.Game.findOne({ where: { game_code } });
    if (!game) {
      ctx.body = 'Juego no encontrado';
      ctx.status = 404;
      return;
    }
    
    const gameId = game.id;

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
        color: color
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


// Encuentra el id de un game según el nombre de un usuario:
// Get the game ID by participant's username
router.get('games.getGameCode', '/:userName', async (ctx) => {
  try {
    const { userName } = ctx.params;
    const user = await ctx.orm.User.findOne({ where: { name: userName } });
    const player = await ctx.orm.Player.findOne({ where: { user_id: user.id } });
    const participant = await ctx.orm.Participant.findOne({ where: { player_id: player.id } });

    if (!participant) {
      ctx.body = 'Participant not found';
      ctx.status = 404;
      return;
    }

    const game = await ctx.orm.Game.findOne({ where: { id: participant.game_id } });
    ctx.body = { gameCode: game.game_code };
    ctx.status = 200;
  } catch (error) {
    
    ctx.body = error;
    ctx.status = 400;
  }
});


// Entrega el estado de un game específico
router.get('games.show', '/all/:gameCode', async (ctx) => {
  try {
    const { gameCode } = ctx.params;
    
    const game = await ctx.orm.Game.findOne({ where: { game_code: gameCode } });
    const participants = await ctx.orm.Participant.findAll({ where: { game_id: game.id } });
    const pieces = await ctx.orm.Piece.findAll({ where: { game_id: game.id } });

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



