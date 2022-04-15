const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');

const chats = require('./controllers/chats');
const greeting = require('./controllers/greeting');
const events = require('./controllers/events');
const requests = require('./controllers/requests');

// Create a new Koa instance for our API
const app = new Koa();

// Export the instance for server.js to run
module.exports = app;

// Use the koa-logger middleware to display the summary of
// requests and responses in the console
app.use(logger());

// Set up CORS middleware to tell the browser
// that requests from all domains are allowed
app.use(cors({ credentials: true }));

// Set up JSON parsing for request bodies.
// Allows the use of `ctx.request.body
app.use(bodyParser());

// A Koa router for connecting endpoints to middleware. This router is
// called a "public router" as it has no authentication and is
// available for everyone on the insternet
const publicRouter = new Router({ prefix: '/api' });

// Connect endpoints to middleware
publicRouter.post('/chats', chats.create);
publicRouter.get('/chats', chats.list);

publicRouter.post('/events', events.create);
publicRouter.get('/events', events.setSensorQueryBySensorID, events.list);
publicRouter.get('/events/all', events.setSensorQueryAll, events.list);
publicRouter.get('/events/sensors', events.listSensors);
publicRouter.get('/events/:id', events.setSensorQueryByEventID, events.list);

publicRouter.get('/greeting', greeting.greet);
publicRouter.get('/ruokalista', requests.getRuokaLista);

// Add the router middleware to the Koa instance
app.use(publicRouter.routes());

// Add a middleware for responding to OPTIONS with a list of
// allowed methods
app.use(publicRouter.allowedMethods());
