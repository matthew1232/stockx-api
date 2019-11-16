
import { CookieJar } from 'tough-cookie';

// APIs
import ProductsApi from './products';
import AsksApi from './asks';
import BidsApi from './bids';
import UserApi from './user';

// Utils
import { format, currencies } from '../../utils';

export default class StockX {
    /**
     * 
     * @param {Object} options
     * @param options.proxy - The proxy to use for future requests
     * @param options.currency - The currency used when making requests
     */
    constructor(options = {}){
        const { proxy = null, currency = currencies.USD } = options;

        //Configure options
        this.currency = currency;
        this.cookieJar = new CookieJar();
        this.proxy = proxy ? format(proxy) : null;

        this.context = {
            currency: this.currency,
            jar: this.cookieJar,
            baseURL: 'https://stockx.com/api',
            headers: {
                origin: 'https://accounts.stockx.com',
                host: 'accounts.stockx.com',
                'sec-fetch-mode': 'cors',
                'accept-language': 'en-US,en;q=0.9',
                'x-requested-with': 'XMLHttpRequest',
                'upgrade-insecure-requests': 1,
                appos: 'web',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                accept: '*/*',
                authority: 'stockx.com',
                'sec-fetch-site': 'same-origin',
                appversion: '0.1',
                'content-type': 'application/json',
            },
            proxy: this.proxy,
        };

        // sub-module constructors
        this.products = new ProductsApi(this.context);
        this.asks = new AsksApi(this.context);
        this.bids = new BidsApi(this.context);
        this.user = new UserApi(this.context);
    };

    // /**
    //  * 
    //  * @param {string} query - The query string to search for 
    //  * @param {Object=} options
    //  * @param {Number=} options.limit - The limit on how many products to return at max 
    //  */
    // async search(query, options = {}) {
    //     //Search products and return them
    //     const { limit } = options;

    //     try {
    //         const products = await this.products.search(query, {
    //             type: 'product',
    //             limit,
    //         });

    //         return products;
    //     } catch (error) {
    //         if (error.response) {
    //             // The request was made and the server responded with a status code
    //             // that falls out of the range of 2xx
    //             console.log(error.response.data);
    //             console.log(error.response.status);
    //             console.log(error.response.headers);
    //           } else if (error.request) {
    //             // The request was made but no response was received
    //             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    //             // http.ClientRequest in node.js
    //             console.log(error.request);
    //           } else {
    //             // Something happened in setting up the request that triggered an Error
    //             console.log('Error', error.message);
    //           }
    //     }
    // };

    // /**
    //  * 
    //  * @param {string|Object} product - The product URL or object to fetch from
    //  */
    // async fetchProductDetails(product){
    //     //Fetch products and return them
    //     const products = await fetchProductDetails(product, {
    //         currency: this.currency, 
    //         proxy: this.proxy
    //     });

    //     return products;
    // };

    // /**
    //  * 
    //  * @param {Object} options
    //  * @param {string} options.user - The user/email to login with
    //  * @param {string} options.password - The password to login with 
    //  */
    // async login(options = {}){
    //     const { user, password } = options;

    //     //Create login
    //     await login({
    //         user,
    //         password, 
    //         proxy: this.proxy,
    //         cookieJar: this.cookieJar
    //     });

    //     //Verify a token was created
    //     this.token = this.cookieJar._jar.store.idx["stockx.com"]["/"].token;
    //     if (this.token == undefined) throw new Error("No login token found!");

    //     //Store the account token as a local class variable
    //     this.token = this.token.toString().split('token=')[1].split(';')[0];
    //     this.loggedIn = true;
    // };

    // /**
    //  * 
    //  * @param {Object} product - The product object
    //  * @param {Object} options 
    //  * @param {number} options.amount - The amount to place the bid for
    //  * @param {string} options.size - The requested size
    //  */
    // async placeBid(product, options = {}){
    //     //Convert amount to numeral type
    //     const amount = Number(options.amount);
    //     const requestedSize = options.size;

    //     //Verify fields passed in by user
    //     if (!this.loggedIn) throw new Error("You must be logged in before placing a bid!");
    //     else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your paramaters are correctly formatted.");
    //     else if (requestedSize == undefined) throw new Error("Please specify a size to bid on!");
    //     else if (product == undefined) throw new Error("A product must be specified!");
    //     else if (typeof product == 'string') throw new Error("The product passed in must an object. Use fetchProductDetails() to get the details first.");
    //     else if (product.variants == undefined) throw new Error("No variants found in product! Please check the product object passed in.");

