const Koa = require('koa');
const KoaLogger = require('koa-logger');
const { koaBody } = require('koa-body');
const cors_2 = require('koa2-cors');
const cors = require('@koa/cors');
const router = require('./routes');
const orm = require('./models');

// Crear instancia de Koa
const app = new Koa();

// Exponer el orm a la app
app.context.orm = orm;

// Middlewares proporcionados por Koa
app.use(cors());
app.use(KoaLogger());
app.use(koaBody());

// koa router
app.use(router.routes());

module.exports = app;
