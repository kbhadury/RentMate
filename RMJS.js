var main = function(){	
/* MAIN PAGE */
	/*Carousel on the main page*/
	$(".tech-slide").click(function(){
		//Photos
		var currentSlide = $(".tech-slide-active");
		var nextSlide = currentSlide.next(".tech-slide");
		if(nextSlide.length == 0){ //Loop around
			nextSlide = $(".tech-slide").first();
		}
		currentSlide.removeClass("tech-slide-active");
		nextSlide.addClass("tech-slide-active");
		
		//Bullet icons
		var currentBullet = $(".tech-bullet-active");
		var nextBullet = currentBullet.next(".tech-bullet");
		if(nextBullet.length == 0){
			nextBullet = $(".tech-bullet").first();
		}
		currentBullet.removeClass("tech-bullet-active");
		nextBullet.addClass("tech-bullet-active");
	});
	
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
		
		var resultListObj = $("#rent-result");
		
		//Remove existing results from HTML but keep the array data
		resultListObj.empty();
		
		//Calculate and display results
		var totalSqft = calcTotalSqft(sqftList);
		var rent = $("#rent-amt").val();
		
		//Generate result text
		resultListObj.append("<h4>Rent:</h4>");
		for(i=0; i<sqftList.length; ++i){
			var amt = parseFloat((sqftList[i]/totalSqft) * rent).toFixed(2);
			var item = $("<h4>").text(rentNames[i] + ": $" + amt + " per month");
			item.appendTo(resultListObj);
		}
		
		resultListObj.fadeIn(500);
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
		tableRow.append("<th>Person</th>");
		for(i=0; i<utilTypes.length; ++i){
			tableRow.append($("<th>").text(utilTypes[i]));
		}
		resultTable.append(tableRow);
		
		//Fill table
		for(j=0; j<utilNames.length; ++j){
			tableRow = $("<tr>");
			tableRow.append($("<td>").text(utilNames[j]));
			for(k=0; k<utilTypes.length; ++k){
				tableRow.append($("<td>").text(utilResults[j][k]));
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
	$(".code-click").hover(function(){
		$(".non-code").toggle();
		$(".code").toggle();
	});
};

/*Returns total number of sqft to consider*/
function calcTotalSqft(sqfts){
	var totalSqft = 0;
	for(i=0; i<sqfts.length; ++i){
		totalSqft += sqfts[i];
	}
	
	return totalSqft;
};

/*Let's go!*/
$(document).ready(main);
