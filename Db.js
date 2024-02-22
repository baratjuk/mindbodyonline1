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

    insertApi(url, answer) {
        let jsonStr = JSON.stringify(answer)
        let sql = `INSERT INTO api (url, answer, created_at) VALUES ('${url}', '${jsonStr}', now());`
        this.dbConnect.query(sql, function (err, result) {
            if (err) {
                throw err
            }
            this.utils.log("insertApi")
        })
    }
    
    insertWebhook(method, url, data) {
        let jsonStr = JSON.stringify(data)
        let sql = `INSERT INTO webhooks (method, url, data, created_at) VALUES ('${method}', '${url}', '${jsonStr}', now());`
        this.dbConnect.query(sql, function (err, result) {
            if (err) {
                throw err
            }
            this.utils.log("insertWebhook")
        })
    }
}

export default Db;