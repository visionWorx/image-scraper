const request = require('request');
const cheerio = require('cheerio')
var $ = cheerio


downloadImages(['car'])

function downloadImages(images) {
    images.forEach(function(query) {
        request('https://duckduckgo.com/?q='+query+'&t=hf&iax=images&ia=images', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body);
        });
    });
}

