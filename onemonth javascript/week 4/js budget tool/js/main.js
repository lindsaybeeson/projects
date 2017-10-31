var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1yR6hJ1nAZe29cWaaYoaEiGuU4St1UlBNPTmI8KMH_D8/edit?usp=sharing';
//var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1i3YFZ8LhjB4rLOpD0LsCswUzACNX4xVHIkOf5HAZerA/edit?usp=sharing';

var body = document.querySelector('body');
var container = document.createElement('div');
body.appendChild(container);



// Initialize Tabletop
function init() {
	Tabletop.init( { key: publicSpreadsheetUrl,
                 	 callback: initSelect,
                 	 orderby: 'budgetitem',
                 	 simpleSheet: true } )
	}

// Function to intialize select options via data from spreadsheet
function initSelect(data) {

	var filteredData = data.filter(function(datum) {
		return datum['Budget Item'] !== '';
	});

	// Find the select and add an event listener to send data from selected option into function for use in rendering chart.
	var select = document.querySelector('.select_list');
	select.onchange = changeEventHandler;

	filteredData.forEach(function(filteredDatum){

		var option = document.createElement('option');
		var budgetItem = filteredDatum['Budget Item'];
		option.value = budgetItem;
		option.text = budgetItem;
		select.appendChild(option);
	});

	// Function to call function handling rendering of charts
	function changeEventHandler(event) { 
		var selection = event.target.value;
		renderChart(selection, filteredData);
   	}
}

// Function to call drawColumnChart given a selection (category) and data from spreadsheet
function renderChart(selection, filteredData) {
	// Loop through array of objects and if the key matches selection, use data for drawing chart
	filteredData.forEach(function(filteredData){
		
		//Element variables
		var aboutSpending = document.querySelector('.about_spending');
		var factoids = document.querySelector('.factoids');

		var budgetItem = filteredData['Budget Item'];
		var daySpending = filteredData['Spending / day'];
		var dayBudgeted = filteredData['Budgeted / day'];
/*		var monthSpending = filteredData['Avg Mo Spending'];
		var monthBudgeted = filteredData['Budgeted / mo'];
*/		var dayRemaining = filteredData['Remaining / day'];
/*		var weekRemaining = filteredData['Remaining / week'];
		var monthRemaining = filteredData['Remaining / month'];
*/		var spentYTD = filteredData['Spending YTD'];
		var budgetYTD = filteredData['Budgeted YTD'];
		var spendToday = (parseFloat(budgetYTD) - parseFloat(spentYTD)).toFixed(2);

		//Ledger values
		var date = filteredData['Date'];
		var merchant = filteredData['Payee or Receiving Account'];
		var account = filteredData['Accont'];
		var debit = filteredData['Debit'];
		var credit = filteredData['Credit'];



		if (budgetItem === selection) {

			console.log(parseFloat(spentYTD));

			aboutSpending.innerHTML = 'You can spend <span class="amount">$' + spendToday + '</span> today on ' + budgetItem + ' without going over budget.';
			factoids.innerHTML = 'So far this year, you\'ve spent $' + spentYTD + ' on ' + budgetItem + '.';

			drawColumnChart(daySpending, dayBudgeted, dayRemaining);

		};
	});
}

// MAKING CHART

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(renderChart);

// Callback that creates and populates a data table, instantiates the column chart, passes in the data and draws it.
function drawColumnChart(spent, budgeted, remaining) {

		var datum = google.visualization.arrayToDataTable([
		['Item','Amount',{role: 'style'},{role:'annotation'}],
		['Spent',parseFloat(spent),'#a2c4c9',parseFloat(spent),],
		['Budgeted',parseFloat(budgeted),'#d2cdc8',parseFloat(budgeted)],
		['Remaining',parseFloat(remaining),'#b4a7d6',parseFloat(remaining)]
		]);

	// Set chart options
	var options = {
//		title:'Average Daily Overview',
		fontSize: 48,
		legend: {position: 'none'},
		backgroundColor:'#e0dbd6',
		fontName: 'Montserrat',
		chartArea:{width:'80%',height:'70%'},
		vAxis:{baseline:0,textPosition:'none'},
/*		titleTextStyle: {
			color: '#666666',
			fontName: 'Montserrat',
			fontSize: 24,
			bold: true
			}
*/		};

	// Instantiate and draw your chart, passing in some options.
	function resize () {
		var columnChart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
		columnChart.draw(datum, options);
	};

	resize();
	window.addEventListener('resize',resize);



}

function test() {
	console.log("hello");
}

window.addEventListener('DOMContentLoaded', init)
