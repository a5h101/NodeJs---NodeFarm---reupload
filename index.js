//jshint esversion:6
const fs = require('fs');
const htp = require('http');
const url = require('url');
const { json } = require('stream/consumers');
const replaceTemplate = require('./module/replaceTemplates');

//Reading data from files
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
// console.log(tempCard);
const tempProcuct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// console.log(dataObj);

//Server creation
const ourServer = htp.createServer((request, respond) => {
  const { query, pathname } = url.parse(request.url, true);

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    respond.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((item) => replaceTemplate(tempCard, item))
      .join('');
    const cardsOutput = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    respond.end(cardsOutput);
  }
  //Product page
  else if (pathname === '/product') {
    //here
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProcuct, product);
    respond.writeHead(200, {
      'Content-type': 'text/html',
    });
    respond.end(output);
  }
  //API
  else if (pathname === '/api') {
    respond.writeHead(200, {
      'Content-type': 'application/json',
    });
    respond.end(data);
  }
  //Error page
  else {
    respond.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-heading': 'hello-nodeJs',
    });
    respond.end(
      `<h2>
            <li>You are looking for something which does not exist</li>
        <h2>`
    );
  }
});

//Server start
ourServer.listen(8000, '127.0.0.1', () => {
  console.log('Listening to port 8000');
});
