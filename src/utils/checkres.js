const writeBody = require('./writebody');

module.exports = (res) => {
    if (res.statusCode !== 200 && res.statusCode !== 204){
        writeBody(res.body);
        throw new Error("Status code: " + res.statusCode + " - body: " + __dirname + '/../../test/body.txt');
    }
}