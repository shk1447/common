//const d3 = require('d3');
const _ = require('lodash');
const randomColor = require('randomcolor');

require('./d3_extension/keybinding');

common.view = (function() {
    var width, height, container_div;
    var outer, vis, outer_background, link_group, node_types;
    var x, y, gX, gY, xAxis, yAxis, zoom;
    var node_size = 16;
    var outer_transform = {
        x:0,
        y:0,
        k:1
    };
    
    var lineGenerator;

    var activeNodes = [];
    var activeLinks = [];
    var selected_id = [];

    var types = [];
    var node_type = {};

    var color_define = {
        "speed" : {
            "1G":"#008000",
            "10G":"#7CFC00",
            "25G":"#4B0082",
            "100G":"#008080"
        }
    }

    function canvasContextMenu() {
        var x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k
        var node_info = {
            status:~~(Math.random() * (5 - 0 + 1)) + 0,
            x:x,
            y:y
        }
        common.events.emit('contextmenu', {
            active:true,
            left : d3.event.pageX,
            top : d3.event.pageY,
            params : {
                node_info:node_info,
                node_types:types,
                event:d3.event
            }
        });
        d3.event.stopPropagation();
        d3.event.preventDefault();
    }

    function canvasMouseDown() {
        common.events.emit('contextmenu', {
            active:false,
            x : d3.event.pageX,
            y : d3.event.pageY,
            params : {}
        });
        
        //selected_id = [];
        redraw();
    }

    function canvasMouseMove() {
        // current_pos.x = Math.round((d3.event.offsetX - outer_transform.x) / outer_transform.k);
        // current_pos.y = Math.round((d3.event.offsetY - outer_transform.y) / outer_transform.k);
    }

    function canvasDblClick() {
        console.log('dbl click!!!');
    };

    function zoomed() {
        outer_transform = d3.event.transform;
        vis.attr("transform", d3.event.transform);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
        
        //redraw();
    }

    function dragstarted(d) {
        //d3.event.stopPropagation();
        d3.select(this).classed("dragging", true);
        //redraw();
    }
    
    function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        redraw();
    }
    
    function dragended(d) {
        d3.select(this).classed("dragging", false);
        //redraw();
    }

    function addNodes(node) {
        activeNodes.push(node);
        redraw();
    }

    var activeDropShadow, activeBlur;

    var dropShadow = {
        'stdDeviation': 2,
        'dx': 0,
        'dy': 0,
        'slope': 0.5,
        'type': 'linear'
    };

    function addDrawDropShadow() {
        activeBlur = 'blur';
        activeDropShadow = 'dropshadow';

        var defs = outer.append('defs')
        var blur_filter = defs.append('filter').attr('id', activeBlur)
        blur_filter.append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('stdDeviation', parseInt(dropShadow.stdDeviation))
    
        var filter = defs.append('filter')
                .attr('id', activeDropShadow)
                .attr('filterUnits','userSpaceOnUse');
    
        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', parseInt(dropShadow.stdDeviation));
    
        filter.append('feOffset')
            .attr('dx', parseInt(dropShadow.dx))
            .attr('dy', parseInt(dropShadow.dy));
    
        var feComponentTransfer = filter.append('feComponentTransfer');
        feComponentTransfer
            .append('feFuncA')
                .attr('type', dropShadow.type)
                .attr('slope', parseFloat(dropShadow.slope));
    
        var feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    }

    function nodeClicked(node, node_info) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        if(selected_id.includes(node_info.id)) {
            selected_id.splice(selected_id.indexOf(node_info.id), 1);
        } else {
            selected_id.push(node_info.id);
        }
        redraw();
    }

    function redraw() {
        var node = vis.selectAll(".nodegroup").data(activeNodes, function(d) { return d.id });

        node.exit().remove();

        var nodeEnter = node.enter().insert("svg:g")
            .attr("class", "node nodegroup");
        
        // 신규
        nodeEnter.each(function(d,i) {
            var node = d3.select(this);
            node.attr("id",d.id)
                .attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; })
                .style("cursor", "pointer")
                .on('dblclick', function(){
                    var k, kh, kw, x, y;
                    kw = (container_div.clientWidth - container_div.clientWidth/10) / node.w;
                    kh = (container_div.clientHeight - container_div.clientHeight/10) / node.h;
                    k = d3.min([kw,kh])/4;
                    x = container_div.clientWidth / 2 - d.x * k;
                    y = container_div.clientHeight / 2 - d.y * k;
                    var focusing = d3.zoomIdentity.translate(x,y).scale(k);
                    outer_transform = focusing;
                    outer.transition().duration(1200).call(zoom.transform, focusing)
                        .on("end", function() {
                            console.log(d);
                            common.events.emit('popup', {
                                name : 'chartModal',
                                params : d
                            });
                        })
                })
                .on('click', (function() { var node = d; return function(d,i) { nodeClicked(d3.select(this),node) }})())
                .on('contextmenu', function() {
                    console.log(d);
                    // d3.event.stopPropagation();
                    // d3.event.preventDefault();
                })
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
            node.w = node_size;
            node.h = node_size;
            
            if(d.status) {
                var anim_alarm = node.append("circle")
                                .attr("r", node_size)
                                .attr("fill", "rgba(255,0,0,0)")
                                .style("stroke", d.status > 0 ? "red" : 'blue')
                                .style("stroke-width", 0)
                var anim_alarm2 = node.append("circle")
                                .attr("r", node_size)
                                .attr("fill", "rgba(255,0,0,0)")
                                .style("stroke", d.status > 0 ? "red" : 'blue')
                                .style("stroke-width", 0)
                
                var anim_alarm3 = node.append("circle")
                                .attr("r", node_size)
                                .attr("fill", "rgba(255,0,0,0)")
                                .style("stroke", d.status > 0 ? "red" : 'blue')
                                .style("stroke-width", 0)

                function repeat() {
                    anim_alarm.attr('r', node_size*0.3).attr('opacity', 1).style("stroke-width", 0);
                    anim_alarm.transition()
                                .duration(1000)
                                .attr("r", node_size*1.4)
                                .attr('opacity', 0)
                                .style("stroke-width", 2.5)
                            .on("end", repeat)
                    anim_alarm2.attr('r', node_size*0.6).attr('opacity', 1).style("stroke-width", 0);
                    anim_alarm2.transition()
                                .duration(1000)
                                .attr("r", node_size*1.4)
                                .attr('opacity', 0)
                                .style("stroke-width", 2.5)
                            .on("end", repeat)
                    anim_alarm3.attr('r', node_size*0.9).attr('opacity', 1).style("stroke-width", 0);
                    anim_alarm3.transition()
                                        .duration(1000)
                                        .attr("r", node_size*1.4)
                                        .attr('opacity', 0)
                                        .style("stroke-width", 2.5)
                                    .on("end", repeat)
                }
                
                repeat();
            }

            if(d.supstance && d.supstance.length > 0) {
                d.node = node.append("rect")
                    .attr('rx', node_size/4)
                    .attr('x', -node_size)
                    .attr('y', -node_size)
                    .attr("width", node_size*2)
                    .attr("height", node_size*2)
            } else {
                d.node = node.append("circle")
                    .attr("r", node_size)
            }
            d.node.style("cursor", "pointer")
                .attr("class", "node")
                .attr("fill",function(d) { 
                    var color = 'rgb(166, 187, 207)';
                    if(d.total_status === "상승") {
                        color = 'rgb(200, 150, 150, 1)';
                    } else if(d.total_status === "하락") {
                        color = 'rgb(150, 150, 200, 1)';
                    }
                    return color;
                })
                .attr('stroke', function(d) {
                    var color = '#999';
                    if(d.last_state === "상승") {
                        color = 'red'
                    } else if(d.last_state === "하락") {
                        color = 'blue'
                    }
                    return color;
                })
            
            // var icon_url = "/icons/server.svg";
            
            // node.append("image").attr("xlink:href", icon_url).attr("x", -node_size/2).attr("y", -node_size/2).attr("width", node_size).attr("height", node_size);

            node.append('svg:text').attr('y', node_size+12).style('stroke', 'none').style("text-anchor", "middle").text(d.name);
        });

        // 갱신
        node.each(function(d,i) {
            var thisNode = d3.select(this);
            
            thisNode.attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; });

            if(selected_id.includes(d.id)) {
                d.node.classed('selected', true)
                d.node.attr('filter', 'url(#' + activeDropShadow + ')' );
                // d.node.transition().duration(250).attr('width', node_size*2*2 ).attr('height', node_size*2*2 ).attr("fill", '#eaedf1')
                // .on("end", function() {

                // })
            } else {
                d.node.classed('selected', false)
                d.node.attr('filter', null );
                // d.node.transition().duration(250).attr('width', node_size*2*2 ).attr('height', node_size*2).attr("fill",function(d) { 
                //     var color = 'rgb(166, 187, 207)';
                //     if(d.total_status === "상승") {
                //         color = 'rgb(200, 150, 150, 1)';
                //     } else if(d.total_status === "하락") {
                //         color = 'rgb(150, 150, 200, 1)';
                //     }
                //     return color;
                // });
            }
        });

        var link = link_group.selectAll(".link").data(activeLinks, function(d) { return d.source+":"+d.target });

        var linkEnter = link.enter().insert("svg:g")
            .attr("class", "link");

        linkEnter.each(function(d,i) {
            var l = d3.select(this);
            l.append("svg:path").attr("class", "link_background link_path");
            l.append("svg:path").attr('class', 'link_line link_path')
            l.append("svg:path").attr('class', 'link_anim')
            if(!d.sourceNode) d.sourceNode = activeNodes.find(function(a) { return a.id === d.source});
            if(!d.targetNode) d.targetNode = activeNodes.find(function(a) { return a.id === d.target});
            l.append('svg:text')
            .attr('class', 'volume_power')
            .attr('x', (d.sourceNode.x + d.targetNode.x)/2)
            .attr('y', (d.sourceNode.y + d.targetNode.y)/2)
            .style('stroke', 'none').text(Math.round(d.volume_percent));
        })
        link.exit().remove();

        var speed_texts = link_group.selectAll('.volume_power');

        speed_texts.each(function(d,i) {
            var text = d3.select(this);
            var text_width = text.node().getComputedTextLength()
            text.attr('x', (d.sourceNode.x + d.targetNode.x)/2 - (text_width/2))
            .attr('y', (d.sourceNode.y + d.targetNode.y)/2)
        })

        var links = link_group.selectAll('.link_path')
        links.each(function(d,i) {
            var thisLink = d3.select(this);
            var id = d.sourceNode.id + ":" + d.targetNode.id;
            var path_data = lineGenerator([[d.sourceNode.x, d.sourceNode.y],[d.targetNode.x, d.targetNode.y]])
            thisLink.attr("d", path_data).attr("stroke-width", node_size/4).attr('stroke','#888');
            if(selected_id.includes(id)) {
                thisLink.attr('stroke', '#ff7f0e');
            }
            if(selected_id.includes(d.sourceNode.id) || selected_id.includes(d.targetNode.id)) {
                var result = activeNodes.filter(function(a) {return a.id === d.sourceNode.id || a.id === d.targetNode.id});
                result.forEach(function(v,i) {
                    v.node.attr('filter', 'url(#' + activeDropShadow + ')' );
                })
                thisLink.attr('stroke', color_define.speed[d.speed] ? color_define.speed[d.speed] : '#ff7f0e');
            }
        })
        // var anim_links = link_group.selectAll('.link_anim');
        // anim_links.each(function(d,i) {
        //     var thisLink = d3.select(this);
        //     var path_data = lineGenerator([[d.sourceNode.x, d.sourceNode.y],[d.targetNode.x, d.targetNode.y]])
        //     thisLink.attr("d", path_data).attr("stroke-width", node_size/4)
        //         .attr('stroke', 'rgb(221,221,221)');
        //     var totalLength = thisLink.node().getTotalLength();
        //     thisLink.attr("stroke-dasharray", totalLength/8 + " " + totalLength);
        //     function repeat() {
        //         thisLink.attr('stroke-dashoffset', totalLength + (totalLength/4));
        //         thisLink.transition()
        //             .duration(20000/d.volume_percent)
        //             .attr("stroke-dashoffset", totalLength/8)
        //         .on("end", repeat)
        //     }
        //     repeat();
        // })
    }

    function deleteItem() {
        var node_index = activeNodes.findIndex(function(d) {return selected_id.includes(d.id)});
        if(node_index >= 0) {
            var remove_index = [];
            var link_length = activeLinks.length;
            for(var i = 0; i < link_length; i++) {
                var d = activeLinks[i];
                if((selected_id.includes(d.sourceNode.id) || selected_id.includes(d.targetNode.id))) {
                    remove_index.push(i);
                }
            }
            activeNodes.splice(node_index, 1);

            remove_index.sort(function(a,b){return b-a});
            remove_index.forEach(function(link_index) {
                activeLinks.splice(link_index, 1);
            })
            redraw();
        }
    }

    function setNodeType(type) {
        var type_size = {width:node_size*2,height:node_size};
        var margin = 5;
        var color_array = randomColor({
            count: type.length,
            hue: 'blue'
        })
        types = type;
        type.forEach(function(d,i) {
            var type_info = d;
            var y = (type_size.height*i) + (margin*i);
            var node_type_rect = node_types.append('rect').attr('rx', 5).attr('x', 0).attr('y', y)
                        .attr('width', type_size.width).attr('height', type_size.height).attr('fill', color_array[i])
                        .style("stroke", "#333")
                        .style("cursor", "pointer");

            node_type_rect.on('click', function(d) {
                            console.log(type_info)
                        })
                        .on('mouseover', function(d) {
                            node_type_rect.style('stroke', '#ff7f0e')
                        })
                        .on('mouseout', function(d) {
                            node_type_rect.style('stroke', '#333')
                        })
            node_types.append("svg:text").attr("x", type_size.width+margin)
                        .attr('y', y+(type_size.height/2)).attr("dy", ".35em").attr("text-anchor","start").text(d.desc);

            node_type[d.name] = {
                color:color_array[i],
                desc:d.desc
            }
        })
    }

    function getNodeType() {
        return types;
    }

    function reload(data) {
        var me = this;
        activeNodes = [];
        activeLinks = [];
        me.redraw();
        if(data && data.activeNodes) activeNodes = data.activeNodes;
        if(data && data.activeLinks) activeLinks = data.activeLinks;
        me.redraw();
    }

    function getNodes () {
        return activeNodes;
    }

    function getLinks () {
        return activeLinks;
    }

    return {
        setAlarm:function(items) {
            _.each(activeNodes, function(node, i) {
                if(items[node.id]) {
                    node["y"] = node["y"] * items[node.id];
                }
            })
            redraw();
        },
        setFavorite:function(root,favorites,event) {
            var isExists = activeNodes.find(function(d) { return d.id === root.id});
            if(!isExists) {
                var x = Math.round((event.offsetX - outer_transform.x) / outer_transform.k);
                var y = Math.round((event.offsetY - outer_transform.y) / outer_transform.k);
                root["x"] = x;
                root["y"] = y;
                activeNodes.push(root);
                _.each(favorites, function(item,index) {
                    item["x"] = x + node_size * (index + 1) * 6;
                    item["y"] = y;
                    var status = 0;
                    var prev_state;
                    item.current_state.forEach(function(d, i) {
                        // if(prev_state) {
                        //     if(prev_state === "하락" && d === "상승") {
                        //         status++;
                        //     } else if(prev_state === "상승" && d === "하락") {
                        //         status--;
                        //     }
                        // }
                        prev_state = d;
                        item["total_status"] = item["total_state"][i];
                    });
                    item["last_state"] = prev_state;

                    if(item.prev_supstance) {
                        item.prev_supstance = item.prev_supstance.split(',');
                    } else {
                        item.prev_supstance = [];
                    }

                    if(item.supstance) {
                        item.supstance = item.supstance.split(',');
                    } else {
                        item.supstance = [];
                    }

                    item["status"] = item.supstance.length - item.prev_supstance.length;
                    
                    if(!activeNodes.find(function(d) { return d.id === item.id})) {
                        activeNodes.push(item);
                    }
                    activeLinks.push({
                        source:root.id,
                        target:item.id,
                        volume_percent:status
                    })
                })
                redraw();
            }
        },
        setRecommend:function(root,recommends,event) {
            var isExists = activeNodes.find(function(d) { return d.id === root.id});
            if(!isExists) {
                var x = Math.round((event.offsetX - outer_transform.x) / outer_transform.k);
                var y = Math.round((event.offsetY - outer_transform.y) / outer_transform.k);
                root["x"] = x;
                root["y"] = y;
                activeNodes.push(root);
                _.each(recommends, function(item,index) {
                    item["x"] = x + node_size * (index + 1) * 6;
                    item["y"] = y;
                    var status = 0;
                    var prev_state;
                    item.current_state.forEach(function(d, i) {
                        // if(prev_state) {
                        //     if(prev_state === "하락" && d === "상승") {
                        //         status++;
                        //     } else if(prev_state === "상승" && d === "하락") {
                        //         status--;
                        //     }
                        // }
                        prev_state = d;
                        item["total_status"] = item["total_state"][i];
                    });
                    
                    item["last_state"] = prev_state;
                    if(item.prev_supstance) {
                        item.prev_supstance = item.prev_supstance.split(',');
                    } else {
                        item.prev_supstance = [];
                    }

                    if(item.supstance) {
                        item.supstance = item.supstance.split(',');
                    } else {
                        item.supstance = [];
                    }

                    item["status"] = item.supstance.length - item.prev_supstance.length;

                    if(!activeNodes.find(function(d) { return d.id === item.id})) {
                        activeNodes.push(item);
                    }
                    activeLinks.push({
                        source:root.id,
                        target:item.id,
                        volume_percent:item.volume_percent
                    })
                })
                redraw();
            } else {
                common.events.emit("notify", {message:'이미 화면에 보여지고 있습니다.', type:'warning'});
            }
        },
        clear: function() {
            activeNodes = [];
            activeLinks = [];
            redraw();
        },
        zoom_reset: function(evt) {
            outer_transform = d3.zoomIdentity;
            outer.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
            redraw();
        },
        focus_target: function(d) {
            var focusing = d3.zoomIdentity.translate((container_div.clientWidth/2)-d.x, (container_div.clientHeight/2)-d.y).scale(1);
            outer.transition().duration(1200).call(zoom.transform, focusing);
        },
        reload:reload,
        init: function(id) {
            container_div = document.getElementById(id);
            lineGenerator = d3.line().curve(d3.curveCardinal);
            width = container_div.clientWidth;
            height = container_div.clientHeight;
            console.log(types);
            zoom = d3.zoom().on("zoom", zoomed)

            function test() {
                console.log('test');
            }
            var keyboard = d3.keybinding()
                            .on('delete', deleteItem)
                            .on('←', test)
                            .on('↑', test)
                            .on('→', test)
                            .on('↓', test);
            
            d3.select('body').call(keyboard);
            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr('preserveAspectRatio', 'xMinYMin')
                        // .attr("pointer-events", "all")
                        // .style("cursor", "crosshair")
                        .call(zoom)
                        .on('dblclick.zoom', null)
                        .on('contextmenu', canvasContextMenu)
                        .on('click', canvasMouseDown)
                        .on('mousemove', canvasMouseMove)
                        .on('dblclick', canvasDblClick)
            

            vis = outer.append("svg:g")

            link_group = vis.append("g");

            x = d3.scaleLinear()
                .domain([-1, width + 1])
                .range([-1, width + 1]);

            y = d3.scaleLinear()
                .domain([-1, height + 1])
                .range([-1, height + 1]);

            xAxis = d3.axisBottom(x)
                .ticks((width + 2) / (height + 2) * 20)
                .tickSize(height)
                .tickPadding(8 - height);

            yAxis = d3.axisRight(y)
                .ticks(20)
                .tickSize(width)
                .tickPadding(8 - width);

            gX = outer.append("g")
                .attr("class", "axis axis--x")
                .attr("opacity", ".5")
                .call(xAxis);

            gY = outer.append("g")
                .attr("class", "axis axis--y")
                .attr("opacity", ".5")
                .call(yAxis);

            node_types = outer.append('g').attr('class', 'node_types').attr("transform", function(d) { return "translate(" + 70 + "," + 70 + ")"; })

            addDrawDropShadow();

            common.events.on('onAddNode', addNodes)
            common.events.on('view.focus_target', this.focus_target)

            redraw();
        },
        redraw : redraw,
        setNodeType : setNodeType,
        getNodeType : getNodeType,
        addNodes : addNodes,
        getNodes : getNodes,
        getLinks : getLinks,
        uninit: function() {
            outer.remove();
            width;
            height;
            outer, vis, outer_background, link_group, node_types;
            x, y, xAxis, yAxis, gX, gY;
            node_size = 16;
            outer_transform = {
                x:0,
                y:0,
                k:1
            };

            activeNodes = [];
            activeLinks = [];
            selected_id = [];

            node_type = {};

            common.events.off('onAddNode', addNodes);
            common.events.off('view.focus_target', this.focus_target);
            redraw();
        }
    }
})()