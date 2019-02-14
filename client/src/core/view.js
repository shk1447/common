const d3 = require('d3');

common.view = (function() {
    var gridSize = 20;
    var space_width = 1920;
    var space_height = 1080;
    var outer, vis;
    var lasso = null;
    var mouse_position = null;
    var data_callback = null;

    function canvasDoubleClick(e) {

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
        // gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        // gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed("dragging", true);
    }
    
    function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }
    
    function dragended(d) {
        d3.select(this).classed("dragging", false);
    }

    return {
        init: function(id, callback) {
            this.data_callback = callback;

            var zoom = d3.zoom().scaleExtent([1,10]).on("zoom", zoomed);
            // var drag = d3.drag().on("dragstart")

            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", space_width)
                        .attr("height", space_height)
                        .attr("pointer-events", "all")
                        .style("cursor", "crosshair")
                        .call(zoom)
            
            var x = d3.scaleLinear()
                .domain([-1, space_width + 1])
                .range([-1, space_width + 1]);

            var y = d3.scaleLinear()
                .domain([-1, space_height + 1])
                .range([-1, space_height + 1]);

            // var xAxis = d3.axisBottom(x)
            //     .ticks((width + 2) / (height + 2) * 10)
            //     .tickSize(height)
            //     .tickPadding(8 - height);

            // var yAxis = d3.axisRight(y)
            //     .ticks(10)
            //     .tickSize(width)
            //     .tickPadding(8 - width);
                        
            vis = outer.append("svg:g")
                       .append("svg:g")
                       .on("dblclick", canvasDoubleClick)
                       .on("mousemove", canvasMouseMove)
                       .on("mousedown", canvasMouseDown)
                       .on("mouseup", canvasMouseUp)
                       .on("contextmenu", canvasContextMenu);

            var gridScale = d3.scaleLinear().range([0, space_width]).domain([0, space_width]);
            var grid = vis.append("g");

            grid.selectAll("line.horizontal").data(gridScale.ticks(space_width / gridSize)).enter()
                .append("line").attr("class", "horizontal")
                .attr("x1",0).attr("x2",space_width)
                .attr("y1", function(d) { return gridScale(d); })
                .attr("y2", function(d) { return gridScale(d); })
                .attr("fill", "none").attr("shape-rendering", "crispEdges")
                .attr("stroke", "#eee").attr("stroke-width", "1px");

            grid.selectAll("line.vertical").data(gridScale.ticks(space_width / gridSize)).enter()
                .append("line").attr("class", "vertical")
                .attr("y1", 0).attr("y2", space_width)
                .attr("x1", function(d) { return gridScale(d) })
                .attr("x2", function(d) { return gridScale(d) })
                .attr("fill", "none").attr("shape-rendering", "crispEdges")
                .attr("stroke", "#eee").attr("stroke-width", "1px");
        }
    }
})()