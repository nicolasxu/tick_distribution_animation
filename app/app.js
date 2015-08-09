(function(){

	$(document).ready(function(){

		var theApp = new App();
		
		theApp.init();
		theApp.startLoop();

	});

	function initChartFunc() {
		//Chart.defaults.global.animation = false; 
		Chart.defaults.global.animationSteps = 5; // very fast animation
		Chart.defaults.global.responsive = true;
		this.ctx = document.getElementById("myChart").getContext("2d");
		this.myBarChart = new Chart(this.ctx).Bar(this.chartData);

		console.log(this.myBarChart.datasets);
		document.theChart = this.myBarChart;

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

		var tickString = tickPrice.toFixed(5);
		var bars = this.myBarChart.datasets[0].bars;
		var exist = false; 

		for(var barIndex = 0; barIndex < bars.length; barIndex++) {
			if(bars[barIndex].label === tickString) {
				exist = true; 
				bars[barIndex].value++;
				break; // exist the whole loop
			}
		}
		if(!exist) {
			this.myBarChart.addData([1], tickString);
		}

		this.myBarChart.update();
	}

	function initDataFunc() {
		
		this.chartData = {
		    labels: [],
		    datasets: [
		        {
		            label: "My Second dataset",
		            fillColor: "rgba(151,187,205,0.5)",
		            strokeColor: "rgba(151,187,205,0.8)",
		            highlightFill: "rgba(151,187,205,0.75)",
		            highlightStroke: "rgba(151,187,205,1)",
		            data: []
		        }
		    ]
		};
	}

	function startLoopFunc() {
		console.log('chart data is: ' + this.chartData);
		console.log(this);

		if(this.timerId == null) {
			var appObj = this;
			this.timerId = setInterval(function(){
				console.log(appObj.tickIndex);

				if(appObj.tickIndex > tickData.length) {
					clearInterval(appObj.timerId);
				} else {
					appObj.calculateUpdateDist();
				}
			}, 1000);

		} else {
		}
	
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

