import request from 'request-promise-native';

export default class SharedContext {
  constructor({ currency, jar, headers, proxy, bearer, isLoggedIn }) {
    this.currency = currency;
    this.request = request;
    this.jar = jar;
    this.headers = headers;
    this.proxy = proxy;
    this.bearer = bearer;
    this.isLoggedIn = isLoggedIn;
  }
  
  setCurrency(currency) {
    this.currency = currency;
  }
  
  setProxy(proxy) {
    this.proxy = proxy;
  }

  setBearer(bearer) {
    this.bearer = bearer;
  }
  
  setIsLoggedIn(isLoggedIn) {
    this.isLoggedIn = isLoggedIn;
  }
}
