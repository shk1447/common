const _ = require('lodash');
const fs = require('fs');
const fsPath = require('fs-path');
const path = require('path');
const pack_path = path.resolve(process.env.root_path, './custom/packs');
const module_loader = require('../utils/module_loader');

var runtime_api = {}

function init(renobit) {
    this.renobit = renobit;
}

function load() {
    // 서비스 시작시 설치된 pack에 따라 api를 추가하는 부분
    if(fs.existsSync(pack_path)) {
        var packs = fs.readdirSync(pack_path);
        _.each(packs, (pack_name,k) => {
            var api_path = path.resolve(pack_path, './' + pack_name + '/api');
            var exists = fs.existsSync(api_path);
            if(exists) {
                var init_data = {
                    asset_comp_list:[],
                    asset_type_list:[]
                }
                var type_list_path = path.resolve(pack_path, './' + pack_name + '/type_list.json');
                var type_content = fs.readFileSync(type_list_path, 'utf8');
                init_data.asset_type_list = JSON.parse(type_content);
                var init_path = path.resolve(pack_path, './' + pack_name + '/component_files.json');
                var content = fs.readFileSync(init_path, 'utf8');
                var components = JSON.parse(content);
                _.each(components,(comp,index) => {
                    if(comp.asset_type) {
                        init_data.asset_comp_list.push({
                            name:comp.name,
                            asset_type:comp.asset_type,
                            batch:true
                        })
                    }
                });
                var apis = fs.readdirSync(api_path);
                _.each(apis, (api, k) => {
                    var api_file = path.resolve(api_path, './' + api);
                    var r = process.env.mode === "production" ? module_loader(fs.readFileSync(api_file, 'utf8')) : require(api_file);
                    runtime_api[api_file] = r(this.renobit);
                    runtime_api[api_file].regist(init_data);
                })
            }
        });
    }
}

function regist(pack_name, init_data) {
    // 플러그인 설치시 api 등록
    var api_path = path.resolve(pack_path, './' + pack_name + '/api');
    var exists = fs.existsSync(api_path);
    if(exists) {
        var apis = fs.readdirSync(api_path);
        _.each(apis, (api, k) => {
            var api_file = path.resolve(api_path, './' + api);
            var r = process.env.mode === "production" ? module_loader(fs.readFileSync(api_file, 'utf8')) : require(api_file);
            runtime_api[api_file] = r(this.renobit);
            runtime_api[api_file].regist(init_data);
        })
    }
}

function unregist(pack_name) {
    var api_path = path.resolve(pack_path, './' + pack_name + '/api');
    var exists = fs.existsSync(api_path);
    if(exists) {
        var apis = fs.readdirSync(api_path);
        _.each(apis, (api, k) => {
            var api_file = path.resolve(api_path, './' + api);
            if(runtime_api[api_file]) {
                runtime_api[api_file].unregist();
                delete runtime_api[api_file];
                delete require.cache[api_file];
            }
        })
    }
}

module.exports = {
    init:init,
    load:load,
    regist:regist,
    unregist:unregist
}