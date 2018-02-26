const fs = require('fs');
const request = require('request');

 module.exports = {
     downloadImg : function(uri, filename, callback){
        console.log(uri);
        request.head(uri, function(err, res, body){
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    }
}

