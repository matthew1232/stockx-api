class SharedContext {
  constructor({ currency, jar, headers, proxy, bearer, isLoggedIn }) {
    this.currency = currency;
    this.jar = jar;
    this.headers = headers;
    this.proxy = proxy;
    this.bearer = bearer;
    this.isLoggedIn = isLoggedIn;
  }

  setCurrency(currency) {
    this.currency = currency;
  }

  setJar(jar) {
    this.jar = jar;
  }

  setHeaders(headers) {
    this.headers = headers;
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

let singleton;
export default context => {
  if (!singleton) {
    singleton = new SharedContext(context); 
  }
  return singleton;
}   