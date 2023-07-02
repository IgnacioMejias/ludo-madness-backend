const Router = require('koa-router');
const users = require('./routes/users');
const players = require('./routes/players');
const games = require('./routes/games');
const moves = require('./routes/moves');
const authRoutes = require('./routes/authentication');
const scopeProtectedRoutes = require('./routes/scopeExample');
const jwtMiddleware = require('koa-jwt');
const dotenv = require('dotenv');
const router = new Router();
dotenv.config();


router.use('/players', players.routes());

router.use('/games', games.routes());

router.use('/games/:gameId', moves.routes());

router.use(authRoutes.routes());
// rutas protegidas por jwt
router.use(jwtMiddleware({ secret: process.env.JWT_SECRET }));
// las requests que pasen por este middleware deben tener un jwt
router.use('/users', users.routes());
router.use('/scope-example', scopeProtectedRoutes.routes());

module.exports = router;
