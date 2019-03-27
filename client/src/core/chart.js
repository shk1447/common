const d3 = require('d3');
const _ = require('lodash');

common.chart = (function() {
    var container_div, width, height, height2, outer, margin, margin2;

    var x,y,x2,y2, xAxis, xAxis2, yAxis, brush, zoom, area, area2, focus, context;

    function brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = d3.event.selection || x2.range();
        x.domain(s.map(x2.invert, x2));
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        outer.select(".zoom").call(zoom.transform, d3.zoomIdentity
            .scale(width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }
    
    function zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = d3.event.transform;
        x.domain(t.rescaleX(x2).domain());
        focus.select(".area").attr("d", area);
        focus.select(".axis--x").call(xAxis);
        context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function redraw(datum) {
        _.each(datum, function(d) {
            d.date = d3.timeParse("%b %Y")(d.date);
            console.log(d.date);
        })
        x.domain(d3.extent(datum, function(d) { return d.date; }));
        y.domain([0, d3.max(datum, function(d) { return d.price; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        focus.append("path")
            .datum(datum)
            .attr("class", "area")
            .attr("d", area);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        context.append("path")
            .datum(datum)
            .attr("class", "area")
            .attr("d", area2);

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());

        outer.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);
    }

    return {
        init:function(id) {
            container_div = document.getElementById(id);
            console.log(width,height);

            
            margin = {top: 20, right: 20, bottom: 110, left: 40};
            margin2 = {top: 430, right: 20, bottom: 30, left: 40};
            outer = d3.select("#" + id)
                        .append("svg:svg")
                        .attr("width", container_div.clientWidth)
                        .attr("height", container_div.clientHeight);
            width = +outer.attr("width") - margin.left - margin.right,
            height = +outer.attr("height") - margin.top - margin.bottom,
            height2 = +outer.attr("height") - margin2.top - margin2.bottom;

            x = d3.scaleTime().range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

            xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

            brush = d3.brushX()
                .extent([[0, 0], [width, height2]])
                .on("brush end", brushed);

            zoom = d3.zoom()
                .scaleExtent([1, Infinity])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            area = d3.area()
                .curve(d3.curveMonotoneX)
                .x(function(d) { return x(d.date); })
                .y0(height)
                .y1(function(d) { return y(d.price); });

            area2 = d3.area()
                .curve(d3.curveMonotoneX)
                .x(function(d) { return x2(d.date); })
                .y0(height2)
                .y1(function(d) { return y2(d.price); });

            outer.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            focus = outer.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            context = outer.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            redraw([{date:'Jan 2000',price:123.46},{date:'Feb 2000',price:1366.42},{date:'Mar 2000',price:566.46}])
        },
        uninit:function() {
            console.log(container_div);
            outer.remove();
        }
    }
})();