import axios from 'axios';
import Utils from './Utils.js';

class Api {
    static API_KEY = '006b55a0c1904396a8815b33a52063bd'
    static TIMEOUT = 5000
    utils = new Utils('api_test1.log')

    async subscriptions() {
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions`
        let response = await axios.get(
            url,
            {
                timeout: Api.TIMEOUT,
                headers: {
                    'API-Key': Api.API_KEY,
                    Accept: 'application/json',
                }
            }
        )
        this.utils.log('subscribe url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('subscribe data : ' + this.utils.print_object(data))
            return data
        }    
        return {}
    }
    
    async subscribe(query) {
        let {event} = query
        if(!event) {
            return
        }
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions`
        let content = {
            eventIds: [
                event
              ],
              eventSchemaVersion: 1,
              webhookUrl: 'https://3.65.29.31/',
              referenceId: `test1_${event}`
        }
        try {
            let response = await axios.post(
                url,
                content,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        'API-Key': Api.API_KEY,
                        Accept: 'application/json',
                    }
                }
            )
            this.utils.log('subscribe url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                try {
                    this.utils.log('subscribe data : ' + this.utils.print_object(data))
                } catch (ex) {
                    this.utils.log('subscribe parse error : ' + ex.message)  
                }
            }  
        } catch(e) {
            this.utils.log('subscribe error : ' + e.stack )  
            // throw e      
        }  
        return {}
    }

    async patchSubscribe(subscriptionId) {
        if(!subscriptionId) {
            return
        }
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions/${subscriptionId}`
        let content = {
            eventIds: [
                event
              ],
              eventSchemaVersion: 1,
              webhookUrl: 'https://3.65.29.31/',
              referenceId: `test1_${event}`
        }
        try {
            let response = await axios.patch(
                url,
                content,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        'API-Key': Api.API_KEY,
                        Accept: 'application/json',
                    }
                }
            )
            this.utils.log('subscribe url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('subscribe data : ' + this.utils.print_object(data))
            }  
        } catch(e) {
            this.utils.log('subscribe error : ' + e.message)   
            throw e     
        }  
    }

    async deleteSubscribe(subscriptionId) {
        if(!subscriptionId) {
            return
        }
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions/${subscriptionId}`
        try {
            let response = await axios.delete (
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        'API-Key': Api.API_KEY,
                        Accept: 'application/json',
                    }
                }
            )
            this.utils.log('delete url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('subscribe data : ' + this.utils.print_object(data))
            }  
        } catch(e) {
            this.utils.log('subscribe error : ' + e.message)      
             throw e 
        }  
    }
}

export default Api;