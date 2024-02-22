import axios from 'axios';
import Utils from './Utils.js';

class Api {
    static API_KEY = '006b55a0c1904396a8815b33a52063bd'
    static USER = 'jpatalano@staturesoftware.com'
    static PASSWORD = 'J@e12399'

    static EVENTS = [
        //Site
        'site.created',
        'site.updated',
        'site.deactivated',
        //Business Day Closure
        'siteBusinessDayClosure.created',
        'siteBusinessDayClosure.cancelled',
        //Location
        'location.created',
        'location.updated',
        'location.deactivated',
        //Appointment
        'appointmentBooking.created',
        'appointmentBooking.updated',
        'appointmentBooking.cancelled',
        'appointmentAddOn.created',
        'appointmentAddOn.deleted',
        //Class Schedule
        'classSchedule.created',
        'classSchedule.updated',
        'classSchedule.cancelled',
        //Class
        'class.updated',
        //Class Booking
        'classRosterBooking.created',
        'classRosterBookingStatus.updated',
        'classRosterBooking.cancelled',
        //Class Waitlist
        'classWaitlistRequest.created',
        'classWaitlistRequest.cancelled',
        //Class Description
        'classDescription.updated',
        //Client
        'client.created',
        'client.updated',
        'client.deactivated',
        //Merge
        'clientProfileMerger.created',
        //Membership
        'clientMembershipAssignment.created',
        'clientMembershipAssignment.cancelled',
        //
        'clientContract.created',
        'clientContract.updated',
        'clientContract.cancelled',
        //Contract
        'clientSale.created',
        //Staff
        'staff.created',
        'staff.updated',
        'staff.deactivated',
      ]  
    static TIMEOUT = 30000
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
        this.utils.log('subscriptions url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('subscriptions data : ' + this.utils.print_object(data))
            return data
        }    
        return {}
    }

    async subscribe(event) {
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions`
        let content = {
            eventIds: [
                event
              ],
              eventSchemaVersion: 1,
              webhookUrl: 'https://dev1.htt.ai/',
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
                return data
            }  
        } catch(e) {
            this.utils.log('subscribe error : ' + e.stack )  
            throw e      
        }  
        return {}
    }

    async subscribeAll() {
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions`
        let content = {
            eventIds: Api.EVENTS,
              eventSchemaVersion: 1,
              webhookUrl: 'https://dev1.htt.ai/',
              referenceId: `test1`
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
            if (response.status < 300) {
                let data = response.data
                this.utils.log('subscribe data : ' + this.utils.print_object(data))
                return data
            }  
        } catch(e) {
            this.utils.log('subscribe error : ' + e.stack )  
            throw e      
        }  
        return {}
    }

    async patchSubscribe(subscriptionId) {
        if(!subscriptionId) {
            return {}
        }
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions/${subscriptionId}`
        let content = {
            eventIds: Api.EVENTS,
              eventSchemaVersion: 1,
              webhookUrl: 'https://dev1.htt.ai/',
              referenceId: `test1`,
              status: 'Active'
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
            this.utils.log('patch url : ' + url + ' => ' + response.status)
            if (response.status < 300) {
                let data = response.data
                this.utils.log('patch data : ' + this.utils.print_object(data))
                return data
            }  
        } catch(e) {
            this.utils.log('patch error : ' + e.message)   
            throw e     
        }  
    }

    async delete(subscriptionId) {
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
                this.utils.log('delete data : ' + this.utils.print_object(data))
                return data
            }  
        } catch(e) {
            this.utils.log('delete error : ' + e.message)      
            throw e 
        }  
        return {}
    }

    async authToken() {
        let url = `https://api.mindbodyonline.com/public/v6/usertoken/issue`
        let content = {
            Username: Api.USER,
            Password: Api.PASSWORD
        }
        try {
            let response = await axios.post(
                url,
                content,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        'API-Key': Api.API_KEY,
                        siteId: -99,
                        Accept: 'application/json',
                        'Content-Type': 'application/json' 
                    }
                }
            )
            this.utils.log('authToken url : ' + url + ' => ' + response.status)
            if (response.status < 300) {
                let data = response.data
                this.utils.log('authToken data : ' + this.utils.print_object(data))
                return data
            }  
        } catch(e) {
            this.utils.log('authToken error : ' + e.stack )  
            throw e      
        }  
        return {}
    }
}

export default Api;