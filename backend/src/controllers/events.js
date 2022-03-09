// Import the database module which contains the models
const database = require('../database');

// Lists Event entries in the database and returns them
// in the response body with status code 200
exports.list = async (ctx) => {

    const sensor_id = ctx.request.params.sensor_id;
    const options = {};
    const query = {
        where: {
            sensor_id: sensor_id
        }
    }
    const sensors = {
        attributes: ['sensor_id']
    }

    let events = null;

    switch(sensor_id){
        case 'all':
            events = await database.Event.findAll(options);
            break;
       case 'sensors':
            events = await database.Event.findAll(sensors);

            if(events == null){ break; }

            const parsed = [];

            events.forEach(event => {
                const id = event.sensor_id;

                if(!parsed.includes(id)){
                    parsed.push(id);
                }
            });

            events = parsed;

            break;
        default:
            events = await database.Event.findAll(query);
            break;
    }


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
