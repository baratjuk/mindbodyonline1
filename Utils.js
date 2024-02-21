import fs from 'fs';

class Utils {
    logFileName = 'test1.log'

    constructor(logFileName) {
        super.constructor()
        this.logFileName = logFileName
    }

    log(message) {
        fs.appendFileSync(`/tmp/${this.logFileName}`, new Date().toISOString() + ' - ' + message + '\n')
        console.log(message)
    }

    print_object(obj) {
        return `\n${this.print(obj, 0, false)}`
    }  
    
    print_object_and_func(obj) {
        return `\n${this.print(obj, 0, true)}`
    }

    print(printed_object, level, is_func) {
        if(typeof printed_object == 'object') {
            let ret_str = ''
            for(let key in printed_object) {
                let str = ''
                for(let i = 0; i<level; i++) {
                    str += '  '    
                }
                str += `${key} : ` 
                let obj = printed_object[key]
                let type = typeof obj
                if (type == 'boolean' || type == 'number' || type == 'string') {
                    str += `${obj}\n`
                } else if (type == 'object') {
                    if(level < 3) {
                        str += `\n${this.print(obj, level + 1)}`
                    } else {
                        str += '...\n'
                    }
                } else if (type == 'function') {
                    if(is_func) {
                        str += `${obj}\n`
                    } else {
                        str += `${type}\n`
                    }
                } else {
                    str += `${type}\n`
                }
                ret_str += str
            }
            return ret_str
        } else {
            return 'not an object'
        }
    }

}

export default Utils;