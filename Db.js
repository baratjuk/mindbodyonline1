import mysql from 'mysql';
import Utils from './Utils.js';

class Db {

    static STORE = {
        GHL: 1,
        MBO: 2,
    }

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

    async getStoreObj(id) {
        const sql = `SELECT * FROM store WHERE id=${id};`
        let tableData = await new Promise(r => this.dbConnect.query(sql, (err, result) => {
            if (err) {
                r(null)
            } else {
                r(result)
            }
        }))
        if(tableData) {
            let jsonObj = JSON.parse(tableData[0].data)
            return jsonObj
        }
        return {}
    }

    setStoreObj(id, data) {
        let jsonStr = JSON.stringify(data)
        const sql = `UPDATE store SET data='${jsonStr}' WHERE id=${id};`
        this.dbConnect.query(sql, (err, result) => {
            if (err) {
                this.utils.log('insertApi error : ' + err.stack)
            }
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

    async selectClients() {
        const sql = `SELECT data FROM clients;`
        let tableData = await new Promise(r => this.dbConnect.query(sql, (err, result) => {
            if (err) {
                r(null)
            } else {
                let ret = []
                for(let rec of result) {
                    ret.push(JSON.parse(rec.data))
                }
                r(ret)
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
        let jsonStr = JSON.stringify(data)
        let headersStr = JSON.stringify(headers)
        const sql = `INSERT INTO webhooks (method, url, data, created_at, headers) VALUES ('${method}', '${url}', '${jsonStr}', now(), '${headersStr}');`
        this.dbConnect.query(sql, (err, result) => {
            if (err) {
                this.utils.log('insertWebhook error : ' + err.stack)
            }
        })
    }

    insertClient(data) {
        let jsonStr = JSON.stringify(data)
        const sql = `INSERT INTO clients (data) VALUES ('${jsonStr}');`
        this.dbConnect.query(sql, (err, result) => {
            if (err) {
                this.utils.log('insertClient error : ' + err.stack)
            }
        })
    }

    async deleteClients() {
        const sql = `DELETE FROM clients;`
        let tableData = await new Promise(r => this.dbConnect.query(sql, (err, result) => {
            if (err) {
                this.utils.log('deleteClients error : ' + err.stack)
                r(false)
            } else {
                r(true)
            }
        }))
        return tableData
    }
}

export default Db;