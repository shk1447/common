const d3 = require('d3');
const randomColor = require('randomcolor') ;
require('./d3_extension/keybinding');

common.view = (function() {
    var width;
    var height;
    var outer, vis, outer_background, drag_group, link_group, node_types, toolbox;
    var x, y, gX, gY, xAxis, yAxis;
    var node_size = 28;
    var outer_transform = {
        x:0,
        y:0,
        k:1
    };
    
    var lineGenerator;

    var drag_line;
    var temp_link = {source:null,target:null,speed:10};
    var activeNodes = [];
    var activeLinks = [];
    var selected_id;

    var types = [];
    var node_type = {};

    function canvasMouseDown() {
        selected_id = "";
        redraw();
    }

    function canvasMouseUp() {
        temp_link = {source:null,target:null};
        if(drag_line) {
            drag_line.remove();
            drag_line = null;
        }
    }

    function canvasMouseMove() {
        var start_point = temp_link.source ? temp_link.source : temp_link.target;
        var mouse_x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var mouse_y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k;
        if(start_point) {
            var x1 = temp_link.source ? (start_point.x) : mouse_x;
            var y1 = temp_link.source ? start_point.y : mouse_y;
            var x2 = temp_link.source ? mouse_x : (start_point.x);
            var y2 = temp_link.source ? mouse_y : start_point.y;
            var path_data = lineGenerator([[x1, y1],[x2, y2]])
            if(drag_line) {
                drag_line.attr("d", path_data)
            } else {
                drag_line = drag_group.append("svg:path").attr("class", "drag_line").attr("d", path_data)
            }
        }
    }

    function canvasDblClick() {
        var x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k
        var node_info = {
            status:~~(Math.random() * (5 - 0 + 1)) + 0,
            x:x,
            y:y
        }
        common.events.emit('popup', {node_info:node_info, node_types:types, event:d3.event});
    };

    function zoomed() {
        outer_transform = d3.event.transform;
        vis.attr("transform", d3.event.transform);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
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
        activeNodes = activeNodes;
        redraw();
    }

    var activeDropShadow;

    var dropShadow = {
        'stdDeviation': 2,
        'dx': 0,
        'dy': 0,
        'slope': 0.5,
        'type': 'linear'
    };

    function addDrawDropShadow() {
        activeDropShadow = 'dropshadow';
    
        var filter = outer.append('defs')
            .append('filter')
                .attr('id', activeDropShadow)
                // x, y, width and height represent values in the current coordinate system that results
                // from taking the current user coordinate system in place at the time when the
                // <filter> element is referenced
                // (i.e., the user coordinate system for the element referencing the <filter> element via a filter attribute).
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
        //node.classed("selected", !node.classed("selected"))
        selected_id = node_info.uuid;
        redraw();
        //common.events.emit('test',node_info.id)
    }

    function portMouseDown(port, node, type) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        
        temp_link.source = node;
    }

    function portMouseUp(port, node, type) {
        temp_link.target = node;
        
        if(temp_link.source && temp_link.target) {
            temp_link.speed = Math.round(Math.random()*100);
            activeLinks.push(temp_link);
            redraw();
        }
        temp_link = {source:null,target:null};
    }

    function portMouseOver(port, node, type) {
        port.classed("port_hovered",true);
    }

    function portMouseOut(port, node, type) {
        port.classed("port_hovered",false);
    }

    function redraw() {
        var node = vis.selectAll(".nodegroup").data(activeNodes, function(d) { return d.uuid });

        node.exit().remove();

        var nodeEnter = node.enter().insert("svg:g")
            .attr("class", "node nodegroup");
        
        // 신규
        nodeEnter.each(function(d,i) {
            var node = d3.select(this);
            node.attr("id",d.uuid)
                .attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; })
                .on('mouseover', function() {
                    var node = d3.select(this);
                    var port = node.select('.port')
                    port.classed('visible',true);
                    
                })
                .on('mouseout', function() { 
                    var node = d3.select(this);
                    var port = node.select('.port')
                    port.classed('visible',false);
                })
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
            node.w = node_size;
            node.h = node_size;
            
            if(!d.status) {
                var anim_alarm = node.append("circle")
                                .attr("r", node_size)
                                .attr("fill", "rgba(255,0,0,0)")
                                .style("stroke", "red")
                                .style("stroke-width", 0)
                var anim_alarm2 = node.append("circle")
                                .attr("r", node_size)
                                .attr("fill", "rgba(255,0,0,0)")
                                .style("stroke", "red")
                                .style("stroke-width", 0)
                
                var anim_alarm3 = node.append("circle")
                                .attr("r", node_size)
                                .attr("fill", "rgba(255,0,0,0)")
                                .style("stroke", "red")
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

            d.node = node.append("circle")
                .attr("class", "node")
                .attr("r", node_size)
                .attr("fill",function(d) { return node_type[d.type] ? node_type[d.type].color : 'rgb(166, 187, 207)' })
                .on('click', (function() { var node = d; return function(d,i) { nodeClicked(d3.select(this),node) }})())
                .on('contextmenu', function() {
                    common.events.emit('showRightPanel', 'test');
                    d3.event.stopPropagation();
                    d3.event.preventDefault();
                })
                
            
            node.append("circle")
                .attr("class", "port")
                .attr("r", node_size/4)
                .attr("fill", function(d) { return '#ddd' })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'output') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'output') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'output') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'output') }})() )

            // node.append("circle")
            //     .attr("class", "port")
            //     .attr("cx", node_size)
            //     .attr("r", node_size/4)
            //     .attr("fill", function(d) { return '#ddd' })
            //     .style("cursor", "crosshair")
            //     .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'output') }})() )
            //     .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'output') }})() )
            //     .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'output') }})() )
            //     .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'output') }})() )

            // node.append("circle")
            //     .attr("class", "port")
            //     .attr("cx", -node_size)
            //     .attr("r", node_size/4)
            //     .attr("fill", function(d) { return '#ddd' })
            //     .style("cursor", "crosshair")
            //     .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'input') }})() )
            //     .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'input') }})() )
            //     .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'input') }})() )
            //     .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'input') }})() )
            var text = node.append('svg:text').attr('y', node_size+12).style('stroke', 'none').style("text-anchor", "middle").text(d.name);
        });

        // 갱신
        node.each(function(d,i) {
            var thisNode = d3.select(this);
            
            thisNode.attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; });

            if(d.uuid === selected_id) {
                d.node.classed('selected', true)
                d.node.attr('filter', 'url(#' + activeDropShadow + ')' );
            } else {
                d.node.classed('selected', false)
                d.node.attr('filter', null );
            }
        });

        var link = link_group.selectAll(".link").data(activeLinks, function(d) { return d.source.uuid+":"+d.target.uuid });

        var linkEnter = link.enter().insert("svg:g")
            .attr("class", "link");

        linkEnter.each(function(d,i) {
            var l = d3.select(this);
            l.append("svg:path").attr("class", "link_background link_path")
                                .on("click",function(d) {
                                    selected_id = d.source.uuid+":"+d.target.uuid;
                                    redraw();
                                })
            var link = l.append("svg:path").attr('class', 'link_line link_path')
            l.append("svg:path").attr('class', 'link_anim')

            l.append('svg:text')
            .attr('class', 'speed')
            .attr('x', (d.source.x + d.target.x)/2)
            .attr('y', (d.source.y + d.target.y)/2)
            .style('stroke', 'none').text(d.speed);
        })
        link.exit().remove();

        var speed_texts = link_group.selectAll('.speed');

        speed_texts.each(function(d,i) {
            var text = d3.select(this);
            var text_width = text.node().getComputedTextLength()
            text.attr('x', (d.source.x + d.target.x)/2 - (text_width/2))
            .attr('y', (d.source.y + d.target.y)/2)
        })

        var links = link_group.selectAll('.link_path')
        links.each(function(d,i) {
            var thisLink = d3.select(this);
            var id = d.source.uuid + ":" + d.target.uuid;
            var path_data = lineGenerator([[d.source.x, d.source.y],[d.target.x, d.target.y]])
            thisLink.attr("d", path_data);
            if(id === selected_id) {
                thisLink.attr('filter', 'url(#' + activeDropShadow + ')' )
                thisLink.classed('selected', true)
            } else {
                thisLink.attr('filter', null )
                thisLink.classed('selected', false)
            }
            if(d.source.uuid === selected_id || d.target.uuid === selected_id) {
                var result = activeNodes.filter(function(a) {return a.uuid === d.source.uuid || a.uuid === d.target.uuid});
                result.forEach(function(v,i) {
                    v.node.attr('filter', 'url(#' + activeDropShadow + ')' );
                })
                thisLink.attr('filter', 'url(#' + activeDropShadow + ')' )
            }
        })
        var anim_links = link_group.selectAll('.link_anim');
        anim_links.each(function(d,i) {
            var thisLink = d3.select(this);
            var path_data = lineGenerator([[d.source.x, d.source.y],[d.target.x, d.target.y]])
            thisLink.attr("d", path_data)
            var totalLength = thisLink.node().getTotalLength();
            thisLink.attr("stroke-dasharray", totalLength/8 + " " + totalLength);
            function repeat() {
                thisLink.attr('stroke-dashoffset', totalLength + (totalLength/4));
                thisLink.transition()
                            .duration(20000/d.speed)
                            .attr("stroke-dashoffset", totalLength/8)
                        .transition()
                            .duration(20000/d.speed)
                            .attr('stroke-dashoffset', totalLength + (totalLength/4))
                        .on("end", repeat)
            }
            repeat();
        })
    }

    function deleteItem() {
        var node_index = activeNodes.findIndex(function(d) {return d.uuid === selected_id});
        if(node_index >= 0) {
            var remove_index = [];
            var link_length = activeLinks.length;
            for(var i = 0; i < link_length; i++) {
                var d = activeLinks[i];
                if((d.source.uuid === selected_id || d.target.uuid === selected_id)) {
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
        var type_size = {width:50,height:25};
        var margin = 5;
        var color_array = randomColor({
            count: type.length,
            hue: 'blue'
        })
        types = type;
        type.forEach(function(d,i) {
            var y = (type_size.height*i) + (margin*i);
            node_types.append('rect').attr('rx', 5).attr('x', 0).attr('y', y)
                        .attr('width', type_size.width).attr('height', type_size.height).attr('fill', color_array[i])
                        .style("stroke", "#333")
            node_types.append("svg:text").attr("x", type_size.width+margin)
                        .attr('y', y+(type_size.height/2)).attr("dy", ".35em").attr("text-anchor","start").text(d.type);

            node_type[d.type] = {
                color:color_array[i],
                desc:d.desc
            }
        })
    }

    function getNodeType() {
        return node_types;
    }

    return {
        init: function(id) {
            lineGenerator = d3.line().curve(d3.curveCardinal);
            var container_div = document.getElementById(id);
            width = container_div.clientWidth;
            height = container_div.clientHeight;

            var zoom = d3.zoom().scaleExtent([1,50]).translateExtent([[0,0],[width,height]]).on("zoom", zoomed)
            // var drag = d3.drag().on("dragstart")

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
                        .attr('viewBox', '0 0 ' + width + ' ' + height)
                        .attr('preserveAspectRatio', 'xMinYMin')
                        // .attr("pointer-events", "all")
                        // .style("cursor", "crosshair")
                        .call(zoom)
                        .on('dblclick.zoom', null)
            

            vis = outer.append("svg:g")
                        .on('mousedown', canvasMouseDown)
                        .on('mousemove', canvasMouseMove)
                        .on('mouseup', canvasMouseUp)
                        .on('dblclick', canvasDblClick)

            outer_background = vis.append("svg:rect")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("fill","#fff");

            drag_group = vis.append("g");
            link_group = vis.append("g");

            x = d3.scaleLinear()
                .domain([-1, width + 1])
                .range([-1, width + 1]);

            y = d3.scaleLinear()
                .domain([-1, height + 1])
                .range([-1, height + 1]);

            xAxis = d3.axisBottom(x)
                .ticks((width + 2) / (height + 2) * 10)
                .tickSize(height)
                .tickPadding(8 - height);

            yAxis = d3.axisRight(y)
                .ticks(10)
                .tickSize(width)
                .tickPadding(8 - width);
            
            gX = outer.append("g")
                .attr("class", "axis axis--x")
                .call(xAxis);

            gY = outer.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            node_types = outer.append('g').attr('class', 'node_types').attr("transform", function(d) { return "translate(" + 70 + "," + 70 + ")"; })
            toolbox = outer.append('g').attr('class', 'node_types').attr("transform", function(d) { return "translate(" + (width - 70) + "," + 70 + ")"; })
            
            var defaultStyle = {
                padding: "0px 5px 0px 5px",
                margin: "5px",
                "border-radius": "16px",
                "background-color": "white",
                "stroke": "none",
                "cursor": "pointer"
              };
            toolbox.append('i').attr('class', 'icon fa fa-5x fa-twitter-square').style(defaultStyle);

            var refresh = toolbox.append('rect').attr('rx', 5).attr('x', 0).attr('y', 40)
            .attr('width', 30).attr('height', 30).attr('fill', 'white')
            .style("stroke", "#333")

            refresh.append('svg:i').attr('x',0).attr('y',0).attr('class', 'el-icon-refresh')

            addDrawDropShadow();

            common.events.on('onAddNode', addNodes)

            redraw();
        },
        redraw : redraw,
        setNodeType : setNodeType,
        getNodeType : getNodeType,
        addNodes : addNodes,
        setLogicalNode : function(data) {
            var start_point = {
                x:300,
                y:200
            };
            var link_list = [];
            for(var i = 0; i < data.length; i++) {
                var root_node = data[i];
                console.log('root', root_node.uuid, root_node.name, root_node.type);
                var node_info = {
                    id:root_node.uuid,
                    name:root_node.name,
                    type:root_node.type,
                    x:start_point.x * (i+1),
                    y:start_point.y * (i+1)
                }
                activeNodes.push(node_info);
                if(root_node.vFabrics) {
                    for(var j = 0; j < root_node.vFabrics.length; j++) {
                        var child_node = root_node.vFabrics[j];
                        var child_network = {
                            id : child_node.uuid,
                            name : child_node.name,
                            type : child_node.type,
                            x : node_info.x + (node_size*2*(j+1)),
                            y : node_info.y + (node_size*2*(j+1))
                        }
                        activeNodes.push(child_network);
                        activeLinks.push({source:node_info,target:child_network,speed:25})
                        console.log('fabric',child_node.uuid);
                        if(child_node.vSwitchs) {
                            for(var k = 0; k < child_node.vSwitchs.length; k++) {
                                var child_node2 = child_node.vSwitchs[k];
                                activeNodes.push({
                                    id : child_node2.uuid,
                                    name : child_node2.name,
                                    type : child_node2.type,
                                    x : node_info.x + (node_size*2*(j+1)*(k+1)),
                                    y : node_info.y + (node_size*2*(j+1)*(k+1))
                                });
                                if(child_node2.upLink) console.log(child_node2.upLink);
                            }
                        }
                    }
                }
            }

            for(var k = 0; k < link_list.length; k++) {
                var link_info = link_list[k];
                var source = activeNodes.find(function(d) { return d.uuid === link_info.topNodeUuid});
                var target = activeNodes.find(function(d) { return d.uuid === link_info.bottomNodeUuid});
                if(source && target) {
                    activeLinks.push({
                        source:source,
                        target:target,
                        speed: parseFloat(link_info.speed)
                    })
                } else {
                    console.log(source, target);
                    console.log(link_info);
                }
            }
            redraw();
        },
        setPhysicalNode : function(data) {
            var start_point = {
                x:300,
                y:200
            }
            var count = 0;
            var link_list = [];
            var valid_list = [];
            for(var i = 0; i < data.length; i++) {
                var root_node = data[i];
                var node_info_root = {
                    id:root_node.uuid,
                    name:root_node.name,
                    type:root_node.nodeType,
                    x:start_point.x * (i+1),
                    y:start_point.y * (i+1)
                }
                count++;
                if(root_node.nodeSubTree) {
                    for(var j = 0; j < root_node.nodeSubTree.length; j++) {
                        var child_node = root_node.nodeSubTree[j];
                        var node_info_child = {
                            id:child_node.uuid,
                            name:child_node.name,
                            type:child_node.nodeType,
                            x:node_info_root.x + (node_size*2*(j+1)),
                            y:node_info_root.y + (node_size*2*(j+1))
                        }
                        count++;
                        if(!valid_list.includes(node_info_child.uuid)) activeNodes.push(node_info_child);
                        if(child_node.uplinks) link_list = link_list.concat(child_node.uplinks)
                        valid_list.push(node_info_child.uuid)
                    }
                }
                if(!valid_list.includes(node_info_root.uuid)) activeNodes.push(node_info_root);
                valid_list.push(node_info_root.uuid)
                if(root_node.uplinks) link_list = link_list.concat(child_node.uplinks)
            }
            for(var k = 0; k < link_list.length; k++) {
                var link_info = link_list[k];
                var source = activeNodes.find(function(d) { return d.uuid === link_info.topNodeUuid});
                var target = activeNodes.find(function(d) { return d.uuid === link_info.bottomNodeUuid});
                if(source && target) {
                    activeLinks.push({
                        source:source,
                        target:target,
                        speed: parseFloat(link_info.speed)
                    })
                } else {
                    console.log(source, target);
                    console.log(link_info);
                }
            }
            redraw();
        },
        uninit: function() {
            width;
            height;
            outer, vis, outer_background, drag_group, link_group, node_types;
            x, y, xAxis, yAxis, gX, gY;
            node_size = 28;
            outer_transform = {
                x:0,
                y:0,
                k:1
            };
            lineCurveScale = 1;

            drag_line;
            temp_link = {source:null,target:null};
            activeNodes = [];
            activeLinks = [];
            selected_id;

            node_type = {};

            common.events.off('onAddNode', addNodes);
            redraw();
        }
    }
})()