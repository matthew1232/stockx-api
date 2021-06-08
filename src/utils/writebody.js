const fs = require('fs');

module.exports = (body) => {
    if (typeof body === 'object'){
        body = JSON.stringify(body);
    }
    else if (typeof body !== 'string'){
        body = body.toString();
    }

    fs.writeFile(__dirname + '/../../test/body.txt', body, function(err, data){
        if (err){
            return console.error('Failed to write body: ' + err);
        }
        else console.log('Wrote body to file');
    });
}