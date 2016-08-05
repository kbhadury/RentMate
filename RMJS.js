var main = function(){	
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
	
	/*Determine if the Submit and Reset buttons should be active*/
	var rentValid = false;
	var rmmtValid = false;
	
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
	$("#name, #sqft").keyup(function(){
		if($("#name").val().length == 0 || $("#sqft").val() < 1){
			$("#name-sqft-btn").prop("disabled", true);
		} else {
			$("#name-sqft-btn").prop("disabled", false);
		}
	});
	
	/*Add info to arrays and display on page
	  Also adds a green stripe next to list*/
	var nameList = [];
	var sqftList = [];
	$("#name-sqft-btn").click(function(){
		var name = $("#name").val();
		var sqft = parseFloat($("#sqft").val());
		
		//Display on page
		var entryStr = name + ", " + sqft + " sq. ft.";
		var entry = $("<li>").text(entryStr);
		entry.appendTo("#rmmt-list");
		
		//Add to arrays
		nameList.push(name);
		sqftList.push(sqft);
		
		//Add green stripe
		$("#name-sqft-col").css("border-left", "5px solid #00cc00");
		
		//Reset form
		$("#name-sqft-btn").prop("disabled", true);
		$("#name, #sqft").val("");
		
		//Check to see if Submit should be enabled
		rmmtValid = true;
		if(rentValid){
			$("#submit-rent").prop("disabled", false);
		}
		
		//Enable reset button
		$("#reset-rent").prop("disabled", false);
		
		//Give the "name" field focus
		$("#name").focus();
	});
	
	/*Perform calculations and display results*/
	$("#submit-rent").click(function(){
		//Deactivate submit button
		$(this).prop("disabled",true);
		
		//Remove existing results from HTML
		//but keep the array data
		$("#rent-result").empty();
		
		//Calculate and display results
		var resultListObj = $("#rent-result");
		var totalSqft = calcTotalSqft(sqftList);
		var rent = $("#rent-amt").val();
		
		resultListObj.append("<h4>Rent:</h4>");
		for(i=0; i<sqftList.length; ++i){
			var amt = parseFloat((sqftList[i]/totalSqft) * rent).toFixed(2);
			var item = $("<h4>").text(nameList[i] + ": $" + amt + " per month");
			item.appendTo(resultListObj);
		}
		
		$("#rent-result").fadeIn(500);
	});
	
	$("#reset-rent").click(function(){
		//Reset vars
		rentValid = false;
		rmmtValid = false;
		nameList = [];
		sqftList = [];
		
		//Reset elements
		$("#reset-rent, #submit-rent, #name-sqft-btn").prop("disabled", true);
		$("#rmmt-list").empty();
		$("#rent-amt, #name, #sqft").val("");
		$(".input-col-border").css("border-left","5px solid gray");
		$("#rent-result").hide();
	});
	
	/*?*/
	$(".code").hide();
	$(".code-click").click(function(){
		$(".code").toggle();
		$(".non-code").toggle();
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
