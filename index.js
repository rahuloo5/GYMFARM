const  fs  = require('fs');
const http = require('http');
const url = require('url');

const port = process.env.PORT||5000;


const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');


const replaceTemplate =(temp , product)=>{

    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
   

}


 const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');

    const dataObj = JSON.parse(data)

    console.log(dataObj)
   


const server = http.createServer((req,res)=>{

    const { query, pathname } = url.parse(req.url, true);
//overviewpage
    if(pathname === '/' || pathname === '/overview'){

        res.writeHead(200 , {'Content-type':'text/html'})
        const cardsHtml =dataObj.map(el=>replaceTemplate(templateCard , el)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output);


        
    }

    //productpage
    else if (pathname === '/product'){
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output);

    }
    //API
    else if(pathname === '/api'){
       
           res.writeHead(200 ,{'Content-type':'application/json'})
           res.end(data)
        }
    
    else{
res.writeHead( 404,{'Content-type':'text/html'})
res.end('<h1>page not  found</h1>')

    }
    

    
})


server.listen(port);

console.log(`the server is running on ${port}`)