// Import the database module which contains the models
const database = require('../database');

// Lists Event entries in the database and returns them
// in the response body with status code 200
exports.list = async (ctx) => {
  const options = {};

  const events = await database.Event.findAll(options);

  const response = {
    results: events,
  };

  ctx.body = response;
};

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
