import axios from 'axios';

module.exports = {
    post : function(url, body) {
        axios.post(url, body).then(function(response) {
            console.log(response);
        }).catch(function(err) {
            throw err;
        })
    },
    get : function(url) {
        axios.get(url).then(function(response) {
            console.log(response);
        }).catch(function(err) {
            throw err;
        })
    },
    put : function(url, body) {
        axios.put(url, body).then(function(response) {
            console.log(response);
        }).catch(function(err) {
            throw err;
        })
    },
    delete : function(url, body) {
        axios.delete(url, body).then(function(response) {
            console.log(response);
        }).catch(function(err) {
            throw err;
        })
    }
}