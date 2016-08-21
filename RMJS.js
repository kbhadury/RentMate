var main = function(){	
/* MAIN PAGE */	
	$(".tech-slide").hover(
		function(){
			$(this).animate({
				opacity: "1",
			}, 500);
		},
		function(){
			$(this).animate({
				opacity: ".5",
			}, 500);
		}
	);
	
/* CALCULATE RENT */
	//Determine if the Submit and Reset buttons should be active
	
	/*
	We can't just use the "required" input attribute because the
	submit button can only be enabled after the user has pressed
	"Add" at least once.  In this case it's easier to use regular
	buttons and modify their actions with jQuery
	*/
	
	var rentValid = false;
	var rmmtValid = false;
	var rentRmts = [];
	var sqftList = [];
	var roomCounter = 1;
	
	/*Adds a green stripe when a valid number is entered*/
	$("#rent-amt").keyup(function(){
		if($(this).val() < 1){
			$("#rent-amt-col").css("border-left", "5px solid gray");
			rentValid = false;
			$("#submit-rent").prop("disabled", true);
		} else {
			$("#rent-amt-col").css("border-left", "5px solid #00cc00");
			rentValid = true;
			if(rmmtValid){
				$("#submit-rent").prop("disabled", false);
			}
		}
	});
	
	/*Input validation for adding roommates*/
	$("#names, #sqft").keyup(function(){
		if($("#names").val().length == 0 || $("#sqft").val() < 1){
			$("#name-sqft-btn").prop("disabled", true);
		} else {
			$("#name-sqft-btn").prop("disabled", false);
		}
	});
	
	/*Add info to arrays and display on page, add a green stripe next to list*/
	$("#name-sqft-btn").click(function(){
		//Disable button
		$(this).prop("disabled", true);
		
		var names = $("#names").val().split(",");
		var numNames = names.length;
		var sqft = parseFloat($("#sqft").val());
		var indivSqft = sqft/numNames;
		
		//If new name, push to arrays.  Otherwise update current sqft info.
		for(i=0; i<numNames; ++i){
			names[i] = names[i].trim(); //Remove extra spaces
			var nameIndex = rentRmts.indexOf(names[i]);
			if(nameIndex == -1){
				rentRmts.push(names[i]);
				sqftList.push(indivSqft);
			} else {
				sqftList[nameIndex] += indivSqft;
			}
		}
		
		//Display on page
		var entryStr = "Room #" + roomCounter + ": " + sqft + " sq. ft.: " + names.join(", ");
		var entry = $("<li>").text(entryStr);
		entry.appendTo("#room-list");
		
		//Update counters
		++roomCounter;
		$("#room-number").text("Room #" + roomCounter + ":");
		
		//Add green stripe
		$("#name-sqft-col").css("border-left", "5px solid #00cc00");
		
		//Reset form
		$("#names, #sqft").val("");
		
		//Check to see if Submit should be enabled
		rmmtValid = true;
		if(rentValid){
			$("#submit-rent").prop("disabled", false);
		}
		
		//Enable reset button
		$("#reset-rent").prop("disabled", false);
		
		//Give the "sqft" field focus (user convenience)
		$("#sqft").focus();
	});
	
	/*Perform calculations and display results*/
	$("#submit-rent").click(function(){
		//Deactivate submit button
		$(this).prop("disabled", true);
		
		var resultTable = $("#rent-table");
		
		//Remove existing results from HTML but keep the array data
		resultTable.empty();
		
		//Calculate and display results
		var totalSqft = calcSum(sqftList);
		var rent = $("#rent-amt").val();
		
		//Generate result table
		resultTable.append("<caption>Rent ($/month)</caption>");
		
		//Create headers
		var tableRow = $("<tr>");
		tableRow.append("<th>Person</th><th>Rent</th>");
		resultTable.append(tableRow);
		
		for(i=0; i<sqftList.length; ++i){
			tableRow = $("<tr>");
			var amt = parseFloat((sqftList[i]/totalSqft) * rent).toFixed(2);
			tableRow.append($("<td>").text(rentRmts[i]));
			tableRow.append($("<td>").text(amt));
			resultTable.append(tableRow);
		}
		
		$("#rent-result").fadeIn(500);
	});
	
	/* Reset entire form */
	$("#reset-rent").click(function(){
		//Disable buttons
		$("#reset-rent, #submit-rent, #name-sqft-btn").prop("disabled", true);
		
		//Reset vars
		rentValid = false;
		rmmtValid = false;
		rentRmts = [];
		sqftList = [];
		roomCounter = 1;
		
		//Reset elements
		$("#room-list").empty();
		$("#room-number").text("Room #1:");
		$("#rent-amt, #names, #sqft").val("");
		$("#rent-container").find(".input-col-border").css("border-left", "5px solid gray");
		$("#rent-result").fadeOut(500);
	});
	
/* CALCULATE UTILITIES */
	
	var utilRmts; //Array, set by input field
	var utilTypes = [];
	var utilResults = [];
	var utilsValid = false;
	var chxValid = true; //All selected by default
	var utilCounter = 1;
	
	/*Add green stripe when input field is non-empty*/
	$("#util-rmts").keyup(function(){
		if($(this).val().length > 0){
			$("#util-rmts-col").css("border-left","5px solid #00cc00");
			$("#util-rmts-btn").prop("disabled", false);
		} else {
			$("#util-rmts-col").css("border-left","5px solid gray");
			$("#util-rmts-btn").prop("disabled", true);
		}
	});
	
	/*Parse list of names and create checkbox area*/
	$("#util-rmts-btn").click(function(){
		//Don't allow spontaneous name changes
		$("#util-rmts, #util-rmts-btn").prop("disabled", true);
		
		utilRmts = $("#util-rmts").val().split(",");
		var numNames = utilRmts.length;
		
		//Trim extra spaces
		for(i=0; i<numNames; ++i){
			utilRmts[i] = utilRmts[i].trim();
		}
		
		//Initialize results array (see below for details)
		for(j=0; j<numNames; ++j){
			utilResults.push([]);
		}
		
		//Create checkboxes (still hidden at this point)
		var chxArea = $("#checkbox-div");
		for(k=0; k<numNames; ++k){
			var name = utilRmts[k];
			var label = $("<label>").text(name);
			var box = $("<input>").attr("type", "checkbox").prop("checked", true); //All selected by default
			label.prepend(box); //Put text to the left of box
			chxArea.append(label);
		}
		
		//Reveal next section
		$("#util-types-col").slideDown(500, function(){
			$("#util-type").focus(); //User convenience
		});	
		
		//Enable reset
		$("#reset-util").prop("disabled", false);
	});
	
	/*Determine if Add Utility button should be enabled*/	
	$("#util-type, #util-cost").keyup(function(){
		if($("#util-type").val().length == 0 || $("#util-cost").val() < 1){
			utilsValid = false;
			$("#add-util-btn").prop("disabled", true);
		} else {
			utilsValid = true;
			if(chxValid){
				$("#add-util-btn").prop("disabled", false);
			}
		}
	});
	
	$("#checkbox-div").click(function(){
		if($("input:checked").length == 0){
			chxValid = false;
			$("#add-util-btn").prop("disabled", true);
		} else {
			chxValid = true;
			if(utilsValid){
				$("#add-util-btn").prop("disabled", false);
			}
		}
	});
	
	/*
	Add utility data to list and start creating results list.
	utilResults contains one array per name at the same index as the name in utilRmts.
	These arrays hold the cost per person of the utilities in the order they were entered.
	Ex:
	utilRmts: [Jim, John, Jones]
	utilTypes: [Water, Electricity]
	utilResults: [[100,200],[0,200],[100,0]]
	Jim: $100 water, $200 electricity
	John: $0 water, $200 electricity
	Jones: $100 water, $0 electricity	
	*/
	$("#add-util-btn").click(function(){
		//Disable button
		$(this).prop("disabled", true);
		utilsValid = false;
		chxValid = true;
		
		//Parse inputs
		var utilType = $("#util-type").val();
		utilTypes.push(utilType);	
		var cost = parseFloat($("#util-cost").val());
		var boxes = $("input:checkbox");
		var users = $("input:checked");
		var costPerUser = cost/users.length; //Length won't be 0
		
		//Cycle through boxes and update results array
		boxes.each(function(index){
			if($(this).prop("checked")){
				utilResults[index].push(costPerUser);
			} else {
				utilResults[index].push(0);
			}
		});
		
		//Add to util-list
		var listStr = "Utility #" + utilCounter + ": " + utilType + ", $" + cost.toFixed(2) + " per month"
		$("#util-list").append($("<li>").text(listStr));
		
		//Update counters
		++utilCounter;
		$("#util-number").text("Utility #" + utilCounter + ":");
		
		
		//Add green stripe
		$("#util-types-col").css("border-left", "5px solid #00cc00");
		
		//Reset form
		$("#util-type, #util-cost").val("");
		boxes.prop("checked", true);
		$("#util-type").focus(); //User convenience
		
		//Enable submit button
		$("#submit-util").prop("disabled", false);
	});
	
	/*Submit data and display results*/
	$("#submit-util").click(function(){
		//Deactivate Submit button
		$(this).prop("disabled", true);
		
		var resultTable = $("#util-table");
		
		//Remove existing HTML
		resultTable.empty();
		
		resultTable.append("<caption>Utilities ($/month)</caption>");
		
		//Create headers
		var tableRow = $("<tr>");
		tableRow.append("<th>Utility</th>");
		for(i=0; i<utilRmts.length; ++i){
			tableRow.append($("<th>").text(utilRmts[i]));
		}
		resultTable.append(tableRow);
		
		//Fill table
		for(j=0; j<utilTypes.length; ++j){
			tableRow = $("<tr>");
			var utilIcon = getUtilIcon(utilTypes[j]);
			tableRow.append($("<th>").text(" " + utilTypes[j]).prepend(utilIcon));
			for(k=0; k<utilRmts.length; ++k){
				tableRow.append($("<td>").text(utilResults[k][j].toFixed(2)));
			}
			resultTable.append(tableRow);
		}
		
		//Add Totals row
		tableRow = $("<tr>");
		tableRow.append("<th>Total cost</th>");
		for(m=0; m<utilRmts.length; ++m){
			var sum = calcSum(utilResults[m]);
			tableRow.append($("<td>").text(sum.toFixed(2)));
		}
		resultTable.append(tableRow);
		
		$("#util-result").fadeIn(500);
	});
	
	/*Reset entire form*/
	$("#reset-util").click(function(){
		//Disable buttons
		$("#reset-util, #submit-util, #add-util-btn").prop("disabled", true);
		
		//Reset vars (utilRmts gets reset automatically by button)
		utilsValid = false;
		chxValid = true;
		utilTypes = [];
		utilResults = [];
		utilCounter = 1;
		
		//Reset elements
		$("#util-types-col").slideUp(500);
		$("#checkbox-div").empty();
		$("#util-type, #util-cost, #util-rmts").val("");
		$("#util-list").empty();
		$("#util-number").text("Utility	 #1:");
		$("#utils-container").find(".input-col-border").css("border-left", "5px solid gray");
		$("#util-rmts").prop("disabled", false);	
		
		$("#util-result").fadeOut(500);
	});
	
/*?*/
	$(".x").hover(function(){
		$(".non-code").toggle();
		$(".code").toggle();
	});
};

