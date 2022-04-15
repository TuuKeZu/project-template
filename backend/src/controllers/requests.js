const request = require('request');

exports.getRuokaLista = async (ctx) => {
    const { LunchMenus } = await getList();
    
    const response = {
        LunchMenus,
    }

    ctx.body = response;
}

const getList = async () => {
    return new Promise((resolve, reject) => {
        request('https://www.amica.fi/api/restaurant/menu/week?language=fi&restaurantPageId=330303&weekDate=2022-4-2', function (error, response, body) {
            if(error) return reject(error);
        
            return resolve(JSON.parse(body));
        });
    })
}
