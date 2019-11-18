import request from 'request-promise-native';

import CreateSharedContext from './data';

export default class Api {
  constructor(context) {
    this._request = request;
    this.data = CreateSharedContext(context);
  }
}
