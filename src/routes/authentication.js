const Router = require('koa-router');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

const router = new Router();

// recibira un objeto del estilo 
// {
//   "name": "name",
//   "email": "email",
//   "password": "password"
// }

router.post("authentication.signup", "/signup", async (ctx) => {
    console.log("huhu");
    const authInfo = ctx.request.body;
    let user = await ctx.orm.User.findOne({ where: { email: authInfo.email } });
    if (user) {
        ctx.body = { error: `User by mail '${authInfo.email}'already exists` };
        ctx.status = 400;
        return;
    }
    try {

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(authInfo.password, saltRounds);
        user = await ctx.orm.User.create({
            name: authInfo.name,
            email: authInfo.email,
            password: hashPassword,
        });
    } catch (error) {
        ctx.body = { error };
        ctx.status = 400;
        return;
    }
    ctx.body = {
        name: user.name,
        email: user.email,
    };
    ctx.status = 201;
});

// login

router.post("authentication.login", "/login", async (ctx) => {
    let user;
    const authInfo = ctx.request.body
    try {
        user = await ctx.orm.User.findOne({ where: { email: authInfo.email } });
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
        return;
    }
    if (!user) {
        ctx.body = { error: `User by mail '${authInfo.email}' does not exist` };
        ctx.status = 400;
        return;
    }
    const validPassword = await bcrypt.compare(authInfo.password, user.password);
    if (validPassword) {
        ctx.body = {
            name: user.name,
            email: user.email,
        };
        ctx.status = 200;
    } else {
        ctx.body = { error: `Wrong password` };
        ctx.status = 400;
        return;

    }

    // creamos el JWT. 
    // el payload es un objeto que contiene la información que queremos que viaje en el JWT
    const expirationSeconds = 60 * 60 * 24; // 1 day
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET; 
    var token = jwt.sign(
        { scope: ['user'] }, // payload, esto es lo que hay que variar segun el tipo de usuario (admin, user, etc)
        JWT_PRIVATE_KEY, // secret
        {subject: user.id.toString()},
        { expiresIn: expirationSeconds } // options
    );

    ctx.body = { 
        "name": user.name,
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": expirationSeconds
     };

    ctx.status = 200;

});
    


module.exports = router; 