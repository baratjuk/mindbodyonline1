import Utils from './Utils.js';
import Api from './Api.js';
import Db from './Db.js';
import http from 'http';
import https from 'https';
import url from 'url';
import fs from 'fs';

const port = process.env.PORT || 3001
const html = fs.readFileSync('index.html')
const utils = new Utils('test1.log')
const api = new Api()
const db = new Db(utils)

const server = http.createServer((req, res) => {
    serverRequest(req, res)
})
server.listen(port)

// let options = {
//     key: fs.readFileSync(`/opt/mindbody/mindbodyonline1/key.pem`),
//     cert: fs.readFileSync(`/opt/mindbody/mindbodyonline1/cert.pem`),
//     passphrase: 'quake2'
// }
// console.log(utils.print_object(options))
// const httpsServer = https.createServer(options, (req, res) => {
//     serverRequest(req, res)
// })
// httpsServer.listen(443)

const serverRequest = async (req, res) => {

    utils.log(req.method + ' : ' + req.url)

    if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk
        });
        req.on('end', () => {
            utils.log('body : ' + body)

            let json = JSON.parse(body)
            db.insertWebhook(req.method, req.url, json)

            res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' })
            res.write('POST OK')
            res.end()
        });
    } else if (req.method === 'GET') {
        let parts = url.parse(req.url, true)
        let query = parts.query
        switch (parts.pathname) {
            case '/subscriptions': { // https://dev1.htt.ai/subscriptions
                    let answer = await api.subscriptions()
                    db.insertApi(req.url, answer)
                }
                break
            case '/subscribe':
                let { event } = query
                if (event) {
                    let answer = await api.subscribe(event)
                    db.insertApi(req.url, answer)
                }
                break    
            case '/subscribeall': { // https://dev1.htt.ai/subscribe
                    let answer = await api.subscribeAll()
                    db.insertApi(req.url, answer)
                }
                break
            case '/patch': { // https://dev1.htt.ai/patch?id=07ac8fee-21c6-4363-96fc-b0e3178b88bc
                    let { id } = query
                    if (id) {
                        let answer = await api.patchSubscribe(id)
                        db.insertApi(req.url, answer)
                    }
                }
                break    
            case '/delete': {// https://dev1.htt.ai/delete?id=07ac8fee-21c6-4363-96fc-b0e3178b88bc
                    let { id } = query
                    if (id) {
                        let answer = await api.delete(id)
                        db.insertApi(req.url, answer)
                    }
                }
                break
            case '/favicon.ico':
                break
            default:
                db.insertWebhook(req.method, req.url, {})
        }
        res.writeHead(200, 'OK', { 'Content-Type': 'text/plain' })
        res.write('GET OK')
        res.end()
    } 
}

utils.log('Server running at port : ' + port);
