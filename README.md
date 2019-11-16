# Unofficial StockX API
![version](https://img.shields.io/npm/v/stockx-api "Version")
![npm](https://img.shields.io/npm/dt/stockx-api.svg "Total Downloads")

Easy access to StockX's unofficial API through object oriented promises. If you have any issues, you can contact me through discord at `matthew#1232`. Feel free to use this however you want, as it is under the MIT license. I would love to see what projects you guys can come up with using this. If you'd like to contribute to this library, fork the repo, make your changes, and submit a pull request.

------

## Installation 
```
npm install stockx-api
```
Or with yarn,
```
yarn add stockx-api
```

------

## Features
* [x] Account login
* [x] Placing asks
* [x] Updating asks
* [x] Placing bids
* [x] Updating bids
* [x] Products search
* [x] Product query
* [ ] Removing asks
* [ ] Listing all asks
* [ ] Removing bids
* [ ] Listing all bids
* [ ] Product monitoring

## Basic use
```js
import { StockX } from 'stockx-api';

const stockXController = new StockX();

(async () => {
    try {
        console.log('Logging in...');
        
        //Logs in using account email and password
        await stockXController.user.login({
            user: 'accountemailhere', 
            password: 'accountpassword'
        });
        
        console.log('Successfully logged in!');

        //Returns an array of products
        const productList = await stockXController.products.search('yeezy');
        
        //Fetch variants and product details of the first product
        const product = await stockXController.products.fetch(productList[0]);
        
        console.log('Placing an ask for ' + product.name);

        //Places an ask on that product
        const ask = await stockXController.asks.place(product, {
            amount: 5000000000, 
            size: '9.5'
        });
        
        console.log('Successfully placed an ask for $5000 for ' + product.name);
        
        //Updates the previous ask
        await stockXController.asks.update(ask, {
            amount: 600000
        });
        
        console.log('Updated previous ask!');
    }
    catch(e){
        console.log('Error: ' + e.message);
    }
})();
```

------

## Customization
stockx-api accepts a few parameters in the class options
* proxy - sets the proxy to be used with all requests being made (ip:port:user:pass)
* currency - sets the currency to be used when placing asks/bids

For example:
```js
import { StockX } from 'stockx-api';

const stockXController = new StockX({
    proxy: 'http://127.0.0.1:80',
    currency: 'USD' // GBP, EUR, USD
});
```

------

## Products

#### Search
You can directly use Stockx's search API by using the `search` method. This takes in one parameter - the search query.
There is also an optional `options` parameter, in which you can pass in:
* limit - limits the amount of search results returned.

For example:
```js
import { StockX } from 'stockx-api';

const stockXController = new Stockx();

(async () => {
    try {
        const products = await stockXController.products.search('yeezy', { limit: 5 });

        console.log(products);
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
    }
})();
```

#### Query 
You can scrape the variants and basic product information using the `details` method. You can either pass in a previously fetched product from the `search` method or use the link to the product.

For example:
```js
import { StockX } from 'stockx-api';

const stockXController = new Stockx();

(async () => {
    try {
        const product = await stockXController.products.details('https://stockx.com/adidas-yeezy-boost-700-magnet');

        console.log(product);
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
    }
})();
```

------

## User

#### Login
You can login to StockX by using the `login` method. This takes in 2 parameters in the object
* user - The account email/username
* password - The account password

For example:
```js
import { StockX } from 'stockx-api';

const stockXController = new Stockx();

(async () => {
    try {
        const reply = await stockXController.user.login({
            username: 'accountemailhere',
            password: 'accountpasswordhere',
        });

        console.log(reply);
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
    }
})();
```

------

## Asks

#### Place
You can place an ask to stockX by using the `place` method. This takes in 3 parameters.
* product - the product details

In the object:
* amount - the price of the ask
* size - the requested size

For example: 
```js
import { StockX } from 'stockx-api';

const stockXController = new Stockx();

(async () => {
    try {
        const reply = await stockXController.asks.login({
            username: 'accountemailhere',
            password: 'accountpasswordhere',
        });

        console.log('Logged in!');

        //Pull product details to place the ask
        const product = await stockXController.products.details('https://stockx.com/adidas-yeezy-boost-700-magnet');

        console.log('Placing an ask for ' + product.name);

        //Place an ask on the product
        await stockXController.asks.place(product, {
            amount: 5000000000, 
            size: 'random'
        });
        
        console.log(`Successfully placed an ask for $5000000000 [${product.name}]`);
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
    }
})();
```

#### Update
You can edit a previously placed ask by using the `update` method. This takes in 2 parameters.
* ask - the ask to update

In the object:
* amount - the price to set the ask to

For example: 
```js
const stockxAPI = require('stockx-api');
const stockX = new stockxAPI();

(async () => {
    console.log('Logging in...');

    //Logs in before placing ask
    await stockX.login({
        user: 'accountemailhere', 
        password: 'accountpassword'
    });

    console.log('Successfully logged in!');
    
    //Pull product details to place the ask
    const product = await stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet');

    console.log('Placing a bid for ' + product.name);

    //Place an ask on that product
    const ask = await stockX.placeBid(product, {
        amount: 100000, 
        size: '9.5'
    });
    
    console.log(`Successfully placed an ask for $100000 [${product.name}]`);

    //Update previously placed ask
    await stockX.updateAsk(ask, {
        amount: 10000000
    });
    
    console.log('Updated ask!');
})();
```

------

## Bids

#### Place
You can place a bid to stockX by using the `place` method. This takes in 3 parameters, identical to placing an ask.
* product - the product details

In the object:
* amount - the price of the ask,
* size - the size of the shoe

For example: 
```js
import { StockX } from 'stockx-api';

const stockXController = new Stockx();

(async () => {
    try {
        const reply = await stockXController.asks.login({
            username: 'accountemailhere',
            password: 'accountpasswordhere',
        });

        console.log('Logged in!');

        //Pull product details to place the ask
        const product = await stockXController.products.details('https://stockx.com/adidas-yeezy-boost-700-magnet');

        console.log('Placing an ask for ' + product.name);

        //Place a bid on that product
        await stockXControler.bids.place(product, {
            amount: 100, 
            size: '9.5'
        });
        
        console.log(`Successfully placed a bid for $100 [${product.name}]`);
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
    }
})();
```

#### Update
You can edit a previously placed bid by using the `update` method. This takes in 2 parameters.
* bid - the bid to update

In the object:
* amount - the price to set the bid to

For example: 
```js
import { StockX } from 'stockx-api';

const stockXController = new Stockx();

(async () => {
    try {
        const reply = await stockXController.asks.login({
            username: 'accountemailhere',
            password: 'accountpasswordhere',
        });

        console.log('Logged in!');

        //Pull product details to place the ask
        const product = await stockXController.products.details('https://stockx.com/adidas-yeezy-boost-700-magnet');

        console.log('Placing an bid for ' + product.name);

        //Place a bid on that product
        const bid = await stockXControler.bids.place(product, {
            amount: 100, 
            size: '9.5'
        });

        console.log(`Successfully placed a bid for $100 [${product.name}]`);

        //Place a bid on that product
        await stockXControler.bids.update(bid, {
            amount: 125, 
        });
        
        console.log(`Successfully updated bid for $125 [${product.name}]`);
    } catch (error) {
        console.log(error.message);
        console.log(error.status);
    }
})();
```

------

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

------

## Contributing
Please read [CONTRIBUTING.md]() for details on our code of conduct, and the process for submitting pull requests to us.

------

## Acknowledgements

* **matthew#1232** - *Initial work* - [matthew1232](https://github.com/matthew1232)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.