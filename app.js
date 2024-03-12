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
const db = new Db(utils)
const api = new Api(db)

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

    utils.log(req.method + ' : ' + req.url + ' : ' + JSON.stringify(req.headers, null, 4))

    if (req.method === 'POST') {
        let parts = url.parse(req.url, true)
        let body = ''
        req.on('data', (chunk) => {
            body += chunk
        });
        req.on('end', async () => {
            utils.log('body : ' + body)

            switch (parts.pathname) {
                case '/test-get': {
                        let data = JSON.parse(body)
                        let answer = '{}'
                        try {
                            answer = JSON.stringify(await api.testGet(data), null, 4)
                        } catch (e) {
                            utils.log('error : ' + e.stack)   
                            answer = `{"error" : ${e.message}}`
                        }
                        res.writeHead(200, 'OK', { 
                            'Content-Type': 'application/json', 
                            "Access-Control-Allow-Headers" : "Content-Type",
                            'Access-Control-Allow-Origin':'*',
                            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS' })        
                        res.write(answer)
                        res.end()
                    }
                    return
                case '/test-post': {
                        let data = JSON.parse(body)
                        let answer = '{}'
                        try {
                            answer = JSON.stringify(await api.testPost(data), null, 4)
                        } catch (e) {
                            utils.log('error : ' + e.stack)   
                            answer = `{"error" : ${e.message}}`
                        }
                        res.writeHead(200, 'OK', { 
                            'Content-Type': 'application/json', 
                            "Access-Control-Allow-Headers" : "Content-Type",
                            'Access-Control-Allow-Origin':'*',
                            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS' })        
                        res.write(answer)
                        res.end()
                    }
                    return        
            }        
            try {
                let json = JSON.parse(body)
                db.insertWebhook(req.method, req.url, json, req.headers)
            } catch (e) {
            }
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
                    let html = await getHtml('api.twig', { items: apiData })
                    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
                    res.write(html)
                    res.end()
                }   
                return
            case '/webhooks': {
                    let webhooksData = await db.selectWebhooks()
                    let html = await getHtml('webhooks.twig', { items: webhooksData })
                    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
                    res.write(html)
                    res.end()
                }
                return
            case '/api-json': {
                    let apiData = await db.selectApi()
                    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    res.write(JSON.stringify(apiData, null, 4))
                    res.end()
                }
                return
            case '/webhooks-json': {
                    let webhooksData = await db.selectWebhooks()
                    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    res.write(JSON.stringify(webhooksData, null, 4))
                    res.end()
                }
                return
            case '/clients-json': {
                let clientsData = await db.selectClients()
                res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                res.write(JSON.stringify(clientsData, null, 4))
                res.end()
            }
                return
            // webhooks       
            case '/subscriptions':  // https://dev1.htt.ai/subscriptions
                answer = await api.subscriptions()
                db.insertApi(req.url, answer)
                break
            case '/subscribe':
                answer = await api.subscribe(query)
                db.insertApi(req.url, answer)
                break
            case '/subscribeall':  // https://dev1.htt.ai/subscribe
                answer = await api.subscribeAll()
                db.insertApi(req.url, answer)
                break
            case '/patch':  // https://dev1.htt.ai/patch?id=07ac8fee-21c6-4363-96fc-b0e3178b88bc
                answer = await api.patchSubscribe(query)
                db.insertApi(req.url, answer)
                break
            case '/delete': // https://dev1.htt.ai/delete?id=07ac8fee-21c6-4363-96fc-b0e3178b88bc
                answer = await api.delete(query)
                db.insertApi(req.url, answer)
                break
            // public api    
            case '/auth':  // https://dev1.htt.ai/auth
                answer = await api.auth()
                db.insertApi(req.url, answer)
                break
            case '/locations':
                answer = await api.locations()
                db.insertApi(req.url, answer)
                break
            case '/session-types':
                answer = await api.sessionTypesIDs()
                db.insertApi(req.url, answer)
                break
            case '/services':
                answer = await api.services(query)
                db.insertApi(req.url, answer)
                break
            case '/products':
                answer = await api.products(query)
                db.insertApi(req.url, answer)
                break
            case '/schedule-items':
                answer = await api.scheduleItems(query)
                db.insertApi(req.url, answer)
                break
            case '/available-dates':
                answer = await api.availableDates(query)
                db.insertApi(req.url, answer)
                break
            case '/bookable-items':
                answer = await api.bookableItems(query)
                db.insertApi(req.url, answer)
                break
            case '/clients':
                answer = await api.clients(query)
                db.insertApi(req.url, answer)
                break
            case '/clients1':
                answer = await api.clients1(query)
                break
            case '/clients1-delete': {
                    let isDelete = await db.deleteClients()
                    res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
                    res.write(JSON.stringify({delete : isDelete}))
                    res.end()
                }
                return
            case '/client-info':
                answer = await api.clientCompleteInfo(query)
                db.insertApi(req.url, answer)
                break
            case '/sales':
                answer = await api.sales(query)
                db.insertApi(req.url, answer)
                break
            case '/transactions':
                answer = await api.transactions(query)
                db.insertApi(req.url, answer)
                break
            case '/appointments':
                answer = await api.appointments(query)
                db.insertApi(req.url, answer)
                break
            case '/add-appointment':
                answer = await api.addAppointment(query)
                db.insertApi(req.url, answer)
                break   
            case '/get': {
                    let html = await utils.fileToHtml('page_get.html')
                    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
                    res.write(html)
                    res.end()
                }     
                return
            case '/post': {
                    let html = await utils.fileToHtml('page_post.html')
                    res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
                    res.write(html)
                    res.end()
                }     
                return    
            case '/favicon.ico':
                break
            // Go HighLevel
            case '/hl-oauth':
                answer = await api.hlOauth(res, query)
                if (!answer) {
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
        if (answer) {
            res.write(JSON.stringify(answer, null, 4))
        } else {
            res.write(`{"method" : "${req.method}", "message" : "OK"}`)
        }
        res.end()
    } else {
        db.insertWebhook(req.method, req.url, {}, req.headers)
        res.writeHead(200, 'OK', { 
            'Content-Type': 'application/json', 
            "Access-Control-Allow-Headers" : "Content-Type",
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS' })
        res.write(`{"method" : "${req.method}", "message" : "OK"}`)
        res.end()
    }
}

const getHtml = async (template, data) => {
    let ret_html = await new Promise(r => Twig.renderFile(template, data, (err, html) => {
        if (err) {
            this.utils.log('getHtml : ' + err)
            r(null)
        } else {
            r(html)
        }
    }))
    return ret_html
}

utils.log('Server running at port : ' + port)
