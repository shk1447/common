import axios from 'axios';

export default  {
    post : function(url, body) {
        return axios.post(url, body).then(function(response) {
            return response.data
        }).catch(function(err) {
            throw err;
        })
    },
    get : function(url) {
        return axios.get(url).then(function(response) {
            return response.data
        }).catch(function(err) {
            throw err;
        })
    },
    put : function(url, body) {
        return axios.put(url, body).then(function(response) {
            return response.data
        }).catch(function(err) {
            throw err;
        })
    },
    delete : function(url, body) {
        return axios.delete(url, body).then(function(response) {
            return response.data
        }).catch(function(err) {
            throw err;
        })
    }
}