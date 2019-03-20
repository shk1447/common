const _ = require('lodash');
const cheerio = require('cheerio');
const axios = require('axios');
module.exports = function() {
    var code_list = [];
    var data_list = {};
    function getSise(code,days){
        var page_num = 1;
        var req_page = parseInt(days/10) + 1;
        var remain_row = parseInt(days%10);
        var url = "http://finance.naver.com/item/sise_day.nhn?code={code}&page={page}";
        return new Promise((resolve, reject) => {
            async function page_req(num,code,rows) {
                try {
                    let response = await axios.get(url.replace('{code}',code).replace('{page}',num));
                    var $ = cheerio.load(response.data);
                    if(page_num === 1) {
                        if($('.pgRR a').length > 0) {
                            var href = $('.pgRR a')[0].attribs.href;
                            page_num = parseInt(href.substring(href.search("page=") + 5, href.length));
                            page_num = page_num > req_page ? req_page : page_num;
                        }
                    }
                    var nodes = $('.type2 tbody tr td span');
                    var row = {};
                    var header = ["날짜", "종가", "전일비", "시가", "고가", "저가", "거래량"]
                    for(var index = 0; index < nodes.length; index++) {
                        var row_num = parseInt(index/7);
                        if(page_num === num && row_num > (remain_row - 1)) {
                            break;
                        }
                        // 날짜, 종가, 전일비, 시가, 고가, 저가, 거래량
                        var i = index%7;
                        var node = nodes[index];
                        row[header[i]] = node.firstChild.data.replace(/\n/gi,"").replace(/\t/gi,"").replace(/,/gi,"");
                        if(i === 6) {
                            rows.push(row);
                            row = {};
                        }    
                    }
                    
                    num++
                    if(num<page_num) {
                        page_req(num,code,rows);
                    } else {
                        data_list[code] = rows;
                        resolve(rows)
                    }
                } catch (err) {
                    page_req(1,code,[]);
                }
            }
            
            page_req(1,code,[]);
        })
    }

    function initialize() {
        var url = "http://finance.naver.com/sise/sise_market_sum.nhn?sosok={exchange}&page={pageNumber}";
        return new Promise((resolve, reject) => {
            function push_code($) {
                var nodes = $('.box_type_l .type_2 tbody tr td a[class]');
                _.each(nodes, (node,index) => {
                    let href = node.attribs.href;
                    var code = href.substring(href.search("code=") + 5, href.length);
                    code_list.push(code);
                })
            }
            async function init_req(k) {
                let response = await axios.get(url.replace("{pageNumber}","1").replace("{exchange}",k.toString()));
                
                var $ = cheerio.load(response.data);
                var href = $('.pgRR a')[0].attribs.href;
                var page_num = parseInt(href.substring(href.search("page=") + 5, href.length));
                push_code($);
                async function page_req(num) {
                    let response = await axios.get(url.replace("{pageNumber}",num).replace("{exchange}",k.toString()))
                    
                    $ = cheerio.load(response.data);
                    push_code($);
                    num++
                    if(num <= page_num) {
                        page_req(num);
                    } else {
                        if(k === 0) init_req(1)
                        else resolve(code_list);
                    }
                }
                page_req(2);
            }
            
            init_req(0);
        })
    }
    initialize();
    return {
        getSise:getSise,
        getCode:function() {
            return code_list;
        }
    }
}();