// Import the database module which contains the models
const database = require('../database');

// Lists Event entries in the database and returns them
// in the response body with status code 200
exports.list = async (ctx) => {

    const { state } = ctx;

    const events = await database.Event.findAll(state.query);
    
    const response = {
        results: events,
    };

    ctx.body = response;
};

exports.listSensors = async (ctx) => {

    const { state } = ctx;

    const events = await database.Event.findAll(state.query);

    const sensors = [];

    events.forEach(event => {
        const sensor_id = event.sensor_id;

        if(!sensors.includes(sensor_id)){
            sensors.push(sensor_id);
        }
    })
    
    const response = {
        results: sensors,
    };

    ctx.body = response;
};

exports.setSensorQueryAll = (ctx, next) => {

    ctx.state = {
        query: { }
    }

    return next();
}


exports.setSensorQueryBySensorID = (ctx, next) => {
    const { sensor_id } = ctx.request.query;

    ctx.state = {
        query: { where: {sensor_id} }
    }

    return next();
}

exports.setSensorQueryByEventID = (ctx, next) => {
    const { id } = ctx.request.params;

    ctx.state = {
        query: { where: {id} }
    }

    return next();
}

// Creates a Chat entry in the database and returns it
// in the response body with status code 201.
// Fails with 500 if message was not provided
exports.create = async (ctx) => {
  const { body } = ctx.request;

  const { temperature, humidity, sensor_id } = body;

  const event = await database.Event.create({
    temperature,
    humidity,
    sensor_id
  });

  ctx.body = event;
  ctx.status = 201;
};
