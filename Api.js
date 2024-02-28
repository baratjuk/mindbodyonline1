import axios from 'axios';
import Utils from './Utils.js';

class Api {
    static API_KEY = '006b55a0c1904396a8815b33a52063bd'

    static USER = 'Siteowner'
    static PASSWORD = 'apitest1234'
    static SITEID = -99

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
    accessToken = ''
    staffId = ''

    // GoHighLevel
    static HL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFGZnBCQTZjMXQ4RDQyVTlyT0FVIiwiY29tcGFueV9pZCI6IktnUFpGVFZoRHhWM0FjdUdEZnYzIiwidmVyc2lvbiI6MSwiaWF0IjoxNzA4NjU0NzQ4MTQwLCJzdWIiOiJ1c2VyX2lkIn0.RPe6ZVDODH6z4wHMP_bOQtMKW21ENYdMmnEb-QtS5ZM'
    static HL_CLIENT_ID = '65df0226f872554f303a37c9-lt5mdcsu'
    static HL_CLIENT_SECRET = 'f4ad852d-7915-4918-b1a5-262e21c58c9d'
    hlAccessToken = ''

    constructor() {
        super.constructor()
        this.auth()
    }

    // Webhooks

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

    async subscribe(query) {
        let { event } = query
        if(!event) {
            return {"error" : "need 'event' param"}
        }
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

    async patchSubscribe(query) {
        let { id } = query
        if(!id) {
            return {"error" : "need 'id' param"}
        }
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions/${id}`
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

    async delete(query) {
        let { id } = query
        if(!id) {
            return {"error" : "need 'id' param"}
        }
        let url = `https://mb-api.mindbodyonline.com/push/api/v1/subscriptions/${id}`
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

    // Publi API

    async auth() {
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
                        siteId: Api.SITEID,
                        Accept: 'application/json',
                        'Content-Type': 'application/json' 
                    }
                }
            )
            this.utils.log('authToken url : ' + url + ' => ' + response.status)
            if (response.status < 300) {
                let data = response.data
                this.accessToken = data.AccessToken
                this.staffId = data.User.Id
                this.utils.log('authToken data : ' + this.utils.print_object(data))
                return data
            }  
        } catch(e) {
            this.utils.log('authToken error : ' + e.stack )  
            throw e      
        }  
        return {}
    }

    async clients(query) {
        let { page } = query
        if (!page) {
            return {"error" : "need 'page' param"}
        }
        let url = `https://api.mindbodyonline.com/public/v6/client/clients?limit=10&offset=${10*page}`
        let response = await axios.get(
            url,
            {
                timeout: Api.TIMEOUT,
                headers: {
                    'API-Key': Api.API_KEY,
                    siteId: Api.SITEID,
                    Accept: 'application/json',
                    authorization: this.accessToken
                }
            }
        )
        this.utils.log('clients url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('clients data : ' + this.utils.print_object(data))
            return data
        }    
        return {}
    }

    async clientCompleteInfo(query) {
        let { id } = query
        if (!id) {
            return {"error" : "need 'id' param"}
        }
        let url = `https://api.mindbodyonline.com/public/v6/client/clientcompleteinfo?clientId=${id}`
        let response = await axios.get(
            url,
            {
                timeout: Api.TIMEOUT,
                headers: {
                    'API-Key': Api.API_KEY,
                    siteId: Api.SITEID,
                    Accept: 'application/json',
                    authorization: this.accessToken
                }
            }
        )
        this.utils.log('clientCompleteInfo url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('clientCompleteInfo data : ' + this.utils.print_object(data))
            return data
        }    
        return {}
    }

    async addAppointment(query) {
        let { id, location } = query
        if (!id || !location) {
            return {"error" : "need 'id', 'location' param"}
        }
        let url = `https://api.mindbodyonline.com/public/v6/appointment/addappointment`
        let content = {
            ClientId: id,
            StaffId: this.staffId,
            LocationId : location
        }
        let response = await axios.post (
            url,
            content,
            {
                timeout: Api.TIMEOUT,
                headers: {
                    'API-Key': Api.API_KEY,
                    siteId: Api.SITEID,
                    Accept: 'application/json',
                    authorization: this.accessToken
                }
            }
        )
        this.utils.log('clients url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('clients data : ' + this.utils.print_object(data))
            return data
        }    
        return {}
    }

    // GoHighLevel

    async hlOauth(res, query) {
        let { code } = query
        if(code) {
            this.utils.log('hlOauth code : ' + code)
            return await this.hlAccessToken(code)
        }
        const redirectUri = 'https://dev1.htt.ai/hl-oauth' 
        const clientId = Api.HL_CLIENT_ID
        const scope = 'contacts.readonly calendars.readonly'
        const url = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scope}`
        this.utils.log('oauth url : ' + url)
        res.writeHead(302, {'Location': url});
        res.end();
        return null
    }

    async hlAccessToken(code) {
        let url = `https://services.leadconnectorhq.com/oauth/token`
        let content = {
            client_id: Api.HL_CLIENT_ID,
            client_secret: Api.HL_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            user_type: 'Location',
            redirect_uri: 'https://dev1.htt.ai/hl-oauth'
        }
        try {
            let response = await axios.post(
                url,
                content,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded' 
                    }
                }
            )
            this.utils.log('hlAccessToken url : ' + url + ' => ' + response.status)
            if (response.status < 300) {
                let data = response.data
                this.hlAccessToken = data.access_token
                this.utils.log('hlAccessToken data : ' + this.utils.print_object(data))
                return data
            }  
        } catch(e) {
            this.utils.log('hlAccessToken error : ' + e.stack )  
            throw e      
        }  
        return {}
    }

    async hlAddAppointment(query) {
        let { email, phone, slot } = query
        if (!email || !slot) {
            return {"error" : "need 'email', 'slot' param"}
        }
        let url = `https://rest.gohighlevel.com/v1/appointments/`
        let content = {
            email,
            phone,
            selectedSlot : slot,
            selectedTimezone: 'America/New_York',
            calendarId: 'KOO9Rxf2W8HJvILJkUSw'
        }
        let response = await axios.post (
            url,
            content,
            {
                timeout: Api.TIMEOUT,
                headers: {
                    Authorization: `Bearer ${Api.HL_API_KEY}`,
                }
            }
        )
        this.utils.log('hlAddAppointment url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('hlAddAppointment data : ' + this.utils.print_object(data))
            return data
        }    
        return {}
    }

    async hlContacts() {
        let url = `https://rest.gohighlevel.com/v1/contacts/`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Authorization: `Bearer ${Api.HL_API_KEY}`,
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + this.utils.print_object(data))
                return data
            }
        } catch (e) {
            this.utils.log('hlTest error : ' + e.stack)
            throw e
        }
        return {}
    }

    async hlLocations() {
        let url = `https://rest.gohighlevel.com/v1/locations/`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Authorization: `Bearer ${Api.HL_API_KEY}`,
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + this.utils.print_object(data))
                return data
            }
        } catch (e) {
            this.utils.log('hlTest error : ' + e.stack)
            throw e
        }
        return {}
    }

    async hlUsers(query) {
        let { location } = query
        if (!location) {
            return {"error" : "need 'location' param"}
        }
        let url = `https://rest.gohighlevel.com/v1/users/?locationId=${location}`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Authorization: `Bearer ${Api.HL_API_KEY}`,
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + this.utils.print_object(data))
                return data
            }
        } catch (e) {
            this.utils.log('hlTest error : ' + e.stack)
            throw e
        }
        return {}
    }

    async hlCalendarsTeams() {
        let url = `https://rest.gohighlevel.com/v1/calendars/teams`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Authorization: `Bearer ${Api.HL_API_KEY}`,
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + this.utils.print_object(data))
                return data
            }
        } catch (e) {
            this.utils.log('hlTest error : ' + e.stack)
            throw e
        }
        return {}
    }

    async hlTest() {
        let url = `https://rest.gohighlevel.com/v1/appointments?startDate=1704096058000&endDate=1709280058000&teamId=0XHCCPlm4RdW6wOM2Pq8&includeAll=true`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Authorization: `Bearer ${Api.HL_API_KEY}`,
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + this.utils.print_object(data))
                return data
            }
        } catch (e) {
            this.utils.log('hlTest error : ' + e.stack)
            throw e
        }
        return {}
    }
}

export default Api;