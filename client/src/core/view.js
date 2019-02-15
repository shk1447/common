const d3 = require('d3');

common.view = (function() {
    var space_width = 1280;
    var space_height = 720;
    var outer, vis;
    var x, y, xAxis, yAxis, gX, gY;

    var activeNodes = [];
    var activeLinks = [];
    

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
        gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
        gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
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

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return {
        init: function(id, callback) {
            this.data_callback = callback;

            var zoom = d3.zoom().scaleExtent([1,40]).translateExtent([[0,0],[space_width,space_height]]).on("zoom", zoomed);
            // var drag = d3.drag().on("dragstart")

            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", space_width)
                        .attr("height", space_height)
                        // .attr("pointer-events", "all")
                        // .style("cursor", "crosshair")
                        .call(zoom)
            
            x = d3.scaleLinear()
                .domain([-1, space_width + 1])
                .range([-1, space_width + 1]);

            y = d3.scaleLinear()
                .domain([-1, space_height + 1])
                .range([-1, space_height + 1]);

            xAxis = d3.axisBottom(x)
                .ticks((space_width + 2) / (space_height + 2) * 10)
                .tickSize(space_height)
                .tickPadding(8 - space_height);

            yAxis = d3.axisRight(y)
                .ticks(10)
                .tickSize(space_width)
                .tickPadding(8 - space_width);
            
            gX = outer.append("g")
                .attr("class", "axis axis--x")
                .call(xAxis);

            gY = outer.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);
                        
            vis = outer.append("svg:g")
                       .append("svg:g")
                       .on("dblclick", canvasDoubleClick)
                       .on("mousemove", canvasMouseMove)
                       .on("mousedown", canvasMouseDown)
                       .on("mouseup", canvasMouseUp)
                       .on("contextmenu", canvasContextMenu);

            // var circles = d3.range(20).map(function() {
            //     return {
            //         x: Math.round(Math.random() * (space_width - 32 * 2) + 32),
            //         y: Math.round(Math.random() * (space_height - 32 * 2) + 32)
            //     };
            // });

            // vis.selectAll("circle")
            // .data(circles)
            // .enter().append("circle")
            //   .attr("cx", function(d) { return d.x; })
            //   .attr("cy", function(d) { return d.y; })
            //   .attr("r", 32)
            //   .style("fill", function(d, i) { return getRandomColor() })
            //   .call(d3.drag()
            //       .on("start", dragstarted)
            //       .on("drag", dragged)
            //       .on("end", dragended));
        },
        redraw : function() {

        }
    }
})()