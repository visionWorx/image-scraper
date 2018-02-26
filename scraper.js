//TO-DO :  Make it for multi pages so that we can download more thatn 49 pages 
//      :  Make it more modular so easier to understand 
//      : 

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
var phantom = require('phantom');
var Q = require('q');

const services = require('./services/downloadImg');
var $ = cheerio;


downloadImages(['cat', 'dog']);
var _ph, _page, _outObj;

function downloadImages(images) {
    images.forEach(function(query) {
        var data = [];
        let url = "https://duckduckgo.com/?q="+ query +"&t=hf&iax=images&ia=images";

        phantom.create().then(ph => {
            _ph = ph;
            return _ph.createPage();
        }).then(page => {
            _page = page;
            return _page.open(url);
        }).then(status => {
            console.log(status);
            return waitState(textPopulated, 3);
        }).then(() => {
            return _page.property('content');
        }).then(body => {
            //Start scrapping ------------------------------------------------
            let filePath = "./"+ query + "/";
            var $ = cheerio.load(body);
            $('img.tile--img__img').each(function(i, elm) {
                let imgUrl = $(this).attr("src");
                data[i] = imgUrl;
                console.log("Got ... "+ i);

            });
            //Scrapping ends-------------------------------------------------

            //Save images --------------------------------------------------
            var dir = './'+query;
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }

            for (let i=0; i< data.length;i++){
                console.log(" Downloading... "+ i);
                services.downloadImg("https:"+data[i], filePath+i+".png", function(){console.log("Done!");});
            }
            
        }).catch(e => console.log(e));
        
        

    });
}

function textPopulated() {
    return _page.evaluate(function() {
        return document.querySelector('.body--serp').outerHTML;
    }).then(function(html) {
        return html;
    });
}


function waitState(state, timeout) {  // timeout in seconds is optional
    console.log('Start waiting for state: ' + state.name);

    var limitTime = timeout * 1000 || 20000;
    var startTime = new Date();

    return wait();

    function wait() {
        return state().then(function(result) {
            if (result) {
                console.log('Reached state: ' + state.name);
                return;
            } else if (new Date() - startTime > limitTime) {
                var errorMessage = 'Timeout state: ' + state.name;
                throw new Error(errorMessage);
            } else {
                return Q.delay(50).then(wait);
            }
        }).catch(function(error) {
            throw error;
        });
    }
}