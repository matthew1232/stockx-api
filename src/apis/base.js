import request from 'request-promise-native';

export default class Api {
  constructor({ currency, jar, headers, proxy, bearer, isLoggedIn, name }) {

    // private members
    this._jar = jar,
    this._request = request;
    this._bearer = bearer;
    this._isLoggedIn = isLoggedIn;

    // public members
    this.currency = currency;
    this.headers = headers;
    this.proxy = proxy;
    this.name = name;
  }
}
