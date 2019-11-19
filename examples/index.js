require('dotenv').config();

const StockX = require('../dist').default;

const { username, password } = process.env;

const stockXController = new StockX({ currency: 'AUD' });
// if you're using charlesproxy, make sure it's launched and use the controller below!
// const stockXController = new StockX({ proxy: '127.0.0.1:8888' });

stockXController.user
  .login({ username, password })
  .then(() => stockXController.products.search('yeezy', { limit: 1 }))
  .then(([ { urlKey: productUrl }]) =>
  {
    console.log(productUrl);
    return stockXController.products.details(productUrl);
  })
  .then(product =>
  {
    console.log('Placing an ask for ' + product.title);

    //Places an ask on that product
    return stockXController.asks.place(product, { amount: 5000000000, size: '9.5' });
  })
  .then(ask => 
  {
    console.log(`Successfully placed ask: ${ask.chainId}!`);

    return stockXController.asks.update(ask, { amount: 50000000 });
  })
  .then(updatedAsk => 
  {
    console.log(`Successfully updated ask: ${updatedAsk.chainId}`)
  })
  .catch(console.error);

