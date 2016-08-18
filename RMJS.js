var main = function(){	
/* MAIN PAGE */	
	$(".tech-slide").hover(
		function(){
			$(this).animate({
				opacity: 1
			}, 500);
		},
		function(){
			$(this).animate({
				opacity: .5
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
	var rentNames = [];
	var sqftList = [];
	
	/*Adds a green stripe when a valid number is entered*/
	$("#rent-amt").keyup(function(){
		if($(this).val() < 0){
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
	$("#name, #sqft").keyup(function(){
		if($("#name").val().length == 0 || $("#sqft").val() < 1){
			$("#name-sqft-btn").prop("disabled", true);
		} else {
			$("#name-sqft-btn").prop("disabled", false);
		}
	});
	
	/*Add info to arrays and display on page, add a green stripe next to list*/
	$("#name-sqft-btn").click(function(){
		//Disable button
		$(this).prop("disabled", true);
		
		var name = $("#name").val();
		var sqft = parseFloat($("#sqft").val());
		
		//Add to arrays
		rentNames.push(name);
		sqftList.push(sqft);
		
		//Display on page
		var entryStr = name + ", " + sqft + " sq. ft.";
		var entry = $("<li>").text(entryStr);
		entry.appendTo("#rmmt-list");
		
		//Add green stripe
		$("#name-sqft-col").css("border-left", "5px solid #00cc00");
		
		//Reset form
		$("#name, #sqft").val("");
		
		//Check to see if Submit should be enabled
		rmmtValid = true;
		if(rentValid){
			$("#submit-rent").prop("disabled", false);
		}
		
		//Enable reset button
		$("#reset-rent").prop("disabled", false);
		
		//Give the "name" field focus (user convenience)
		$("#name").focus();
	});
	
	/*Perform calculations and display results*/
	$("#submit-rent").click(function(){
		//Deactivate submit button
		$(this).prop("disabled", true);
		
		var resultTable = $("#rent-table");
		
		//Remove existing results from HTML but keep the array data
		resultTable.empty();
		
		//Calculate and display results
		var totalSqft = calcTotalSqft(sqftList);
		var rent = $("#rent-amt").val();
		
		//Generate result table
		resultTable.append("<caption>Rent ($/mo)</caption>");
		
		//Create headers
		var tableRow = $("<tr>");
		tableRow.append("<th>Person</th><th>Rent</th>");
		resultTable.append(tableRow);
		
		for(i=0; i<sqftList.length; ++i){
			tableRow = $("<tr>");
			var amt = parseFloat((sqftList[i]/totalSqft) * rent).toFixed(2);
			tableRow.append($("<td>").text(rentNames[i]));
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
		rentNames = [];
		sqftList = [];
		
		//Reset elements
		$("#rmmt-list").empty();
		$("#rent-amt, #name, #sqft").val("");
		$("#rent-container").find(".input-col-border").css("border-left", "5px solid gray");
		$("#rent-result").fadeOut(500);
	});
	
/* CALCULATE UTILITIES */
	
	/*Add green stripe when input field is non-empty*/
	$("#util-rms").keyup(function(){
		if($(this).val().length > 0){
			$("#util-rms-col").css("border-left","5px solid #00cc00");
			$("#util-rms-btn").prop("disabled", false);
		} else {
			$("#util-rms-col").css("border-left","5px solid gray");
			$("#util-rms-btn").prop("disabled", true);
		}
	});
	
	/*Parse list of names and create checkbox area*/
	var utilNames;
	var utilTypes = [];
	var utilResults = [];
	$("#util-rms-btn").click(function(){
		//Don't allow spontaneous name changes
		$("#util-rms, #util-rms-btn").prop("disabled", true);
		
		utilNames = $("#util-rms").val().split(",");
		var numNames = utilNames.length;
		
		//Trim extra spaces
		for(i=0; i<numNames; ++i){
			utilNames[i] = utilNames[i].trim();
		}
		
		//Initialize results array (see below for details)
		for(j=0; j<numNames; ++j){
			utilResults.push([]);
		}
		
		//Create checkboxes (still hidden at this point)
		var chxArea = $("#checkbox-div");
		for(k=0; k<numNames; ++k){
			var name = utilNames[k];
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
	var utilsValid = false;
	var chxValid = true; //All selected by default
	
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
	utilResults contains one array per name at the same index as the name in utilNames.
	These arrays hold the cost per person of the utilities in the order they were entered.
	Ex:
	utilNames: [Jim, John, Jones]
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
		var cost = parseFloat($("#util-cost").val()).toFixed(2);
		var boxes = $("input:checkbox");
		var users = $("input:checked");
		var costPerUser = cost/users.length; //Length won't be 0
		
		//Cycle through boxes and update results array
		boxes.each(function(index){
			if($(this).prop("checked")){
				utilResults[index].push(costPerUser.toFixed(2));
			} else {
				utilResults[index].push(0);
			}
		});
		
		//Add to utils-list
		var listStr = utilType + ", $" + cost + " per month"
		$("#utils-list").append($("<li>").text(listStr));
		
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
		
		resultTable.append("<caption>Utilities ($/mo)</caption>");
		
		//Create headers
		var tableRow = $("<tr>");
		tableRow.append("<th>Utility</th>");
		for(i=0; i<utilNames.length; ++i){
			tableRow.append($("<th>").text(utilNames[i]));
		}
		resultTable.append(tableRow);
		
		//Fill table
		for(j=0; j<utilTypes.length; ++j){
			tableRow = $("<tr>");
			var utilIcon = getUtilIcon(utilTypes[j]);
			tableRow.append($("<th>").text(" " + utilTypes[j]).prepend(utilIcon));
			for(k=0; k<utilNames.length; ++k){
				tableRow.append($("<td>").text(utilResults[k][j]));
			}
			resultTable.append(tableRow);
		}
		
		$("#util-result").fadeIn(500);
	});
	
	/*Reset entire form*/
	$("#reset-util").click(function(){
		//Disable buttons
		$("#reset-util, #submit-util, #add-util-btn").prop("disabled", true);
		
		//Reset vars (utilNames gets reset automatically by button)
		utilsValid = false;
		chxValid = true;
		utilTypes = [];
		utilResults = [];
		
		//Reset elements
		$("#util-types-col").slideUp(500);
		$("#checkbox-div").empty();
		$("#util-type, #util-cost, #util-rms").val("");
		$("#utils-list").empty();
		$("#utils-container").find(".input-col-border").css("border-left", "5px solid gray");
		$("#util-rms").prop("disabled", false);	
		
		$("#util-result").fadeOut(500);
	});
	
/*?*/
	$(".x").hover(function(){
		$(".non-code").toggle();
		$(".code").toggle();
	});
};

/*
Returns total number of sqft to consider
Input: array of numbers representing each roommate's claimed space
Output: sum total of everyone's claimed space
*/
function calcTotalSqft(sqfts){
	var totalSqft = 0;
	for(i=0; i<sqfts.length; ++i){
		totalSqft += sqfts[i];
	}
	
	return totalSqft;
};

/*
Returns a jQuery span object containing a glyphicon related to the utility.
Ex: "water" returns a blue drop icon
Input: string with utility name
Output: relevant glyphicon in a span object.  If no icon matches, an
empty <span> is returned
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

	
	return $("<span class='glyphicon glyphicon-ok-circle' style='color:#d9d9d9'></span>"); //Default
}

/*Let's go!*/
$(document).ready(main);
