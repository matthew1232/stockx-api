require('dotenv').config();

const { StockX } = require('../dist');

const { password } = process.env; // .env

const stockXController = new StockX();
// if you're using charlesproxy, make sure it's launched and use the below proxy!
// const stockXController = new StockX({ proxy: '127.0.0.1:8888' });

// product search and detail fetch
// stockXController.products.search('yeezy', { limit: 1 }).then(async res => {

//     const productUrl = res[0].urlKey;

//     const details = await stockXController.products.details(productUrl);
//     console.log(details);
// });

// login to account
stockXController.user.login({ username: 'test@test.com', password }).then(res => {

}).catch(console.error);

