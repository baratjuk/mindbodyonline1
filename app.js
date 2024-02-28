import Utils from './Utils.js';
import Api from './Api.js';
import Db from './Db.js';
import http from 'http';
import https from 'https';
import url from 'url';
import fs from 'fs';
import Twig from 'twig';

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

    utils.log(req.method + ' : ' + req.url + ' : ' + JSON.stringify(req.headers))

    if (req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk
        });
        req.on('end', () => {
            utils.log('body : ' + body)

            let json = JSON.parse(body)
            db.insertWebhook(req.method, req.url, json, req.headers)

            res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
            res.write(`{"method" : "${req.method}", "message" : "OK"}`)
            res.end()
        });
    } else if (req.method === 'GET') {
        let parts = url.parse(req.url, true)
        let query = parts.query
        let answer = null
        switch (parts.pathname) {
            // log
            case '/api': {
                    let apiData = await db.selectApi()
                    let html = await getHtml('api.twig', {items: apiData})
                    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
                    res.write(html)
                    res.end()
                }
                return
            case '/webhooks': {
                    let webhooksData = await db.selectWebhooks()
                    let html = await getHtml('webhooks.twig', {items: webhooksData})
                    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
                    res.write(html)
                    res.end()
                }
                return
            case '/api-json': {
                    let apiData = await db.selectApi()
                    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    res.write(JSON.stringify(apiData))
                    res.end()
                }
                return
            case '/webhooks-json': {
                    let webhooksData = await db.selectWebhooks()
                    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    res.write(JSON.stringify(webhooksData))
                    res.end()
                }
                return     
            // webhooks       
            case '/subscriptions': { // https://dev1.htt.ai/subscriptions
                    answer = await api.subscriptions()
                    db.insertApi(req.url, answer)
                }
                break
            case '/subscribe':
                answer = await api.subscribe(query)
                db.insertApi(req.url, answer)
                break    
            case '/subscribeall': { // https://dev1.htt.ai/subscribe
                    answer = await api.subscribeAll()
                    db.insertApi(req.url, answer)
                }
                break
            case '/patch': { // https://dev1.htt.ai/patch?id=07ac8fee-21c6-4363-96fc-b0e3178b88bc
                    answer = await api.patchSubscribe(query)
                    db.insertApi(req.url, answer)
                }
                break    
            case '/delete': {// https://dev1.htt.ai/delete?id=07ac8fee-21c6-4363-96fc-b0e3178b88bc
                    answer = await api.delete(query)
                    db.insertApi(req.url, answer)
                }
                break
            // public api    
            case '/auth': { // https://dev1.htt.ai/auth
                    answer = await api.auth()
                    db.insertApi(req.url, answer)
                }
                break    
            case '/client-info': { 
                    answer = await api.clientCompleteInfo(query)
                    db.insertApi(req.url, answer)
                }
                break   
            case '/clients': { 
                    answer = await api.clients(query)
                    db.insertApi(req.url, answer)
                }
                break
            case '/add-appointment': { 
                    answer = await api.addAppointment(query)
                    db.insertApi(req.url, answer)
                }
                break      
            case '/favicon.ico':
                break    
            // Go HighLevel
            case '/hl-oauth':  
                answer = await api.hlOauth(res, query)
                if(!answer) {
                    return
                }
                db.insertApi(req.url, answer)
                break 
            case '/hl-test':  
                answer = await api.hlTest()
                db.insertApi(req.url, answer)
                break
            case '/hl-add-appointment': 
                answer = await api.hlAddAppointment(query)
                db.insertApi(req.url, answer)
                break    
            case '/hl-contacts':  
                answer = await api.hlContacts()
                db.insertApi(req.url, answer)
                break 
            case '/hl-calendars':  
                answer = await api.hlCalendars(query)
                db.insertApi(req.url, answer)
                break        
            case '/hl-locations':  
                answer = await api.hlLocations()
                db.insertApi(req.url, answer)
                break
            case '/hl-users':  
                answer = await api.hlUsers(query)
                db.insertApi(req.url, answer)
                break           
            case '/hl-calendars-teams':  
                answer = await api.hlCalendarsTeams()
                db.insertApi(req.url, answer)
                break         
            case '/hl-webhook':      
                break
            default:
                db.insertWebhook(req.method, req.url, {}, req.headers)
        }
        res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
        if(answer) {
            res.write(JSON.stringify(answer))
        } else {
            res.write(`{"method" : "${req.method}", "message" : "OK"}`)
        }
        res.end()
    } else {
        db.insertWebhook(req.method, req.url, {}, req.headers)
        res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
        res.write(`{"method" : "${req.method}", "message" : "OK"}`)
        res.end()
    }
}

const getHtml = async (template, data) => {
    let ret_html = await new Promise(r => Twig.renderFile(template, data, (err, html) => {
        if (err) {
            this.utils.log('getHtml : ' + err);
            r(null);
        } else {
            r(html);
        }
    }))
    return ret_html;
}

utils.log('Server running at port : ' + port);
