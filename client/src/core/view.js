const d3 = require('d3');

common.view = (function() {
    var width;
    var height;
    var outer, vis;
    var x, y, xAxis, yAxis, gX, gY;
    var node_size = 50;

    var activeNodes = [];
    var activeLinks = [];

    function dblZoom() {
        addNodes({id:'test',x:d3.event.offsetX,y:d3.event.offsetY});
    };
    function canvasMouseDown(e) {

    };
    function canvasMouseMove(e) {

    };
    function canvasMouseUp(e) {

    };
    function canvasContextMenu(e) {

    };

    function zoomed() {
        vis.attr("transform", d3.event.transform);
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
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

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function onNodeDetail(a,b,c,d,e) {
        var test = d3.select(c[b]);
        test.style('stroke', 'black')
        console.log(test);
        console.log('click : ', a,b,c,d,e);
    }

    function addNodes(node) {
        activeNodes.push(node);
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
                .call(d3.drag()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended))
            node.w = node_size;
            node.h = node_size;

            node.append("circle")
                .attr("class", "node")
                .attr("r", 32)
                .attr("fill",function(d) { return 'red' })
                .attr("stroke", "black");

            node.append("circle")
                .attr("class", "inLink")
                .attr("cx", 32)
                .attr("r", 8)
                .attr("fill", function(d) { return 'gray' })
                .attr("stroke", "black")

            node.append("circle")
                .attr("class", "outLink")
                .attr("cx", -32)
                .attr("r", 8)
                .attr("fill", function(d) { return 'gray' })
                .attr("stroke", "black")
        });

        // 갱신
        node.each(function(d,i) {
            var thisNode = d3.select(this);
            thisNode.attr("transform", function(d) { return "translate(" + (d.x) + "," + (d.y) + ")"; });
        })
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
                        .on('dblclick.zoom', dblZoom)
            
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

            vis = outer.append("svg:g");

            redraw();
        },
        redraw : redraw,
        addNodes : addNodes
    }
})()