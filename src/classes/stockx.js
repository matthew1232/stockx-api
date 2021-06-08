const request = require('request-promise');
const searchProducts = require('../api/scrapers/searchproducts');
const fetchProductDetails = require('../api/scrapers/fetchproductdetails');
const newSearchProducts = require('../api/scrapers/newsearchproducts');
const login = require('../api/login/login');
const placeBid = require('../api/placebid/index');
const placeAsk = require('../api/placeask/index');
const updateAsk = require('../api/updateask/index');
const deleteAsk = require('../api/deleteask/index');
const updateBid = require('../api/updatebid/index');
const deleteBid = require('../api/deletebid/index');
const { formatProxy } = require('../utils');

module.exports = class StockX {
    /**
     * 
     * @param {Object=} options
     * @param options.proxy - The proxy to make requests with
     * @param options.currency - The currency to make requests in 
     */
    constructor(options = {}){
        const { proxy, currency, userAgent } = options;

        //Configure options
        this.currency = 'USD';
        this.cookieJar = request.jar();
        this.loggedIn = false;
        this.userAgent = userAgent !== undefined ? userAgent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36';

        this.currency = currency == undefined ? 'USD' : currency;
        this.proxy = proxy == undefined || proxy.trim() == '' ? undefined : formatProxy(proxy);
    };

    /**
     * 
     * @param {string} query - The query string to search for 
     * @param {Object=} options
     * @param {Number=} options.limit - The limit on how many products to return at max 
     */
    async searchProducts(query, options = {}){
        //Search products and return them
        const { limit } = options;

        const products = await searchProducts(query, {
            limit, 
            proxy: this.proxy,
            userAgent: this.userAgent,
            cookieJar: this.cookieJar
        });

        return products;
    };

    /**
     * 
     * @param {string} query - The query string to search for 
     * @param {Object=} options
     * @param {Number=} options.limit - The limit on how many products to return at max 
    */
    async newSearchProducts(query, options = {}){
        //Search products and return them
        const { limit } = options;

        const products = await newSearchProducts(query, {
            limit, 
            proxy: this.proxy,
            userAgent: this.userAgent,
            cookieJar: this.cookieJar
        });

        return products;
    };

    /**
     * 
     * @param {string|Object} product - The product URL or object to fetch from
     */
    async fetchProductDetails(product){
        //Fetch products and return them
        const products = await fetchProductDetails(product, {
            currency: this.currency, 
            proxy: this.proxy,
            userAgent: this.userAgent,
            cookieJar: this.cookieJar
        });

        return products;
    };

    /**
     * 
     * @param {Object} options
     * @param {string} options.user - The user/email to login with
     * @param {string} options.password - The password to login with 
     */
    async login(options = {}){
        const { user, password } = options;

        //Create login
        await login({
            user,
            password, 
            proxy: this.proxy,
            cookieJar: this.cookieJar,
            userAgent: this.userAgent
        });

        //Verify a token was created
        this.token = this.cookieJar._jar.store.idx["stockx.com"]["/"].token;
        if (this.token == undefined) throw new Error("No login token found!");

        //Store the account token as a local class variable
        this.token = this.token.toString().split('token=')[1].split(';')[0];
        this.loggedIn = true;
    };

    /**
     * 
     * @param {Object} product - The product object
     * @param {Object} options 
     * @param {number} options.amount - The amount to place the bid for
     * @param {string} options.size - The requested size
     */
    async placeBid(product, options = {}){
        //Convert amount to numeral type
        const amount = Number(options.amount);
        const requestedSize = options.size;

        //Verify fields passed in by user
        if (!this.loggedIn) throw new Error("You must be logged in before placing a bid!");
        else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your parameters are correctly formatted.");
        else if (requestedSize == undefined) throw new Error("Please specify a size to bid on!");
        else if (product == undefined) throw new Error("A product must be specified!");
        else if (typeof product == 'string') throw new Error("The product passed in must an object. Use fetchProductDetails() to get the details first.");
        else if (product.variants == undefined) throw new Error("No variants found in product! Please check the product object passed in.");

        //Get size from requestedSize in the product variants
        const size = requestedSize.toLowerCase() == 'random' ? product.variants[Math.floor(Math.random() * product.variants.length)] : product.variants.find(variant => variant.size == requestedSize);
        
        //Check if getting size was successful
        if (size == undefined) throw new Error("No variant found for the requested size!"); 
        if (size.uuid == undefined || size.uuid == "") throw new Error("No variant ID found for the requested size!");  
        
        //Place bid
        const response = await placeBid(this.token, {
            amount: amount, 
            variantID: size.uuid, 
            currency: this.currency, 
            cookieJar: this.cookieJar, 
            proxy: this.proxy,
            userAgent: this.userAgent
        });

        return response;
    };

    /**
     * 
     * @param {Object} product - The product object 
     * @param {Object} options 
     * @param {number} options.amount - The amount to place the ask for
     * @param {string} options.size - The requested size
     */
    async placeAsk(product, options = {}){
        //Convert amount to digit
        const amount = Number(options.amount);
        const requestedSize = options.size;

        //Verify fields passed in by user
        if (!this.loggedIn) throw new Error("You must be logged in before placing an ask!");
        else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your parameters are correctly formatted.");
        else if (requestedSize == undefined) throw new Error("Please specify a size to place an ask on!");
        else if (product == undefined) throw new Error("A product must be specified!");
        else if (typeof product == 'string') throw new Error("The product passed in must an object. Use fetchProductDetails() to get the details first.");
        else if (product.variants == undefined) throw new Error("No variants found in product! Please check the product object passed in.");

        //Get size from requestedSize in the product variants
        const size = requestedSize.toLowerCase() == 'random' ? product.variants[Math.floor(Math.random() * product.variants.length)] : product.variants.find(variant => variant.size == requestedSize);
        
        //Check if getting size was successful
        if (size == undefined) throw new Error("No variant found for the requested size!"); 
        if (size.uuid == undefined || size.uuid == "") throw new Error("No variant ID found for the requested size!");  
        
        //Place ask
        const response = await placeAsk(this.token, {
            amount, 
            variantID: size.uuid, 
            currency: this.currency, 
            cookieJar: this.cookieJar, 
            proxy: this.proxy,
            userAgent: this.userAgent
        });

        return response;
    };

    /**
     * 
     * @param {Object} ask - The previous ask object
     * @param {Object} options
     * @param {number} options.amount - The amount to update the ask to
     */
    async updateAsk(ask, options = {}){
        //Convert amount to digit
        const amount = Number(options.amount);

        //Verify fields passed in by user
        if (!this.loggedIn) throw new Error("You must be logged in before placing an ask!");
        else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your parameters are correctly formatted.");
        else if (ask == undefined) throw new Error("Ask is incorrect, please ensure your parameters are correctly formatted.");

        //Get size from previous ask size
        const size = ask.response.PortfolioItem.skuUuid;

        //Check if getting size was successful
        if (size == undefined) throw new Error("No variant found in ask!"); 

        //Update ask
        const response = await updateAsk(this.token, {
            amount, 
            variantID: size, 
            askID: ask.id, 
            currency: this.currency, 
            cookieJar: this.cookieJar, 
            proxy: this.proxy,
            userAgent: this.userAgent
        });

        return response;
    };

    /**
     * 
     * @param {Object} ask - The previous ask object
     * @param {number} ask.id - The id of the ask
     */
    async deleteAsk(ask){
        //Verify fields passed in by user
        if (!this.loggedIn) throw new Error("You must be logged in before deleting an ask!");
        else if (ask == undefined) throw new Error("Ask is incorrect, please ensure your parameters are correctly formatted.");

        //Delete ask
        const response = await deleteAsk(this.token, {
            askID: ask.id, 
            cookieJar: this.cookieJar, 
            proxy: this.proxy,
            userAgent: this.userAgent
        });

        return response;
    };

    /**
     * 
     * @param {Object} bid - The previous ask object
     * @param {number} bid.id - The id of the ask
     */
    async deleteBid(bid){
        //Verify fields passed in by user
        if (!this.loggedIn) throw new Error("You must be logged in before deleting a bid!");
        else if (bid == undefined) throw new Error("Bid is incorrect, please ensure your parameters are correctly formatted.");

        //Delete bid
        const response = await deleteBid(this.token, {
            bidID: bid.id, 
            cookieJar: this.cookieJar, 
            proxy: this.proxy,
            userAgent: this.userAgent
        });

        return response;
    };

    /**
     * 
     * @param {Object} bid - The previous bid object
     * @param {Object} options
     * @param {number} options.amount - The amount to update the bid to 
     */
    async updateBid(bid, options = {}){
        //Convert amount to digit
        const amount = Number(options.amount);

        //Verify fields passed in by user
        if (!this.loggedIn) throw new Error("You must be logged in before placing a bid!");
        else if (amount == NaN) throw new Error("Amount is incorrect, please ensure your parameters are correctly formatted.");
        else if (bid == undefined) throw new Error("Ask is incorrect, please ensure your parameters are correctly formatted.");

        //Get size from previous ask size
        const size = bid.response.PortfolioItem.skuUuid;

        //Check if getting size was successful
        if (size == undefined) throw new Error("No variant found in bid!"); 

        //Update ask
        const response = await updateBid(this.token, {
            amount, 
            variantID: size, 
            bidID: bid.id, 
            currency: this.currency, 
            cookieJar: this.cookieJar, 
            proxy: this.proxy,
            userAgent: this.userAgent
        });

        return response;
    };
};