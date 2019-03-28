const _ = require('lodash');

common.chart = (function() {
    function brushed() {
        var zoomable = x.zoomable(),
            zoomable2 = x2.zoomable();

        zoomable.domain(zoomable2.domain());
        if(d3.event.selection !== null) zoomable.domain(d3.event.selection.map(zoomable.invert));
        draw();
    }

    function draw() {
        var candlestickSelection = focus.select("g.candlestick"),
            data = candlestickSelection.datum();
        y.domain(techan.scale.plot.ohlc(data.slice.apply(data, x.zoomable().domain()), candlestick.accessor()).domain());
        candlestickSelection.call(candlestick);
        focus.select("g.volume").call(volume);
        // using refresh method is more efficient as it does not perform any data joins
        // Use this if underlying data is not changing
//        svg.select("g.candlestick").call(candlestick.refresh);
        focus.select("g.x.axis").call(xAxis);
        focus.select("g.y.axis").call(yAxis);
    }

    function load(data) {
        var accessor = candlestick.accessor(),
            timestart = Date.now();

        data = data.slice(0, 3500).map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

        x.domain(data.map(accessor.d));
        x2.domain(x.domain());
        y.domain(techan.scale.plot.ohlc(data, accessor).domain());
        y2.domain(y.domain());
        yVolume.domain(techan.scale.plot.volume(data).domain());

        focus.select("g.candlestick").datum(data);
        focus.select("g.volume").datum(data);

        context.select("g.close").datum(data).call(close);
        context.select("g.x.axis").call(xAxis2);

        // Associate the brush with the scale and render the brush only AFTER a domain has been applied
        context.select("g.pane").call(brush).selectAll("rect").attr("height", height2);

        x.zoomable().domain(x2.zoomable().domain());
        draw();

        console.log("Render time: " + (Date.now()-timestart));
    }

    return {
        init:function(id) {
            container_div = document.getElementById(id);
            //console.log(width,height);

            
            margin = {top: 20, right: 20, bottom: 100, left: 50},
            margin2 = {top: 420, right: 20, bottom: 20, left: 50}
            
            width = container_div.clientWidth - margin.left - margin.right,
            height = container_div.clientHeight - margin.top - margin.bottom,
            height2 = container_div.clientHeight - margin2.top - margin2.bottom;

            parseDate = d3.timeParse("%d-%b-%y");

            x = techan.scale.financetime()
                    .range([0, width]);

            x2 = techan.scale.financetime()
                    .range([0, width]);

            y = d3.scaleLinear()
                    .range([height, 0]);

            yVolume = d3.scaleLinear()
                    .range([y(0), y(0.3)]);

            y2 = d3.scaleLinear()
                    .range([height2, 0]);

            brush = d3.brushX()
                    .extent([[0, 0], [width, height2]])
                    .on("brush", brushed);

            candlestick = techan.plot.candlestick()
                    .xScale(x)
                    .yScale(y);

            volume = techan.plot.volume()
                    .xScale(x)
                    .yScale(yVolume);

            close = techan.plot.close()
                    .xScale(x2)
                    .yScale(y2);

            xAxis = d3.axisBottom(x);

            xAxis2 = d3.axisBottom(x2);

            yAxis = d3.axisLeft(y);

            yAxis2 = d3.axisLeft(y2)
                    .ticks(0);

            ohlcAnnotation = techan.plot.axisannotation()
                    .axis(yAxis)
                    .orient('left')
                    .format(d3.format(',.2f'));

            timeAnnotation = techan.plot.axisannotation()
                    .axis(xAxis)
                    .orient('bottom')
                    .format(d3.timeFormat('%Y-%m-%d'))
                    .width(65)
                    .translate([0, height]);

            crosshair = techan.plot.crosshair()
                    .xScale(x)
                    .yScale(y)
                    .xAnnotation(timeAnnotation)
                    .yAnnotation(ohlcAnnotation);

            outer = d3.select("#" + id)
                    .append("svg:svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

            focus = outer.append("g")
                    .attr("class", "focus")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            focus.append("clipPath")
                    .attr("id", "clip")
                .append("rect")
                    .attr("x", 0)
                    .attr("y", y(1))
                    .attr("width", width)
                    .attr("height", y(0) - y(1));

            focus.append("g")
                    .attr("class", "volume")
                    .attr("clip-path", "url(#clip)");

            focus.append("g")
                    .attr("class", "candlestick")
                    .attr("clip-path", "url(#clip)");

            focus.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")");

            focus.append("g")
                    .attr("class", "y axis")
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Price ($)");

            focus.append('g')
                    .attr("class", "crosshair")
                    .call(crosshair);

            context = outer.append("g")
                    .attr("class", "context")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            context.append("g")
                    .attr("class", "close");

            context.append("g")
                    .attr("class", "pane");

            context.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height2 + ")");

            context.append("g")
                    .attr("class", "y axis")
                    .call(yAxis2);

            var data = [{"Date":"27-Mar-09","Open":15.46,"High":15.5,"Low":15.2,"Close":15.26,"Volume":123260683},{"Date":"26-Mar-09","Open":15.4,"High":15.71,"Low":15.37,"Close":15.7,"Volume":154062776},{"Date":"25-Mar-09","Open":15.37,"High":15.48,"Low":14.84,"Close":15.21,"Volume":161662886},{"Date":"24-Mar-09","Open":15.19,"High":15.63,"Low":15.06,"Close":15.21,"Volume":160856745},{"Date":"23-Mar-09","Open":14.67,"High":15.45,"Low":14.54,"Close":15.38,"Volume":166641097},{"Date":"20-Mar-09","Open":14.58,"High":14.73,"Low":14.37,"Close":14.51,"Volume":173926123},{"Date":"19-Mar-09","Open":14.55,"High":14.74,"Low":14.32,"Close":14.52,"Volume":125079465},{"Date":"18-Mar-09","Open":14.27,"High":14.78,"Low":14.25,"Close":14.5,"Volume":199050355},{"Date":"17-Mar-09","Open":13.61,"High":14.24,"Low":13.58,"Close":14.24,"Volume":197005102},{"Date":"16-Mar-09","Open":13.79,"High":13.91,"Low":13.45,"Close":13.63,"Volume":199386740},{"Date":"13-Mar-09","Open":13.76,"High":13.89,"Low":13.57,"Close":13.7,"Volume":150320072},{"Date":"12-Mar-09","Open":13.27,"High":13.8,"Low":13.14,"Close":13.76,"Volume":192203340},{"Date":"11-Mar-09","Open":12.83,"High":13.44,"Low":12.8,"Close":13.24,"Volume":211696254},{"Date":"10-Mar-09","Open":12.12,"High":12.74,"Low":12.05,"Close":12.66,"Volume":211126251},{"Date":"9-Mar-09","Open":12.03,"High":12.51,"Low":11.8,"Close":11.87,"Volume":174619354},{"Date":"6-Mar-09","Open":12.62,"High":12.63,"Low":11.76,"Close":12.19,"Volume":252786562},{"Date":"5-Mar-09","Open":12.92,"High":13.12,"Low":12.64,"Close":12.69,"Volume":176723638},{"Date":"4-Mar-09","Open":12.88,"High":13.25,"Low":12.78,"Close":13.02,"Volume":185381623},{"Date":"3-Mar-09","Open":12.7,"High":12.96,"Low":12.55,"Close":12.62,"Volume":181084918},{"Date":"2-Mar-09","Open":12.59,"High":13.03,"Low":12.52,"Close":12.56,"Volume":192742970},{"Date":"27-Feb-09","Open":12.56,"High":13.04,"Low":12.52,"Close":12.76,"Volume":176686048},{"Date":"26-Feb-09","Open":13.14,"High":13.27,"Low":12.71,"Close":12.74,"Volume":157513937},{"Date":"25-Feb-09","Open":12.84,"High":13.27,"Low":12.75,"Close":13.02,"Volume":208328001},{"Date":"24-Feb-09","Open":12.49,"High":12.98,"Low":12.43,"Close":12.89,"Volume":201773159},{"Date":"23-Feb-09","Open":13.09,"High":13.14,"Low":12.36,"Close":12.42,"Volume":196743015},{"Date":"20-Feb-09","Open":12.8,"High":13.2,"Low":12.7,"Close":13,"Volume":187575094},{"Date":"19-Feb-09","Open":13.34,"High":13.46,"Low":12.87,"Close":12.95,"Volume":230700547},{"Date":"18-Feb-09","Open":13.58,"High":13.69,"Low":13.25,"Close":13.48,"Volume":171142041},{"Date":"17-Feb-09","Open":13.84,"High":13.86,"Low":13.47,"Close":13.5,"Volume":169558382},{"Date":"13-Feb-09","Open":14.14,"High":14.28,"Low":14.02,"Close":14.17,"Volume":152266590},{"Date":"12-Feb-09","Open":13.69,"High":14.25,"Low":13.69,"Close":14.18,"Volume":204335663},{"Date":"11-Feb-09","Open":13.77,"High":14.04,"Low":13.68,"Close":13.83,"Volume":168776993},{"Date":"10-Feb-09","Open":14.48,"High":14.64,"Low":13.87,"Close":13.98,"Volume":212329642},{"Date":"9-Feb-09","Open":14.29,"High":14.71,"Low":14.21,"Close":14.64,"Volume":178749928},{"Date":"6-Feb-09","Open":13.86,"High":14.29,"Low":13.86,"Close":14.25,"Volume":171784417},{"Date":"5-Feb-09","Open":13.25,"High":13.89,"Low":13.23,"Close":13.78,"Volume":187353537},{"Date":"4-Feb-09","Open":13.32,"High":13.75,"Low":13.3,"Close":13.36,"Volume":202103258},{"Date":"3-Feb-09","Open":13.13,"High":13.34,"Low":12.9,"Close":13.28,"Volume":149860816},{"Date":"2-Feb-09","Open":12.73,"High":13.14,"Low":12.7,"Close":13.07,"Volume":139603352},{"Date":"30-Jan-09","Open":13.23,"High":13.37,"Low":12.86,"Close":12.88,"Volume":162955387},{"Date":"29-Jan-09","Open":13.3,"High":13.48,"Low":13.23,"Close":13.29,"Volume":148300005},{"Date":"28-Jan-09","Open":13.16,"High":13.57,"Low":13.07,"Close":13.46,"Volume":219701881},{"Date":"27-Jan-09","Open":12.88,"High":13.08,"Low":12.82,"Close":12.96,"Volume":154631463},{"Date":"26-Jan-09","Open":12.69,"High":13,"Low":12.61,"Close":12.81,"Volume":174853854},{"Date":"23-Jan-09","Open":12.4,"High":12.84,"Low":12.36,"Close":12.62,"Volume":190942374},{"Date":"22-Jan-09","Open":12.58,"High":12.86,"Low":12.26,"Close":12.62,"Volume":352381827},{"Date":"21-Jan-09","Open":11.34,"High":11.84,"Low":11.33,"Close":11.83,"Volume":275012619},{"Date":"20-Jan-09","Open":11.7,"High":11.71,"Low":11.17,"Close":11.17,"Volume":230207747},{"Date":"16-Jan-09","Open":12.04,"High":12.05,"Low":11.49,"Close":11.76,"Volume":262120509},{"Date":"15-Jan-09","Open":11.51,"High":12.02,"Low":11.44,"Close":11.91,"Volume":460808390},{"Date":"14-Jan-09","Open":12.32,"High":12.46,"Low":12.1,"Close":12.19,"Volume":267996414},{"Date":"13-Jan-09","Open":12.61,"High":12.82,"Low":12.34,"Close":12.53,"Volume":199728781},{"Date":"12-Jan-09","Open":12.92,"High":13,"Low":12.51,"Close":12.67,"Volume":154530138},{"Date":"9-Jan-09","Open":13.32,"High":13.34,"Low":12.88,"Close":12.94,"Volume":137445749},{"Date":"8-Jan-09","Open":12.92,"High":13.31,"Low":12.86,"Close":13.24,"Volume":168365988},{"Date":"7-Jan-09","Open":13.12,"High":13.21,"Low":12.89,"Close":13,"Volume":189300706},{"Date":"6-Jan-09","Open":13.71,"High":13.88,"Low":13.2,"Close":13.29,"Volume":323043903},{"Date":"5-Jan-09","Open":13.31,"High":13.74,"Low":13.24,"Close":13.51,"Volume":297211453},{"Date":"2-Jan-09","Open":12.27,"High":13.01,"Low":12.17,"Close":12.96,"Volume":188749470},{"Date":"31-Dec-08","Open":12.28,"High":12.53,"Low":12.19,"Close":12.19,"Volume":152010341},{"Date":"30-Dec-08","Open":12.49,"High":12.58,"Low":12.1,"Close":12.33,"Volume":242057340},{"Date":"29-Dec-08","Open":12.36,"High":12.52,"Low":12.15,"Close":12.37,"Volume":171970575},{"Date":"26-Dec-08","Open":12.38,"High":12.49,"Low":12.18,"Close":12.26,"Volume":77301497},{"Date":"24-Dec-08","Open":12.31,"High":12.32,"Low":12.08,"Close":12.15,"Volume":67864958},{"Date":"23-Dec-08","Open":12.41,"High":12.55,"Low":12.27,"Close":12.34,"Volume":160419182},{"Date":"22-Dec-08","Open":12.86,"High":12.86,"Low":12.1,"Close":12.25,"Volume":211275512},{"Date":"19-Dec-08","Open":12.85,"High":12.99,"Low":12.69,"Close":12.86,"Volume":203740908},{"Date":"18-Dec-08","Open":12.76,"High":12.98,"Low":12.63,"Close":12.78,"Volume":214435473},{"Date":"17-Dec-08","Open":13,"High":13.01,"Low":12.57,"Close":12.74,"Volume":325029152},{"Date":"16-Dec-08","Open":13.43,"High":13.78,"Low":13.25,"Close":13.63,"Volume":281118306},{"Date":"15-Dec-08","Open":13.71,"High":13.74,"Low":13.29,"Close":13.54,"Volume":223012776},{"Date":"12-Dec-08","Open":13.26,"High":14.14,"Low":13.22,"Close":14.04,"Volume":260703436},{"Date":"11-Dec-08","Open":13.91,"High":14.46,"Low":13.55,"Close":13.57,"Volume":260820049},{"Date":"10-Dec-08","Open":13.98,"High":14.21,"Low":13.79,"Close":14.03,"Volume":234619959},{"Date":"9-Dec-08","Open":14.01,"High":14.8,"Low":13.89,"Close":14.29,"Volume":301029386},{"Date":"8-Dec-08","Open":13.9,"High":14.4,"Low":13.69,"Close":14.25,"Volume":296423162},{"Date":"5-Dec-08","Open":12.91,"High":13.5,"Low":12.69,"Close":13.43,"Volume":261100840},{"Date":"4-Dec-08","Open":13.49,"High":13.6,"Low":12.72,"Close":13.06,"Volume":272921397},{"Date":"3-Dec-08","Open":12.77,"High":13.75,"Low":12.69,"Close":13.7,"Volume":335054356},{"Date":"2-Dec-08","Open":12.86,"High":13.24,"Low":12.36,"Close":13.21,"Volume":287354109},{"Date":"1-Dec-08","Open":13.04,"High":13.18,"Low":12.7,"Close":12.7,"Volume":231040523},{"Date":"28-Nov-08","Open":13.53,"High":13.54,"Low":13.12,"Close":13.24,"Volume":75301359},{"Date":"26-Nov-08","Open":12.85,"High":13.61,"Low":12.84,"Close":13.57,"Volume":225125607},{"Date":"25-Nov-08","Open":13.52,"High":13.53,"Low":12.59,"Close":12.97,"Volume":308889210},{"Date":"24-Nov-08","Open":12.17,"High":13.54,"Low":12.12,"Close":13.28,"Volume":360673138},{"Date":"21-Nov-08","Open":11.7,"High":12.02,"Low":11.31,"Close":11.8,"Volume":392392448},{"Date":"20-Nov-08","Open":12.18,"High":12.35,"Low":11.43,"Close":11.5,"Volume":429184959},{"Date":"19-Nov-08","Open":12.78,"High":13.08,"Low":12.32,"Close":12.33,"Volume":293068307},{"Date":"18-Nov-08","Open":12.81,"High":13,"Low":12.41,"Close":12.84,"Volume":302588524},{"Date":"17-Nov-08","Open":12.64,"High":12.94,"Low":12.47,"Close":12.59,"Volume":290730979},{"Date":"14-Nov-08","Open":13.39,"High":13.43,"Low":12.86,"Close":12.89,"Volume":351319710},{"Date":"13-Nov-08","Open":12.84,"High":13.78,"Low":12.29,"Close":13.78,"Volume":463840426},{"Date":"12-Nov-08","Open":13.2,"High":13.32,"Low":12.86,"Close":12.87,"Volume":294732067},{"Date":"11-Nov-08","Open":13.54,"High":13.88,"Low":13.18,"Close":13.54,"Volume":306249097},{"Date":"10-Nov-08","Open":14.31,"High":14.34,"Low":13.5,"Close":13.7,"Volume":281471498},{"Date":"7-Nov-08","Open":14.18,"High":14.26,"Low":13.67,"Close":14.03,"Volume":273909153},{"Date":"6-Nov-08","Open":14.44,"High":14.68,"Low":14,"Close":14.16,"Volume":329909594},{"Date":"5-Nov-08","Open":15.56,"High":15.67,"Low":14.71,"Close":14.76,"Volume":314406141},{"Date":"4-Nov-08","Open":15.71,"High":15.97,"Low":15.24,"Close":15.86,"Volume":349991453},{"Date":"3-Nov-08","Open":15.13,"High":15.59,"Low":14.98,"Close":15.28,"Volume":264609660},{"Date":"31-Oct-08","Open":15.34,"High":15.83,"Low":15.02,"Close":15.37,"Volume":415042817},{"Date":"30-Oct-08","Open":15.46,"High":16.03,"Low":15.37,"Close":15.86,"Volume":409521910},{"Date":"29-Oct-08","Open":14.41,"High":15.65,"Low":14.28,"Close":14.94,"Volume":488329408},{"Date":"28-Oct-08","Open":13.63,"High":14.36,"Low":13.2,"Close":14.27,"Volume":408927400},{"Date":"27-Oct-08","Open":13.58,"High":13.95,"Low":13.12,"Close":13.16,"Volume":302347192},{"Date":"24-Oct-08","Open":12.9,"High":13.99,"Low":12.87,"Close":13.77,"Volume":397434996},{"Date":"23-Oct-08","Open":13.79,"High":14.18,"Low":13.13,"Close":14.03,"Volume":418857418}];
            load(data)
        },
        uninit:function() {
            console.log(container_div);
            outer.remove();
        }
    }
})();