/*
    Data stores in the JSON format:
    localStorage.setItem(domain, data);
    data = {
        { "record01":
             { "property01": "value" },
             { "property02": "value" }.
             ...
        },
        { "record02":
             { "property01": "value" },
             { "property02": "value" },
             ...
        },
        ...
    };
    @domain - name of data table
    @recordXX - unique name of record in the domain
    @propertyXX - unique name of property in each record
    @value - any value of property
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.asb = factory();
    }
}(this, function () {
    'use strict';
    if (typeof(Storage) === "undefined") {
        alert('Sorry! No Web Storage support...');
        return;
    }
    var util = {
        norm: function(value) {
            if (!value) return "";
            else return value;
        },
        quit: function(value) {
            if (!value) return;
            if (typeof value === 'object')
                for (var i = 0; i < value.length; i++)
                    if (value[i] === null || value[i] === undefined)
                        return;
        },
        prepare: function(value) {
            var nObj = {};
            if (typeof value === 'object')
                return JSON.stringify(value);
            else if (value !== '') {
                nObj[value] = "";
                return JSON.stringify(nObj);
            } else {
                return JSON.stringify(nObj);
            }
        },
    };
    var asb = {
        /*
            Creates empty object in the local storage with key @name
         */
        addDomain: function(name) {
            util.quit(name);
            localStorage.setItem(name, JSON.stringify({}));
        },
        /*
            Creates new record in the @domain
         */
        addRecord: function(domain, record) {
            util.quit(domain, record);
            var data = asb.getData(domain);
            data[record] = {};
            asb.saveData(domain, data);
        },
        /*
            Creates new property in the record
         */
        addProperty: function(domain, record, property) {
            util.quit(domain, record, property);
            var data = asb.getData(domain);
            data[record][property] = "";
            asb.saveData(domain, data);
        },
        /*
            Gets domain by @name from the localStorage
         */
        getDomain: function(name) {
            util.quit(name);
            return localStorage.getItem(name);
        },
        /*
            Gets data from local storage as JSON object
         */
        getData: function(domain) {
            util.quit(domain);
            return JSON.parse(asb.getDomain(domain));
        },
        /*
            Saves data to the domain
         */
        // ToDo: maybe updateDomain method will be enough
        saveData: function(domain, data) {
            util.quit(domain, data);
            asb.updateDomain(domain, data);
        },
        /*
            Updates domain in the local storage
         */
        updateDomain: function(domain, data) {
            util.quit(domain, data);
            localStorage.setItem(domain, JSON.stringify(data));
        },
        /*
            Updates record in the domain
         */
        updateRecord: function(domain, record, property) {
            util.quit(domain, record, property);
            var data = asb.getData(domain);
            data[record] = property;
            asb.saveData(domain, data);
        },
        /*
            Updates property in the record
         */
        updateProperty: function(domain, record, property, value) {
            util.quit(domain, record, property, value);
            var data = asb.getData(domain);
            data[record][property] = value;
            asb.saveData(domain, data);
        },
        pushData: function(domain, record, property, value) {
            util.quit(domain, record, property, value);
            if (!localStorage.getItem(domain))
                asb.addDomain(domain);
            var data = asb.getData(domain);

            if (!data.hasOwnProperty(record))
                asb.addRecord(domain, record);

            data = asb.getData(domain);

            if (!data[record].hasOwnProperty(property))
                asb.addProperty(domain, record, property);

            data = asb.getData(domain);

            data[record][property] = value;
            asb.saveData(domain, data);
        }
    };
    return asb;
}));