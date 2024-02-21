import Utils from './Utils.js';
import Api from './Api.js';
import http from 'http';
import https from 'https';
import url from 'url';
import fs from 'fs';
import mysql from 'mysql';

const port = process.env.PORT || 3001
const html = fs.readFileSync('index.html')
const utils = new Utils('test1.log')
const api = new Api()
  
const server = http.createServer( (req, res) => {
    serverRequest(req, res)
})
server.listen(port)

let options = {
    key: fs.readFileSync(`/home/bitnami/htdocs/test1/key.pem`),
    cert: fs.readFileSync(`/home/bitnami/htdocs/test1/cert.pem`),
    passphrase: 'quake2'
}

// console.log(utils.print_object(options))

const httpsServer = https.createServer(options, (req, res) => {
    serverRequest(req, res)
})
httpsServer.listen(443)

const serverRequest = async (req, res) => {
    if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk
        });
        req.on('end', () => {
            utils.log('POST : ' + body)
            let json = JSON.parse(body)
            insert(req.url, 'POST', json)

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
            res.write('POST OK')
            res.end()
        });
    } else if (req.method === 'GET') {
        let parts = url.parse(req.url, true)
        let query = parts.query

        utils.log('GET : ' + req.url)
        switch(parts.pathname) {
            case '/subscriptions':
                let json = await api.subscriptions()
                insert(req.url, 'GET', json)
                break
            case '/subscribe':
                utils.log('subscribe : ' + utils.print_object(query))
                if (query) {
                    let json = await api.subscribe(query)
                    insert(req.url, 'GET', json)
                }
                break
            case '/favicon.ico':
                break     
        }    
        res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
        res.write('GET OK')
        res.end()
    } else {
        let url = req.url
        let method = req.method

        utils.log(method + ' : ' + url)
        insert(url, method, {})
        
        res.writeHead(200, 'OK', {'Content-Type': 'text/plain'})
        res.write('GET OK')
        res.end()
    }
}

const dbConnect = mysql.createConnection({
    host: 'ls-305804f2824c8ee28da1406bf9e7a66d71591ce2.c1eg6w6sc9q2.eu-central-1.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: 'p+d+34MQO!.2Z5u6Q+xoO[hRmfxvW^im',
    database: 'mydb'
})

dbConnect.connect((err) => {
    if (err) {
        throw err
    }  
    utils.log("DB Connected!");
})

const insert = (content, method, json) => {
    let jsonStr = JSON.stringify(json)
    let sql = `INSERT INTO table1 (data, content, created_at, method) VALUES ('${jsonStr}', '${content}', now(), '${method}');`
    dbConnect.query(sql, function (err, result) {
        if (err) { 
            throw err 
        }
        utils.log("Record inserted")
    })
}


utils.log('Server running at port : ' + port );
