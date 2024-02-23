import mysql from 'mysql';
import Utils from './Utils.js';

class Db {

    utils
    dbConnect

    constructor(utils) {
        super.constructor()
        this.utils = utils
        this.dbConnect = mysql.createConnection({
            host: 'ls-305804f2824c8ee28da1406bf9e7a66d71591ce2.c1eg6w6sc9q2.eu-central-1.rds.amazonaws.com',
            user: 'dbmasteruser',
            password: 'p+d+34MQO!.2Z5u6Q+xoO[hRmfxvW^im',
            database: 'mydb'
        })
        this.dbConnect.connect((err) => {
            if (err) {
                throw err
            }
            this.utils.log("DB Connected!");
        })
    }

    async selectApi() {
        const sql = `SELECT * FROM api;`
        let tableData = await new Promise(r => this.dbConnect.query(sql, (err, result) => {
            if (err) {
                r(null)
            } else {
                r(result)
            }
        }))
        return tableData
    }

    async selectWebhooks() {
        const sql = `SELECT * FROM webhooks;`
        let tableData = await new Promise(r => this.dbConnect.query(sql, (err, result) => {
            if (err) {
                r(null)
            } else {
                r(result)
            }
        }))
        return tableData
    }

    insertApi(url, answer) {
        let jsonStr = JSON.stringify(answer)
        const sql = `INSERT INTO api (url, answer, created_at) VALUES ('${url}', '${jsonStr}', now());`
        this.dbConnect.query(sql, (err, result) => {
            if (err) {
                this.utils.log('insertApi error : ' + err.stack)
            }
        })
    }

    insertWebhook(method, url, data, headers) {
        // let jsonStr = JSON.stringify(data)
        // let headersStr = JSON.stringify(headers)
        // const sql = `INSERT INTO webhooks (method, url, data, created_at, headers) VALUES ('${method}', '${url}', '${jsonStr}', now(), '${headersStr}');`
        const sql = `INSERT INTO webhooks (method, url, data, created_at, headers) VALUES ?`
        let date = new Date()
        this.dbConnect.query(sql, {method, url, data, date, headers}, (err, result) => {
            if (err) {
                this.utils.log('insertWebhook error : ' + err.stack)
            }
        })
    }
}

export default Db;