/*
Returns sum of array values
Input: 1D array of numbers
Output: sum total of array values
*/
function calcSum(arr){
	var total = 0;
	for(i=0; i<arr.length; ++i){
		total += arr[i];
	}
	return total;
};

/*
Returns a jQuery span object containing a glyphicon related to the utility.
Ex: "water" returns a blue drop icon
Input: string with utility name
Output: relevant glyphicon in a span object.  If no icon matches, a
default <span> is returned
*/ 
function getUtilIcon(util){
	util = util.toUpperCase(); //Standardize
	
	if(util === "WATER"){
		return $("<span class='glyphicon glyphicon-tint' style='color:#66ccff'></span>");
	}
	if(util === "GAS" || util === "HEAT" || util === "HEATING"){
		return $("<span class='glyphicon glyphicon-fire' style='color:#ff6600'></span>");
	}
	if(util === "TRASH"){
		return $("<span class='glyphicon glyphicon-trash' style='color:#808080'></span>");
	}
	if(util === "SEWAGE"){
		return $("<span class='glyphicon glyphicon-tint' style='color:#888844'></span>");
	}
	if(util === "ELECTRIC" || util === "ELECTRICITY"){
		return $("<span class='glyphicon glyphicon-flash' style='color:#f2f20d'></span>");
	}
	if(util === "CABLE"){
		return $("<span class='glyphicon glyphicon-picture' style='color:#00b359'></span>");
	}
	if(util === "INTERNET" || util === "DSL" || util === "BROADBAND"){
		return $("<span class='glyphicon glyphicon-globe' style='color:#0080ff'></span>");
	}
	if(util === "PHONE" || util === "TELEPHONE" || util === "LANDLINE"){
		return $("<span class='glyphicon glyphicon-earphone' style='color:#ff4d4d'></span>");
	}
	if(util === "HOA" || util === "HOME OWNERS ASSOCIATION"){
		return $("<span class='glyphicon glyphicon-home' style='color:#4d94ff'></span>");
	}

	//Default
	return $("<span class='glyphicon glyphicon-ok-circle' style='color:#d9d9d9'></span>");
}

/*Let's go!*/
$(document).ready(main);
