const Router = require('koa-router');

const router = new Router();

const pieceStatus = {
  0: 'home',
  1: 'safe',
  2: 'onBoard',
  3: 'finalRow',
  4: 'finished',
};

// en la ruta recibe el id del game, en el body recibe el id del jugador,
// el id de la ficha y el valor del dado
// {
//     "playerId": 1,
//     "pieceId": 1,
//     "diceValue": 6
// }
router.post('/moves', async (ctx) => {
  try {
    // Obtiene el ID del juego desde la ruta
    const { gameId } = ctx.params;

    // Obtiene el ID del participante y el ID de la ficha desde el cuerpo de la solicitud
    const { playerId, pieceId, diceValue } = ctx.request.body;

    // Encuentra la ficha especificada
    const piece = await ctx.orm.Piece.findOne({
      where: {
        id: pieceId,
        player_id: playerId,
        game_id: gameId,
      },
    });

    // Encontramos todas las fichas para trabajar con choques
    const pieces = await ctx.orm.Piece.findAll({ where: { game_id: gameId } });

    // Si no se encuentra la ficha, envía un error
    if (!piece) {
      ctx.throw(404, 'No se encontró la ficha solicitada.');
    }

    console.log(diceValue);
    // Si la ficha está en la base (position = 0) y el valor del dado no es 6, no se puede mover
    if (piece.position === 0 && diceValue !== 6) {
      ctx.throw(400, 'La ficha está en la base y no ha salido un 6 en el dado.');
    }

    let newPosition = 0;
    // Si el dado tiene un valor de 6 y la pieza se encuentra en la posición 0, asignamos
    // la posición a la posición base de la pieza
    if (diceValue === 6 && piece.position === 0) {
      newPosition = piece.base_position;
    } else {
    // Para valor distinto a 6 calcula la nueva posición de la ficha basándose en el valor del dado
      newPosition = piece.position + diceValue;
    }

    // Actualiza la posición de la ficha
    if (piece.status !== pieceStatus[3] && piece.status !== pieceStatus[4]) {
      piece.position = newPosition;
      if (piece.position === 0) {
        piece.status = 'home';
      } else if (piece.position === piece.base_position) {
        piece.status = 'safe';
      } else if (piece.position > piece.enter_position && piece.position < piece.base_position) {
        piece.status = 'finalRow';
        // 5 - (39 - 38 -1) // 5 - 0
        piece.left_to_finish -= (piece.position - piece.enter_position - 1);
        piece.position = piece.enter_position;
        if (piece.left_to_finish === 0) {
          console.log('¡La pieza llegó a la meta!');
          piece.status = 'finished';
        }
      } else if (piece.position >= 53) {
        // definir cantidad de casillas en el mapa (sin contar las extra) en .env o en algún lado
        piece.position -= 52;
      } else {
        piece.status = 'onBoard';
      }

      pieces.forEach((pieceCheck) => {
        if (pieceCheck.player_id !== piece.player_id) {
          if (pieceCheck.position === piece.position) {
            if (piece.status !== 'finalRow' && pieceCheck.status === 'safe') {
              ctx.throw(400, 'La ficha intentó devorar a una ficha que está en su safe position.');
              if (piece.position === 1) {
                piece.position = 52 - diceValue + 1;
              } else {
                piece.position -= diceValue;
              }
            }
          }
        }
      });
    } else if (piece.status === pieceStatus[3]) {
      if (piece.left_to_finish - diceValue >= 0) {
        piece.left_to_finish -= diceValue;
        if (piece.left_to_finish === 0) {
          console.log('¡La pieza llegó a la meta!');
          piece.status = 'finished';
        }
      }
    }

    let eatedId = -1;
    // elimina una ficha si cae encima
    pieces.forEach(async (pieceCheck) => {
      if (pieceCheck.player_id !== piece.player_id) {
        if (pieceCheck.position === piece.position) {
          if (piece.status !== 'finalRow' && pieceCheck.status === 'onBoard') {
            pieceCheck.position = 0;
            pieceCheck.status = 'home';
            console.log('¡La pieza devoró a otra pieza!');
            eatedId = pieceCheck.id;
          }
        }
      }
      await pieceCheck.save();
    });

    // Atrapar errores por tratar de mover a una ficha que ya gano

    await piece.save();

    // Crea un nuevo movimiento asociado con el participante y el juego
    const move = await ctx.orm.Move.create({
      player_id: playerId, piece_id: pieceId, position: piece.position, dice_value: diceValue,
    });

    // Cuerpo de la respuesta
    if (eatedId === -1) {
      ctx.body = { piece, move };
      ctx.status = 201;
    } else {
      const pieceEated = await ctx.orm.Piece.findOne({ where: { id: eatedId, game_id: gameId } });
      ctx.body = { piece, move, pieceEated };
      ctx.status = 201;
    }
  } catch (error) {
    ctx.body = error;
    ctx.status = 400;
  }
});

module.exports = router;
