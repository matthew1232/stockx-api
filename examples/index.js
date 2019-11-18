require('dotenv').config();

const { StockX } = require('../dist');

const { username, password } = process.env;

const stockXController = new StockX();
// if you're using charlesproxy, make sure it's launched and use the controller belo!
// const stockXController = new StockX({ proxy: '127.0.0.1:8888' });


// login to account
stockXController.user.login({ username, password }).then(loggedIn => {
    // product search and detail fetch
    stockXController.products.search('yeezy', { limit: 1 }).then(async res => {

        const productUrl = res[0].urlKey;
        console.log(productUrl);
        const product = await stockXController.products.details(productUrl);

        console.log('Placing an ask for ' + product.title);

        //Places an ask on that product
        const ask = await stockXController.asks.place(product, {
            amount: 5000000000, 
            size: '9.5'
        });
        console.log(ask);
    });
}).catch(console.error);

