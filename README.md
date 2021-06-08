# stockx-api
![version](https://img.shields.io/npm/v/stockx-api "Version")
![npm](https://img.shields.io/npm/dt/stockx-api.svg "Total Downloads")

Easy access to StockX's unofficial API through object oriented promises. If you have any issues, you can contact me through discord at `matthew#5706`. Feel free to use this however you want, as it is under the MIT license. I would love to see what projects you guys can come up with using this. If you'd like to contribute to this library, fork the repo, make your changes, and submit a pull request.

#### 1.1.0 
- Changed `fetchProductDetails`, `newSearchProducts`, and `searchProducts` to a new request module. 
- All functions now support proxies. 
- `searchProducts` is deprecated and non-functional at the moment. 
- Fixed the `newSearchProducts` function

## Installation 
```
npm install stockx-api
```
Or with yarn,
```
yarn add stockx-api
```

# Features
* [x] Account login
* [x] Placing/updating/deleting asks
* [x] Placing/updating/deleting bids
* [x] Product searching
* [x] Variant scraping
* [ ] Product monitoring

# How to use
## Basic use
```js
const StockXAPI = require('stockx-api');
const stockX = new StockxAPI();

(async () => {
    try {
        console.log('Logging in...');
        
        //Logs in using account email and password
        await stockX.login({
            user: 'accountemailhere', 
            password: 'accountpassword'
        });
        
        console.log('Successfully logged in!');

        //Returns an array of products
        const productList = await stockX.newSearchProducts('yeezy');
        
        //Fetch variants and product details of the first product
        const product = await stockX.fetchProductDetails(productList[0]);
        
        console.log('Placing an ask for ' + product.name);

        //Places an ask on that product
        const ask = await stockX.placeAsk(product, {
            amount: 5000000000, 
            size: '9.5'
        });
        
        console.log('Successfully placed an ask for $5000 for ' + product.name);
        
        //Updates the previous ask
        await stockX.updateAsk(ask, {
            amount: 600000
        });
        
        console.log('Updated previous ask!');
    }
    catch(e){
        console.log('Error: ' + e.message);
    }
})();
```

## Customizing stockx-api
stockx-api accepts a few parameters in the class options
* proxy - sets the proxy to be used with all requests being made (ip:port:user:pass)
* currency - sets the currency to be used when placing asks/bids
* userAgent - sets the user agent for all requests

For example:
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI({
    proxy: 'proxyhere',
    currency: 'USD',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1'
});
```

## Searching for products (new version - recommended)
You can directly use Stockx's updated search API by using the `newSearchProducts` method. This takes in one parameter - the search query.
There is also an optional `options` parameter, in which you can pass in:
* limit - limits the amount of search results returned.

Keep in mind that if you have original code using old search method, you will need to adapt to the slightly different response this API provides. The benefit of using this new method is that there is no PerimeterX on the domain used to my knowledge.

For example:
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

stockX.newSearchProducts('yeezy', {
    limit: 5
})
.then(products => console.log(products))
.catch(err => console.log(`Error searching: ${err.message}`));
```

## Searching for products (old version)
You can directly use Stockx's search API by using the `searchProducts` method. This takes in one parameter - the search query.
There is also an optional `options` parameter, in which you can pass in:
* limit - limits the amount of search results returned.

For example:
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

stockX.newSearchProducts('yeezy', {
    limit: 5
})
.then(products => console.log(products))
.catch(err => console.log(`Error searching: ${err.message}`));
```

## Scraping product details
You can scrape the variants and basic product information using the `fetchProductDetails` method. You can either pass in a previously fetched product from the `searchProducts` method or use the link to the product.

For example:
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet')
.then(product => console.log(product))
.catch(err => console.log(`Error scraping product details: ${err.message}`));
```

## Logging in
You can login to stockX by using the `login` method. This takes in 2 parameters in the object
* user - The account email/username
* password - The account password

For example:
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

console.log('Logging in...');

stockX.login({
    user: 'accountemailhere', 
    password: 'accountpassword'
})
.then(() => console.log('Logged in successfully!'));
```

## Placing asks 
You can place an ask to stockX by using the `placeAsk` method. This takes in 3 parameters.
* product - the product details

In the object:
* amount - the price of the ask
* size - the requested size

For example: 
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

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

    console.log('Placing an ask for ' + product.name);

    //Place an ask on the product
    await stockX.placeAsk(product, {
        amount: 5000000000, 
        size: 'random'
    });
    
    console.log(`Successfully placed an ask for $5000000000 [${product.name}]`);
})();
```

## Placing bids 
You can place a bid to stockX by using the `placeBid` method. This takes in 3 parameters, identical to placing an ask.
* product - the product details

In the object:
* amount - the price of the ask,
* size - the size of the shoe

For example: 
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

(async () => {
    console.log('Logging in...');

    //Logs in before placing bid
    await stockX.login({
        user: 'accountemailhere', 
        password: 'accountpassword'
    });

    console.log('Successfully logged in!');
    
    //Pull product details to place the bid
    const product = await stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet');

    console.log('Placing a bid for ' + product.name);

    //Place a bid on that product
    await stockX.placeBid(product, {
        amount: 100, 
        size: '9.5'
    });
    
    console.log(`Successfully placed a bid for $100 [${product.name}]`);
})();
```

## Editing previously made asks
You can edit a previously placed ask by using the `updateAsk` method. This takes in 2 parameters.
* ask - the ask to update

In the object:
* amount - the price to set the ask to

For example: 
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

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

    console.log('Placing an ask for ' + product.name);

    //Place an ask on that product
    const ask = await stockX.placeAsk(product, {
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

## Editing previously made bids
You can edit a previously placed bid by using the `updateBid` method. This takes in 2 parameters.
* bid - the bid to update

In the object:
* amount - the price to set the bid to

For example: 
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

(async () => {
    console.log('Logging in...');

    //Logs in before placing bid
    await stockX.login({
        user: 'accountemailhere', 
        password: 'accountpassword'
    });

    console.log('Successfully logged in!');
    
    //Pull product details to place the bid
    const product = await stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet');

    console.log('Placing a bid for ' + product.name);

    //Place a bid on that product
    const bid = await stockX.placeBid(product, {
        amount: 100, 
        size: '9.5'
    });
    
    console.log(`Successfully placed a bid for $100 [${product.name}]`);

    //Update previously placed bid
    await stockX.updateBid(bid, {
        amount: 75
    });
    
    console.log('Updated bid!');
})();
```

## Deleting previously made asks
You can delete a previously placed ask by using the `deleteAsk` method. This takes in 1 parameter.
* ask - the ask to update

For example: 
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

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

    console.log('Placing an ask for ' + product.name);

    //Place an ask on that product
    const ask = await stockX.placeAsk(product, {
        amount: 100000, 
        size: '9.5'
    });
    
    console.log(`Successfully placed an ask for $100000 [${product.name}]`);

    //Delete previously placed ask
    await stockX.deleteAsk(ask);
    
    console.log('Deleted ask!');
})();
```

## Deleting previously made bids
You can delete a previously placed bid by using the `deleteBid` method. This takes in 1 parameter.
* bid - the bid to update

For example: 
```js
const StockXAPI = require('stockx-api');
const stockX = new StockXAPI();

(async () => {
    console.log('Logging in...');

    //Logs in before placing bid
    await stockX.login({
        user: 'accountemailhere', 
        password: 'accountpassword'
    });

    console.log('Successfully logged in!');
    
    //Pull product details to place the bid
    const product = await stockX.fetchProductDetails('https://stockx.com/adidas-yeezy-boost-700-magnet');

    console.log('Placing an ask for ' + product.name);

    //Place an ask on that product
    const bid = await stockX.placeBid(product, {
        amount: 100, 
        size: '9.5'
    });
    
    console.log(`Successfully placed a bid for $100 [${product.name}]`);

    //Delete previously placed bid
    await stockX.deleteBid(bid);
    
    console.log('Deleted bid!');
})();
```