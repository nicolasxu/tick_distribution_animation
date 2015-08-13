(function(){

	$(document).ready(function(){

		var theApp = new App();
		
		theApp.init();
		theApp.startLoop();

	});

	function initChartFunc() {
		
		// set margin
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		// calculate width from margin
		    width = 960 - margin.left - margin.right,
		// calculate height from margin
		    height = 500 - margin.top - margin.bottom;

		// create d3 format object
		var formatPercent = d3.format(".0%");

		// create ordinal x scale, set range, not domain, domain is set when data done loading
		// domain is input, range is actual length in pixel
		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1, 1);

		// create y linear scale, set the range, since the origin is (0, 0) the top left corner
		// of canvas. The lowest data value maps the lowest point, which has the highest y value
		// which is the height of canvas
		var y = d3.scale.linear()
		    .range([height, 0]);

		// create d3 axis for x value, and feed it with the x scale we just created
		// orientation affects the position of the ticks and their labels in relation
		// to the axis path, but does not change the position of the axis itself
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		// same as x axis, and apply tick format
		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .tickFormat(formatPercent);

		// appnd svg, set width & height of svg, append g tag in svg, set the margin 
		// of g tag
		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// load tsv data
		d3.tsv("data.tsv", function(error, data) {

			// convert d.frequency from string to number
		  data.forEach(function(d) {
		    d.frequency = +d.frequency;
		  });

		  // after data loading done, set the domain for x scale. 
		  // map return an array of letters
		  x.domain(data.map(function(d) { return d.letter; }));

		  // set the domain of y scale, 0 -> highest range, max -> 0 range (top)
		  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

		  // draw x axis based on a g tag
		  // translate x axis to the bottom of the svg
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  // draw y axis, set class, append text label in g tag 
		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Frequency");

		  // drawing bars
		  svg.selectAll(".bar") // select element with .bar class name, which is non
		      .data(data) // bind data, even there is no element
		    .enter() // returns placeholder nodes which doesn't have matched data
		    	.append("rect") // append rect tag to each empty node returned by enter()
		      .attr("class", "bar") // add bar class
		      .attr("x", function(d) { return x(d.letter); }) // set x position, x is the d3.scale.ordinal
		      .attr("width", x.rangeBand()) // width is d3.scale.ordinal calculated range band width
		      .attr("y", function(d) { return y(d.frequency); }) // set y position relative to top left using y = d3.scale.linear()
		      .attr("height", function(d) { return height - y(d.frequency); }); // height is the total height - cordinate.y

		  // bind event handler
		  d3.select("input").on("change", change);

		  // trigger check event in 2 seconds
		  var sortTimeout = setTimeout(function() {
		    d3.select("input").property("checked", true).each(change);
		  }, 2000);

		  console.log( data);
		  document.data = data;

		  function change() {
		    clearTimeout(sortTimeout);

		    // Copy-on-write since tweens are evaluated after a delay.
		    // in event handler, 'this' refers to the dom object that event happens
		    var x0 = x.domain(data.sort(this.checked
		        ? function(a, b) { return b.frequency - a.frequency; }
		        : function(a, b) { return d3.ascending(a.letter, b.letter); })
		        .map(function(d) { return d.letter; }))
		        .copy();

		    svg.selectAll(".bar")
		        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

		    var transition = svg.transition().duration(750),
		        delay = function(d, i) { return i * 50; };

		    transition.selectAll(".bar")
		        .delay(delay)
		        .attr("x", function(d) { return x0(d.letter); });

		    transition.select(".x.axis")
		        .call(xAxis)
		      .selectAll("g")
		        .delay(delay);
		  }
		});

		
	}

	function calculateUpdateFunc() {

		// 1. update tick index
		if(this.tickIndex == null) {
			this.tickIndex = 0;
		} else {
			this.tickIndex = this.tickIndex + 1; 
		}

		// 2. create dist if necessary
		if(this.distData == null) {
			this.distData = {};
		}
		

		// 3. update tick dist
		this.updateChart(tickData[this.tickIndex]);
	}

	function updateChartFunc(tickPrice) {

	}

	function initDataFunc() {
		
		this.data = [3,4,5,8,12, 20];
	
	}

	function startLoopFunc() {
		console.log('chart data is: ' + this.chartData);
		console.log(this);
	
	}

	function initFunc() {
		
		this.initData();
		this.initChart();
		this.calculateUpdateDist();
	}

	function App() {
		
	}
	App.prototype.updateChart = updateChartFunc;
	App.prototype.calculateUpdateDist = calculateUpdateFunc;
	App.prototype.initData = initDataFunc;
	App.prototype.startLoop = startLoopFunc;
	App.prototype.initChart = initChartFunc;
	App.prototype.init = initFunc;


})();

