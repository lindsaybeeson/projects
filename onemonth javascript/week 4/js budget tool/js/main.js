var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1yR6hJ1nAZe29cWaaYoaEiGuU4St1UlBNPTmI8KMH_D8/edit?usp=sharing';

var body = document.querySelector('body');
var container = document.createElement('div');
body.appendChild(container);



// Initialize Tabletop

function init() {
	Tabletop.init( { key: publicSpreadsheetUrl,
                 	 callback: initSelect,
                 	 simpleSheet: true } )
	}


// Function to intialize select options via data from spreadsheet
function initSelect(data) {

	var filteredData = data.filter(function(datum) {

		return datum['Budget Item'] !== '';

	});

	console.log(filteredData);


	// Find the select and add an event listener to send data from selected option into function
	// for use in rendering chart.
	var select = document.querySelector('.select_list');
	select.onchange = changeEventHandler;

	filteredData.forEach(function(filteredData){

		var option = document.createElement('option');
		var budgetItem = filteredData['Budget Item'];
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

// Function to call drawChart given a selection (category) and data from spreadsheet
function renderChart(selection, filteredData) {
	// Loop through array of objects and if the key matches selection, use data for drawing chart
	filteredData.forEach(function(filteredData){
		var budgetItem = filteredData['Budget Item'];
		var monthSpending = filteredData['Avg Mo Spending'];
		var monthBudgeted = filteredData['Budgeted / mo'];

		if (budgetItem === selection) {
			drawChart(monthSpending, monthBudgeted)
		};
	});
}


window.addEventListener('DOMContentLoaded', init)


// MAKING CHART

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(spent, budgeted) {

		var datum = google.visualization.arrayToDataTable([
		['Item','Amount',{role: 'style'}],
		['Spent', parseFloat(spent),'grey'],
		['Budgeted', parseFloat(budgeted),'darkgrey']
		]);

	// Set chart options
	var options =	{title:'Monthly',
					width:600,
					height:400,
					colors:['grey'],
					backgroundColor:'lightgrey'};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	chart.draw(datum, options);
}