    //     //Get size from requestedSize in the product variants
    //     const size = requestedSize.toLowerCase() == 'random' ? product.variants[Math.floor(Math.random() * product.variants.length)] : product.variants.find(variant => variant.size == requestedSize);
        
    //     //Check if getting size was successful
    //     if (size == undefined) throw new Error("No variant found for the requested size!"); 
    //     if (size.uuid == undefined || size.uuid == "") throw new Error("No variant ID found for the requested size!");  
        
    //     //Place bid
    //     const response = await placeBid(this.token, {
    //         amount: amount, 
    //         variantID: size.uuid, 
    //         currency: this.currency, 
    //         cookieJar: this.cookieJar, 
    //         proxy: this.proxy
    //     });

    //     return response;
    // };

    // /**
    //  * 
    //  * @param {Object} product - The product object 
    //  * @param {Object} options 
    //  * @param {number} options.amount - The amount to place the ask for
    //  * @param {string} options.size - The requested size
    //  */
    // async placeAsk(product, options = {}){
    //     //Convert amount to digit
    //     const amount = Number(options.amount);
    //     const requestedSize = options.size;

    //     //Verify fields passed in by user
    //     if (!this.loggedIn) throw new Error("You must be logged in before placing an ask!");
    //     else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your paramaters are correctly formatted.");
    //     else if (requestedSize == undefined) throw new Error("Please specify a size to place an ask on!");
    //     else if (product == undefined) throw new Error("A product must be specified!");
    //     else if (typeof product == 'string') throw new Error("The product passed in must an object. Use fetchProductDetails() to get the details first.");
    //     else if (product.variants == undefined) throw new Error("No variants found in product! Please check the product object passed in.");

    //     //Get size from requestedSize in the product variants
    //     const size = requestedSize.toLowerCase() == 'random' ? product.variants[Math.floor(Math.random() * product.variants.length)] : product.variants.find(variant => variant.size == requestedSize);
        
    //     //Check if getting size was successful
    //     if (size == undefined) throw new Error("No variant found for the requested size!"); 
    //     if (size.uuid == undefined || size.uuid == "") throw new Error("No variant ID found for the requested size!");  
        
    //     //Place ask
    //     const response = await placeAsk(this.token, {
    //         amount, 
    //         variantID: size.uuid, 
    //         currency: this.currency, 
    //         cookieJar: this.cookieJar, 
    //         proxy: this.proxy
    //     });

    //     return response;
    // };

    // /**
    //  * 
    //  * @param {Object} ask - The previous ask object
    //  * @param {Object} options
    //  * @param {number} options.amount - The amount to update the ask to
    //  */
    // async updateAsk(ask, options = {}){
    //     //Convert amount to digit
    //     const amount = Number(options.amount);

    //     //Verify fields passed in by user
    //     if (!this.loggedIn) throw new Error("You must be logged in before placing an ask!");
    //     else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your paramaters are correctly formatted.");
    //     else if (ask == undefined) throw new Error("Ask is incorrect, please ensure your paramaters are correctly formatted.");

    //     //Get size from previous ask size
    //     const size = ask.response.PortfolioItem.skuUuid;

    //     //Check if getting size was successful
    //     if (size == undefined) throw new Error("No variant found in ask!"); 

    //     //Update ask
    //     const response = await updateAsk(this.token, {
    //         amount, 
    //         variantID: size, 
    //         askID: ask.id, 
    //         currency: this.currency, 
    //         cookieJar: this.cookieJar, 
    //         proxy: this.proxy
    //     });

    //     return response;
    // };

    // /**
    //  * 
    //  * @param {Object} bid - The previous bid object
    //  * @param {Object} options
    //  * @param {number} options.amount - The amount to update the bid to 
    //  */
    // async updateBid(bid, options = {}){
    //     //Convert amount to digit
    //     const amount = Number(options.amount);

    //     //Verify fields passed in by user
    //     if (!this.loggedIn) throw new Error("You must be logged in before placing a bid!");
    //     else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your paramaters are correctly formatted.");
    //     else if (bid == undefined) throw new Error("Ask is incorrect, please ensure your paramaters are correctly formatted.");

    //     //Get size from previous ask size
    //     const size = bid.response.PortfolioItem.skuUuid;

    //     //Check if getting size was successful
    //     if (size == undefined) throw new Error("No variant found in bid!"); 

    //     //Update ask
    //     const response = await updateBid(this.token, {
    //         amount, 
    //         variantID: size, 
    //         bidID: bid.id, 
    //         currency: this.currency, 
    //         cookieJar: this.cookieJar, 
    //         proxy: this.proxy
    //     });

    //     return response;
    // };
};