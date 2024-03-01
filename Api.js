import axios from 'axios';
import Utils from './Utils.js';
import Db from './Db.js';

class Api {
    static API_KEY = '006b55a0c1904396a8815b33a52063bd'

    // static USER = 'Siteowner'
    // static PASSWORD = 'apitest1234'
    // static SITEID = -99

    static USER = 'jpatalano@thecovery.com'
    static PASSWORD = 'Joe.12399'
    static SITEID = -2147481231

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
    db

    // Mindbodyonline
    accessToken = ''
    staffId = ''

    // GoHighLevel
    hlAccessToken

    constructor(db) {
        super.constructor()
        this.db = db
        this.init()
    }

    async init() {
        let data = await this.db.getStoreObj(Db.STORE.GHL) 
        this.hlAccessToken = data.accessToken
        data = await this.db.getStoreObj(Db.STORE.MBO) 
        this.accessToken = data.accessToken
        this.staffId = data.staffId
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
            this.utils.log('subscriptions data : ' + JSON.stringify(data, null, 4))
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
                this.utils.log('subscribe data : ' + JSON.stringify(data, null, 4))
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
                this.utils.log('patch data : ' + JSON.stringify(data, null, 4))
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
                this.utils.log('delete data : ' + JSON.stringify(data, null, 4))
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

                let storeData = await this.db.getStoreObj(Db.STORE.MBO) 
                storeData.accessToken = data.AccessToken
                storeData.staffId = data.User.Id
                this.db.setStoreObj(Db.STORE.MBO, storeData)

                this.utils.log('authToken data : ' + JSON.stringify(data, null, 4))
                return data
            }  
        } catch(e) {
            // throw e      
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('authToken error : ' + JSON.stringify(error, null, 4))
            return error
        }  
        return {}
    }

    async locations() {
        let url = `https://api.mindbodyonline.com/public/v6/site/locations`
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
        this.utils.log('locations url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('locations data : ' + JSON.stringify(data, null, 4))
            return data
        }    
        return {}
    }

    async sessionTypesIDs() {
        let url = `https://api.mindbodyonline.com/public/v6/site/sessiontypes`
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
        this.utils.log('sessionTypesIDs url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('sessionTypesIDs data : ' + JSON.stringify(data, null, 4))
            return data
        }    
        return {}
    }

    async scheduleItems(query) {
        let start = '2024-02-29T12%3A00%3A00.000Z'
        let end = '2024-03-29T12%3A00%3A00.000Z'
        let url = `https://api.mindbodyonline.com/public/v6/appointment/scheduleitems?startDate=${start}&endDate=${end}`
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
        this.utils.log('scheduleItems url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('scheduleItems data : ' + JSON.stringify(data, null, 4))
            return data
        }    
        return {}
    }

    async availableDates(query) {
        let start = '2024-02-29T12%3A00%3A00.000Z'
        let end = '2024-03-29T12%3A00%3A00.000Z'
        let session = 1371
        let url = `https://api.mindbodyonline.com/public/v6/appointment/availabledates?startDate=${start}&endDate=${end}&sessionTypeId=${session}`
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
        this.utils.log('scheduleItems url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('scheduleItems data : ' + JSON.stringify(data, null, 4))
            return data
        }    
        return {}
    }

    async bookableItems(query) {
        let start = '2024-02-29T12%3A00%3A00.000Z'
        let end = '2024-03-29T12%3A00%3A00.000Z'
        let session1 = 1371
        let session2 = 1372
        let url = `https://api.mindbodyonline.com/public/v6/appointment/bookableitems?startDate=${start}&endDate=${end}&sessionTypeIds[0]=${session1}&sessionTypeIds[1]=${session2}`
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
        this.utils.log('bookableItems url : ' + url + ' => ' + response.status)
        if (response.status === 200) {
            let data = response.data
            this.utils.log('bookableItems data : ' + JSON.stringify(data, null, 4))
            return data
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
            this.utils.log('clients data : ' + JSON.stringify(data, null, 4))
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
            this.utils.log('clientCompleteInfo data : ' + JSON.stringify(data, null, 4))
            return data
        }    
        return {}
    }

    async addAppointment(query) {
        // let { id, location, session } = query
        // if (!id || !location || !session) {
        //     return { "error": "need 'id, location, session' param" }
        // }
        let url = `https://api.mindbodyonline.com/public/v6/appointment/addappointment`
        let content = {
            ClientId: 100000000,
            LocationId: 1,
            StaffId: 100000001,
            StartDateTime: '2024-03-01T09:00:00-08:00',
            EndDateTime: '2024-03-01T09:30:00-08:00',
            SessionTypeId: 1371,
            ScheduleType: 'All',
        }
        this.utils.log('addAppointment content : ' + JSON.stringify(content, null, 4))
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
                        authorization: this.accessToken
                    }
                }
            )
            this.utils.log('addAppointment url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('addAppointment data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('addAppointment error : ' + JSON.stringify(error, null, 4))
            return error
        }
        return {}
    }

    // GoHighLevel
    static HL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlFGZnBCQTZjMXQ4RDQyVTlyT0FVIiwiY29tcGFueV9pZCI6IktnUFpGVFZoRHhWM0FjdUdEZnYzIiwidmVyc2lvbiI6MSwiaWF0IjoxNzA4NjU0NzQ4MTQwLCJzdWIiOiJ1c2VyX2lkIn0.RPe6ZVDODH6z4wHMP_bOQtMKW21ENYdMmnEb-QtS5ZM'
    static HL_CLIENT_ID = '65df0226f872554f303a37c9-lt5mdcsu'
    static HL_CLIENT_SECRET = 'f4ad852d-7915-4918-b1a5-262e21c58c9d'
    // static HL_LOCATION_ID = 'QFfpBA6c1t8D42U9rOAU'
 
    async hlOauth(res, query) {
        let { code } = query
        if(code) {
            this.utils.log('hlOauth code : ' + code)
            let data = await this.db.getStoreObj(Db.STORE.GHL) 
            let tokenData = await this.hlToken(code) 
            data.code = code
            data.accessToken = tokenData.access_token
            this.hlAccessToken = tokenData.access_token
            data.refreshToken = tokenData.refresh_token
            this.db.setStoreObj(Db.STORE.GHL, data)
            return tokenData
        }
        const redirectUri = 'https://dev1.htt.ai/hl-oauth' 
        const clientId = Api.HL_CLIENT_ID
        const scope = 'contacts.readonly calendars.readonly calendars.write calendars/events.readonly calendars/events.write calendars/groups.readonly calendars/groups.write calendars/resources.readonly calendars/resources.write'
        const url = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scope}`
        this.utils.log('oauth url : ' + url)
        res.writeHead(302, {'Location': url});
        res.end();
        return null
    }

    async hlToken(code) {
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
                this.utils.log('hlAccessToken data : ' + JSON.stringify(data, null, 4))
                return data
            }  
        } catch(e) {   
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlAccessToken error : ' + JSON.stringify(error, null, 4))
            return error
        }  
        return {}
    }

    async hlAddAppointment(query) {
        let { start, end } = query
        if (!start || !end) {
            return { "error": "need 'start', 'end' param" }
        }
        let url = `https://services.leadconnectorhq.com/calendars/events/appointments`
        let content = {
            calendarId: 'KOO9Rxf2W8HJvILJkUSw',
            locationId: 'QFfpBA6c1t8D42U9rOAU',
            contactId: 'gzRquCYXnqBAKogqBprW',
            // startTime: '2024-03-04T11:00:00-05:00',
            // endTime: '2024-03-04T11:30:00-05:00',
            startTime: start,
            endTime: end,
            title: 'Test Event',
            appointmentStatus: 'new',
            assignedUserId: 'ns8F6riHLV3uFivbGV8T',
            address: 'Zoom',
            ignoreDateRange: false,
            toNotify: false
        }
        try {
            let response = await axios.post(
                url,
                content,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.hlAccessToken}`,
                        'Content-Type': 'application/json',
                        Version: '2021-04-15'
                    }
                }
            )
            this.utils.log('hlAddAppointment url : ' + url + ' => ' + response.status)
            if (response.status < 300) {
                let data = response.data
                this.utils.log('hlAddAppointment data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlAddAppointment error : ' + JSON.stringify(error, null, 4))
            return error
        }
        return {}
    }

    async hlCalendars(query) {
        let { location } = query
        if (!location) {
            return {"error" : "need 'location' param"}
        }
        let url = `https://services.leadconnectorhq.com/calendars/?locationId=${location}`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.hlAccessToken}`,
                        Version: '2021-07-28'
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlTest error : ' + JSON.stringify(error, null, 4))
            return error
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
            this.utils.log('hlContacts url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlContacts data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlContacts error : ' + JSON.stringify(error, null, 4))
            return error
        }
        return {}
    }

    async hlContactsV2(query) {
        let { location } = query
        if (!location) {
            return {"error" : "need 'location' param"}
        }
        let url = `https://services.leadconnectorhq.com/contacts/?locationId=${location}`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.hlAccessToken}`,
                        Version: '2021-07-28'
                    }
                }
            )
            this.utils.log('hlContactsV2 url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlContactsV2 data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlContactsV2 error : ' + JSON.stringify(error, null, 4))
            return error
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
            this.utils.log('hlLocations url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlLocations data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlLocations error : ' + JSON.stringify(error, null, 4))
            return error
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
            this.utils.log('hlUsers url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlUsers data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlUsers error : ' + JSON.stringify(error, null, 4))
            return error
        }
        return {}
    }

    async hlTest() {
        let url = `https://services.leadconnectorhq.com/calendars/?locationId=${Api.HL_LOCATION_ID}`
        try {
            let response = await axios.get(
                url,
                {
                    timeout: Api.TIMEOUT,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.hlAccessToken}`,
                        Version: '2021-07-28'
                    }
                }
            )
            this.utils.log('hlTest url : ' + url + ' => ' + response.status)
            if (response.status === 200) {
                let data = response.data
                this.utils.log('hlTest data : ' + JSON.stringify(data, null, 4))
                return data
            }
        } catch (e) {
            let error = {error: {data: e.response.config.data, answer: e.response.data}}
            this.utils.log('hlTest error : ' + JSON.stringify(error, null, 4))
            return error
        }
        return {}
    }
}

export default Api;