const d3 = require('d3');

common.view = (function() {
    var width;
    var height;
    var outer, vis, outer_background, dragGroup;
    var x, y, xAxis, yAxis, gX, gY;
    var node_size = 32;
    var outer_transform = {
        x:0,
        y:0,
        k:1
    };
    var lineCurveScale = 0.75;

    var temp_link = {source:null,target:null};
    var activeNodes = [];
    var activeLinks = [];
    var drag_line;

    function canvasMouseUp() {
        temp_link = {source:null,target:null};
        if(drag_line) {
            drag_line.remove();
            drag_line = null;
        }
    }

    function canvasMouseMove() {
        if(temp_link.source) {
            var mouse_x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
            var mouse_y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k;
            if(drag_line) {
                drag_line.attr("d", function() {
                    var x1 = temp_link.source.x + node_size;
                    var y1 = temp_link.source.y;
                    var x2 = mouse_x;
                    var y2 = mouse_y;
    
                    return generateLinkPath(x1, y1, x2, y2, 1);
                })
            } else {
                drag_line = dragGroup.append("svg:path").attr("class", "drag_line").attr("d", function() {
                    var x1 = temp_link.source.x + node_size;
                    var y1 = temp_link.source.y;
                    var x2 = mouse_x;
                    var y2 = mouse_y;
    
                    return generateLinkPath(x1, y1, x2, y2, 1);
                })
            }
        }
    }

    function canvasDblClick() {
        var x = (d3.event.offsetX - outer_transform.x ) / outer_transform.k;
        var y = (d3.event.offsetY - outer_transform.y ) / outer_transform.k
        addNodes({id:'test' + (activeNodes.length + 1),x:x,y:y});
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
        redraw();
    }
    
    function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
        redraw();
    }
    
    function dragended(d) {
        d3.select(this).classed("dragging", false);
        redraw();
    }

    function addNodes(node) {
        activeNodes.push(node);
        activeNodes = activeNodes;
        redraw();
    }

    function portMouseDown(port, node, type) {
        d3.event.stopPropagation();
        d3.event.preventDefault();
        temp_link.source = node;
    }

    function portMouseUp(port, node, type) {
        temp_link.target = node;
        activeLinks.push(temp_link);
        activeLinks = activeLinks;
        temp_link = {source:null,target:null};
        console.log(activeLinks);
        redraw();
    }

    function portMouseOver(port, node, type) {
        //console.log(node);
        port.classed("port_hovered",true);
    }

    function portMouseOut(port, node, type) {
        //console.log(node)
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

    function drawlines() {

    }

    function redraw() {
        var node = vis.selectAll(".nodegroup").data(activeNodes, function(d) { return d.id });

        node.exit().remove();

        var nodeEnter = node.enter().insert("svg:g")
            .attr("class", "node nodegroup");
        
        // 신규
        nodeEnter.each(function(d,i) {
            var node = d3.select(this);
            console.log(node);
            node.attr("id",d.id)
                .attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; })
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
            node.w = node_size;
            node.h = node_size;

            node.append("circle")
                .attr("class", "node")
                .attr("r", node_size)
                .attr("fill",function(d) { return 'rgb(166, 187, 207)' })

            node.append("circle")
                .attr("class", "port")
                .attr("cx", node_size)
                .attr("r", 8)
                .attr("fill", function(d) { return '#ddd' })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'input') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'input') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'input') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'input') }})() )

            node.append("circle")
                .attr("class", "port")
                .attr("cx", -node_size)
                .attr("r", 8)
                .attr("fill", function(d) { return '#ddd' })
                .style("cursor", "crosshair")
                .on('mousedown', (function() { var node = d; return function(d,i) { portMouseDown(d3.select(this),node,'input') }})() )
                .on('mouseup', (function() { var node = d; return function(d,i) { portMouseUp(d3.select(this),node,'input') }})() )
                .on('mouseover', (function() { var node = d; return function(d,i) { portMouseOver(d3.select(this),node,'input') }})() )
                .on('mouseout', (function() { var node = d; return function(d,i) { portMouseOut(d3.select(this),node,'input') }})() )
        });

        // 갱신
        node.each(function(d,i) {
            var thisNode = d3.select(this);
            
            thisNode.attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; });
        });

        var link = vis.selectAll(".link").data(activeLinks, function(d) { return d.source.id+":"+d.target.id });

        var linkEnter = link.enter().insert("svg:g")
            .attr("class", "link");

        linkEnter.each(function(d,i) {
            var l = d3.select(this);
            console.log(d);
            l.append("svg:path").attr('class', 'link_line link_path')
        })
        link.exit().remove();
        var links = vis.selectAll('.link_path')
        links.each(function(d,i) {
            console.log('update link');
            var thisLink = d3.select(this);
            thisLink.attr("d", function(d) {
                d.x1 = d.source.x + node_size;
                d.y1 = d.source.y;
                d.x2 = d.target.x - node_size;
                d.y2 = d.target.y;

                return generateLinkPath(d.x1, d.y1, d.x2, d.y2, 1);
            })
        })

        if (d3.event) {
            d3.event.preventDefault();
        }
    }

    return {
        init: function(id, callback) {
            this.data_callback = callback;
            var container_div = document.getElementById(id);
            width = container_div.clientWidth;
            height = container_div.clientHeight;

            var zoom = d3.zoom().scaleExtent([1,40]).translateExtent([[0,0],[width,height]]).on("zoom", zoomed)
            // var drag = d3.drag().on("dragstart")

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
                        .on('mousemove', canvasMouseMove)
                        .on('mouseup', canvasMouseUp)
                        .on('dblclick', canvasDblClick)

            outer_background = vis.append("svg:rect")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("fill","#fff");
            dragGroup = vis.append("g");

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

            redraw();
        },
        redraw : redraw,
        addNodes : addNodes
    }
})()