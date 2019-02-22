const d3 = require('d3');
const randomColor = require('randomcolor') ;
require('./d3_extension/keybinding');

common.view = (function() {
    var width;
    var height;
    var outer, vis, outer_background, drag_group, link_group, node_types;
    var x, y, gX, gY, xAxis, yAxis;
    var node_size = 28;
    var outer_transform = {
        x:0,
        y:0,
        k:1
    };
    var lineCurveScale = 1;

    var drag_line;
    var temp_link = {source:null,target:null,speed:10};
    var activeNodes = [];
    var activeLinks = [];
    var selected_id;

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
            var x1 = temp_link.source ? (start_point.x + node_size) : mouse_x;
            var y1 = temp_link.source ? start_point.y : mouse_y;
            var x2 = temp_link.source ? mouse_x : (start_point.x - node_size) ;
            var y2 = temp_link.source ? mouse_y : start_point.y;
            if(drag_line) {
                drag_line.attr("d", generateLinkPath(x1, y1, x2, y2, 1))
            } else {
                drag_line = drag_group.append("svg:path").attr("class", "drag_line").attr("d", generateLinkPath(x1, y1, x2, y2, 1))
            }
        }
    }

    function canvasDblClick() {
        var x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k
        var node_info = {
            id:'test' + (activeNodes.length + 1),
            name:'test' + (activeNodes.length + 1),
            type:'SPINE_SWITCH',
            x:x,
            y:y,
            alarm:true
        }
        addNodes(node_info);
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

    function nodeClicked(node, node_info) {
        //node.classed("selected", !node.classed("selected"))
        selected_id = node_info.id;
        redraw();
        //common.events.emit('test',node_info.id)
    }

    function portMouseDown(port, node, type) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        if(type === 'input') {
            temp_link.target = node;
        } else {
            temp_link.source = node;
        }
    }

    function portMouseUp(port, node, type) {
        if(type === 'input') {
            temp_link.target = node;
        } else {
            temp_link.source = node;
        }
        if(temp_link.source && temp_link.target) {
            temp_link.speed = Math.random()*100;
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

    function generateLinkPath(origX,origY, destX, destY, sc) {
        var dy = destY-origY;
        var dx = destX-origX;
        var delta = Math.sqrt(dy*dy+dx*dx);
        var scale = lineCurveScale;
        var scaleY = 0;
        if (dx*sc > 0) {
            if (delta < node_size) {
                scale = 0.75-0.75*((node_size-delta)/node_size);
            }
        } else {
            scale = 0.4-0.2*(Math.max(0,(node_size-Math.min(Math.abs(dx),Math.abs(dy)))/node_size));
        }
        if (dx*sc > 0) {
            return "M "+origX+" "+origY+
                " C "+(origX+sc*(node_size*scale))+" "+(origY+scaleY*node_size)+" "+
                (destX-sc*(scale)*node_size)+" "+(destY-scaleY*node_size)+" "+
                destX+" "+destY
        } else {

            var midX = Math.floor(destX-dx/2);
            var midY = Math.floor(destY-dy/2);
            //
            if (dy === 0) {
                midY = destY + node_size;
            }
            var cp_height = node_size/2;
            var y1 = (destY + midY)/2
            var topX =origX + sc*node_size*scale;
            var topY = dy>0?Math.min(y1 - dy/2 , origY+cp_height):Math.max(y1 - dy/2 , origY-cp_height);
            var bottomX = destX - sc*node_size*scale;
            var bottomY = dy>0?Math.max(y1, destY-cp_height):Math.min(y1, destY+cp_height);
            var x1 = (origX+topX)/2;
            var scy = dy>0?1:-1;
            var cp = [
                // Orig -> Top
                [x1,origY],
                [topX,dy>0?Math.max(origY, topY-cp_height):Math.min(origY, topY+cp_height)],
                // Top -> Mid
                // [Mirror previous cp]
                [x1,dy>0?Math.min(midY, topY+cp_height):Math.max(midY, topY-cp_height)],
                // Mid -> Bottom
                // [Mirror previous cp]
                [bottomX,dy>0?Math.max(midY, bottomY-cp_height):Math.min(midY, bottomY+cp_height)],
                // Bottom -> Dest
                // [Mirror previous cp]
                [(destX+bottomX)/2,destY]
            ];
            if (cp[2][1] === topY+scy*cp_height) {
                if (Math.abs(dy) < cp_height*10) {
                    cp[1][1] = topY-scy*cp_height/2;
                    cp[3][1] = bottomY-scy*cp_height/2;
                }
                cp[2][0] = topX;
            }
            return "M "+origX+" "+origY+
                " C "+
                   cp[0][0]+" "+cp[0][1]+" "+
                   cp[1][0]+" "+cp[1][1]+" "+
                   topX+" "+topY+
                " S "+
                   cp[2][0]+" "+cp[2][1]+" "+
                   midX+" "+midY+
               " S "+
                  cp[3][0]+" "+cp[3][1]+" "+
                  bottomX+" "+bottomY+
                " S "+
                    cp[4][0]+" "+cp[4][1]+" "+
                    destX+" "+destY
        }
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
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
            node.w = node_size;
            node.h = node_size;
            
            if(d.alarm) {
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
                .attr("cx", node_size)
                .attr("r", node_size/4)
                .attr("fill", function(d) { return '#ddd' })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'output') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'output') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'output') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'output') }})() )

            node.append("circle")
                .attr("class", "port")
                .attr("cx", -node_size)
                .attr("r", node_size/4)
                .attr("fill", function(d) { return '#ddd' })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'input') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'input') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'input') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'input') }})() )
            var text = node.append('svg:text').attr('y', node_size+12).style('stroke', 'none').style("text-anchor", "middle").text(d.name);
        });

        // 갱신
        node.each(function(d,i) {
            var thisNode = d3.select(this);
            
            thisNode.attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; });

            if(d.id === selected_id) d.node.classed('selected', true)
            else d.node.classed('selected', false)
        });

        var link = link_group.selectAll(".link").data(activeLinks, function(d) { return d.source.id+":"+d.target.id });

        var linkEnter = link.enter().insert("svg:g")
            .attr("class", "link");

        linkEnter.each(function(d,i) {
            var l = d3.select(this);
            l.append("svg:path").attr("class", "link_background link_path")
                                .on("click",function(d) {
                                    selected_id = d.source.id+":"+d.target.id;
                                    redraw();
                                })
            var link = l.append("svg:path").attr('class', 'link_line link_path')
            l.append("svg:path").attr('class', 'link_anim')
        })
        link.exit().remove();
        var links = link_group.selectAll('.link_path')
        links.each(function(d,i) {
            var thisLink = d3.select(this);
            var id = d.source.id + ":" + d.target.id;
            thisLink.attr("d", function(d) {
                d.x1 = d.source.x + node_size;
                d.y1 = d.source.y;
                d.x2 = d.target.x - node_size;
                d.y2 = d.target.y;

                return generateLinkPath(d.x1, d.y1, d.x2, d.y2, 1);
            })
            if(id === selected_id) thisLink.classed('selected', true)
            else thisLink.classed('selected', false)
        })
        var anim_links = link_group.selectAll('.link_anim');
        anim_links.each(function(d,i) {
            var thisLink = d3.select(this);
            thisLink.attr("d", function(d) {
                d.x1 = d.source.x + node_size;
                d.y1 = d.source.y;
                d.x2 = d.target.x - node_size;
                d.y2 = d.target.y;

                return generateLinkPath(d.x1, d.y1, d.x2, d.y2, 1);
            })
            var totalLength = thisLink.node().getTotalLength();
            thisLink.attr("stroke-dasharray", totalLength/8 + " " + totalLength);
            function repeat() {
                thisLink.attr('stroke-dashoffset', totalLength + (totalLength/4));
                thisLink.transition()
                            .duration(20000/d.speed)
                            .attr("stroke-dashoffset", totalLength/8)
                        .on("end", repeat)
            }
            repeat();
        })
    }

    function deleteItem() {
        var node_index = activeNodes.findIndex(function(d) {return d.id === selected_id});
        if(node_index >= 0) {
            var remove_index = [];
            var link_length = activeLinks.length;
            for(var i = 0; i < link_length; i++) {
                var d = activeLinks[i];
                if((d.source.id === selected_id || d.target.id === selected_id)) {
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

    return {
        init: function(id) {
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

            redraw();
        },
        redraw : redraw,
        setNodeType : setNodeType,
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
                var source = activeNodes.find(function(d) { return d.id === link_info.topNodeUuid});
                var target = activeNodes.find(function(d) { return d.id === link_info.bottomNodeUuid});
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
                        if(!valid_list.includes(node_info_child.id)) activeNodes.push(node_info_child);
                        if(child_node.uplinks) link_list = link_list.concat(child_node.uplinks)
                        valid_list.push(node_info_child.id)
                    }
                }
                if(!valid_list.includes(node_info_root.id)) activeNodes.push(node_info_root);
                valid_list.push(node_info_root.id)
                if(root_node.uplinks) link_list = link_list.concat(child_node.uplinks)
            }
            for(var k = 0; k < link_list.length; k++) {
                var link_info = link_list[k];
                var source = activeNodes.find(function(d) { return d.id === link_info.topNodeUuid});
                var target = activeNodes.find(function(d) { return d.id === link_info.bottomNodeUuid});
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
            redraw();
        }
    }
})()