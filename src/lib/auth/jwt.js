var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// para sacar el scope del token, y saber si es admin o user
function getJWTScope(token) {
  const secret = process.env.JWT_SECRET; // JWT_SECRET is inside .env file 
  var payload = jwt.verify(token, secret); // payload is the decoded JWT token 
  return payload.scope; // return the scope from the decoded JWT token
}

async function isUser(ctx, next) {
    await next();
    // como es de la forma Bearer <token>, lo separamos y tenemos el token 
    var token = ctx.request.headers.authorization.split(' ')[1];
    var scope = getJWTScope(token);
    ctx.assert(scope.includes('user'), 403, 'You are not a registered user');
}

async function isAdmin(ctx, next) {
    await next();
    var token = ctx.request.headers.authorization.split(' ')[1];
    var scope = getJWTScope(token);
    ctx.assert(scope.includes('admin'), 403, 'You are not a registered admin');
}

module.exports = { isUser, isAdmin }; // export the middleware functions 