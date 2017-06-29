var backstampCSV, bsImageArray,yearArray, $yearContainer, years, currentYear, filter;
bsImageArray = [["Year","Filename","Description","Type"],["1985","1985_sponge","Spongeware","S"],["1986","1986-1989_sponge","Spongeware","S"],["1987","1986-1989_sponge","Spongeware","S"],["1988","1986-1989_sponge","Spongeware","S"],["1989","1986-1989_sponge","Spongeware","S"],["1990","1990_sponge","Spongeware","S"],["1991","1991_sponge","Spongeware","S"],["1992","1992_sponge","Spongeware","S"],["1993","1993_sponge","Spongeware","S"],["1994","1994_sponge","Spongeware","S"],["1995","1995_sponge","Spongeware","S"],["1996","1996_sponge","Spongeware","S"],["1997","1997_sponge","Spongeware","S"],["1998","1998_countryliving","Country Living Anniversary","X"],["1998","1998_sponge","Spongeware","S"],["1999","1999_sponge","Spongeware","S"],["2000","2000_sponge","Spongeware","S"],["2001","2001_sponge","Spongeware","S"],["2002","2002_lovekisses","Love & Kisses","L"],["2002","2002_sponge1","Spongeware","S"],["2002","2002_sponge2","Spongeware","S"],["2003","2003_circus","Circus","L"],["2003","2003_menatwork","Men at Work","L"],["2003","2003_toys","Toys","L"],["2003","2003_sponge","Spongeware","S"],["2004","2004_catsdogs","Cats & Dogs","L"],["2004","2004_starrytoast","Starry Toast","L"],["2004","2004_sponge","Spongeware","S"],["2005","2005_sponge","Spongeware","S"],["2006","2006_sponge1","Spongeware","S"],["2006","2006_sponge2","Spongeware","S"],["2006","2006_sponge4","Spongeware","S"],["2007","2007_birds","Birds","L"],["2007","2007_sponge","Spongeware","S"],["2008","2008_sponge","Spongeware","S"],["2009","2009_gymkhana","Gymkhana","X"],["2009","2009_whitetoast","White Toast","L"],["2009","2009_sponge","Spongeware","S"],["2010","2010_hfh","Help for Heroes","X"],["2010","2010_sponge1","Spongeware","S"],["2010","2010_sponge2","Spongeware Cookware","S"],["2011","2011_willkate","William and Kate's Marriage","L"],["2011","2011_sponge1","Spongeware","S"],["2011","2011_sponge2","Kitchenware","S"],["2011","2011_sponge7","Spongeware","S"],["2012","2012_60years","60 Years a Queen","L"],["2012","2012_sponge1","Spongeware","S"],["2012","2012_sponge3","Spongeware","S"],["2013","2013_coronation","60th Coronation Anniversary","L"],["2013","2013_skyline","Skyline","L"],["2013","2013_sponge1","Spongeware","S"],["2013","2013_sponge4","Spongeware","S"],["2014","2014_dogs","Dogs","L"],["2014","2014_williamson","Williamson Tea","X"],["2014","2014_yitc","Year in the Country","L"],["2014","2014_sponge1","Spongeware","S"],["2014","2014_sponge4","Spongeware","S"],["2015","2015_blackdresser","Black Dresser","L"],["2015","2015_fox","Fox and Leaves","L"],["2015","2015_partridge","Partridge","L"],["2015","2015_tam","Toast & Marmalade","L"],["2015","2015_sponge1","Spongeware","S"],["2016","2016_birds","Birds","L"],["2016","2016_chickens","Lots of Chickens","L"],["2016","2016_crab","Crab","L"],["2016","2016_dogs","Dogs","L"],["2016","2016_flowers","Flowers","L"],["2016","2016_gamebirds","Game Birds","L"],["2016","2016_owls","Owls","L"],["2016","2016_owls1","Owls","L"],["2016","2016_RHS","Chelsea Flower Show","X"],["2016","2016_3kings","Three Kings","L"],["2016","2016_beardedtit","Bearded Tit","L"],["2016","2016_sponge1","Spongeware","S"],["2017","2017_sponge","Spongeware","S"]];
yearArray = [];
$yearContainer = $("#yearContainer");

$(document).ready(function(){
	initialiseBSApp();
});

$(window).resize(function(){
	reloadGrid();
});

function initialiseBSApp(){
	bsImageArray = sortArray(bsImageArray);
	years = countYears(bsImageArray);
	createGrid();
	loadOptions();
	$("button[data-filterType='S']").click();
	addDetailContainers();
	navigateCells();
	IERefresh();
}

// return input sorted with S first, L middle and X last - input array must be ordered by year
function sortArray(arrayToSort) {
	currentYear = arrayToSort[0][0];
	var sortedArray = [];
	var sLocation = -1;
	var lLocation = 0;
	var i=0;
	while (i<arrayToSort.length){
		if(arrayToSort[i][0]==currentYear){
			if (arrayToSort[i][3] === "S") {
				sortedArray.splice(sLocation+1,0,arrayToSort[i]);
				sLocation++;
				lLocation++;
			} else if (arrayToSort[i][3] === "L") {
				sortedArray.splice(lLocation,0,arrayToSort[i]);
				lLocation++;
			} else {
				sortedArray.splice(lLocation+10,0,arrayToSort[i]);
			}
			i++;
		} else { // updates currentYear and S/L locations if current array record is in a later year, then runs sorting again on the record
			currentYear = arrayToSort[i][0];
			sLocation = i-1;
			lLocation = i;
		}
	}
	return sortedArray;
}

// return number of unique years in array
function countYears(arrayToCount) {
	return arrayToCount[arrayToCount.length-1][0] - arrayToCount[1][0] + 1;
}

function createGrid(){
	//creates yearCells and stores in array
	for (i = 0; i < years; i++) {
		var $newYearCell = $("<li />")
		.addClass("gridCell yearCell visYearCell")
		.append(
			$("<text />")
			.html(1985+i+"<i class='icon-right-marker icon-large'></i>")
			.addClass("yearNum centreCell")
			);
		yearArray.push($newYearCell);

		currentYear = 1985+i;
		var currentYearBsArray = [];

		// !!! can this be optimised? e.g. set new start point from array, exit when new year
		for (j = 0; j < bsImageArray.length; j++) { // puts all relevant images into current year backstamp array
			(bsImageArray[j][0] == currentYear) ? currentYearBsArray.push(bsImageArray[j]) : null;
		}

		currentYearBsArray.forEach(function(bsCell){
			var $newImgCell = $("<li />")
			.addClass("gridCell imgCell")
			.attr({
				"data-display": 1,
				"data-img": bsCell[1],
				"data-bsType": bsCell[3],
				"data-desc": bsCell[2]
			})
			.append(
				$("<img />")
				.addClass("bsImg")
				.attr({
					src: "https://www.emmabridgewater.co.uk/content/ebiz/eb/images/backstamps/s/"+bsCell[1]+"_s.jpg",
					alt: bsCell[2]
				})
				);
			$newYearCell.push($newImgCell); // adds image cell to array with current year window at the start
		});
	}

	yearArray.forEach(function(year){
		$yearContainer.append(year[0]); // adds first year window and then images after
		for (j = 1; j < year.length; j++) { // scans through images in that year
			$yearContainer.append(year[j]); // adds first year window and then images after
			year[j].click(clickImg(year[j]));
		}
	})
	$yearContainer.after($("<div id = 'detailHeight'></div>")); // allows us to get height of detailContainerE
}

// show/hide imgCells of selected year based on filter
function loadImgs(yearToDisplay) {
	$firstWindow = $(yearToDisplay[0]);
	$firstWindow.children().html($firstWindow.children().html().substring(0,4));
	var validImages = 0;

	for (j = 1; j < yearToDisplay.length; j++) {
		$imgDisplay = yearToDisplay[j];
		if($imgDisplay.attr("data-display") == 1) { // if filter is set to show the filtered backstamp type, proceed
			$imgDisplay.show();
			validImages++;
		}
	}

	if (validImages === 0) {
		$firstWindow.removeClass("visYearCell");
	} else {
		$firstWindow.addClass("visYearCell");
		$firstWindow.children().html($firstWindow.children().html()+"<i class='icon-right-marker icon-large'></i>");
	}
}

// show/hide detailContainer with content for the img
function clickImg(img){
	return function(){
		// find next detailContainer
		var $nextDetailContainer = $(this).nextAll(".detailContainer").first();

		if($(this).children().hasClass("activeBsImg")) {
			// if clicking on currently selected cell
			hideDetails();
		} else {
			var prevBsImgTop = $(".activeBsImg")[0] ? $(".activeBsImg").offset().top :  null;
			hideDetails();

			// create content for detailContainer
			$bsImgDetail = $("<div />")
			.addClass("bsImgDetail")
			.append(
				$("<img>")
				.attr("src","https://www.emmabridgewater.co.uk/content/ebiz/eb/images/backstamps/"+$(this).attr("data-img")+".jpg")
			)

			$bsDataDetail = $("<div />")
			.addClass("bsDataDetail")
			.append(
				$("<div />")
				.addClass("bsYear")
				.html($(this).attr("data-img").substring(0,4))
				)
			.append(
				$("<div />")
				.addClass("bsName")
				.html($(this).attr("data-desc"))
				)

			// expand next detailContainer and append content
			$(this).nextAll(".detailContainer").first().addClass("detailContainerE")
			.append(addNavigation())
			.append($bsDataDetail.hide().fadeIn(200))
			.append($bsImgDetail.hide().fadeIn(200));

			if ($(window).width() < 600) {
				$bsImgDetail.insertBefore($bsDataDetail);
			}

			$(this).children().addClass("activeBsImg");

			// scroll to top of selected cell
			var currentBsImgTop = $(".activeBsImg").offset().top-8;
			var scrollPoint = (prevBsImgTop > currentBsImgTop || prevBsImgTop === null) ? currentBsImgTop : currentBsImgTop - $("#detailHeight").height();
			$('html, body').clearQueue().animate({scrollTop: scrollPoint}, 200, 'swing');
		}
	}
}

function addNavigation(){
	$newNav = $("<div />")
		.addClass("detailNav")
		.append(
			$("<span />")
			.addClass("detailBtn detailBtnNav")
			.html("<i class='icon-left-marker icon-large'></i>")
			.click(function(){navigateCells("L")})
			)
		.append(
			$("<span />")
			.addClass("detailBtn detailBtnNav")
			.html("<i class='icon-right-marker icon-large'></i>")
			.click(function(){navigateCells("R")})
			)
		.append(
			$("<span />")
			.addClass("detailBtn detailBtnClose")
			.html("<i class='icon-close icon-large'></i>")
			.click(hideDetails)
			)
	return $newNav;
}

// load detailContainers and spacerCells
function addDetailContainers(){
	$(".detailContainer").remove();
	$(".spacerCell").parent().remove();

	$(".activeBsImg").removeClass("activeBsImg");
	$gridCells = $(".gridCell");
	for(i=0; i<$gridCells.length; i++) {
		var $currentCell = $($gridCells[i]);
		if($yearContainer.offset().left+$yearContainer.width()-$currentCell.offset().left-$currentCell.width() < 30 || i === $gridCells.length-1){
			if($currentCell.hasClass("visYearCell")) {
				$currentCell.before(
					$currentCell = $("<div />")
					.addClass("gridCell")
					.append(
						$("<div />")
						.addClass("spacerCell centreCell")
						)
					)
			}
			$currentCell.after(
				$("<div />")
				.addClass("detailContainer")
				)
		}
	}
	// square cells
	$(".gridCell").height($(".gridCell").width());
}

// hides expanded detailContainer and un-highlights active img
function hideDetails(){
	$(".detailContainerE").removeClass("detailContainerE").empty();
	$(".activeBsImg").removeClass("activeBsImg");
}

// selects next or previous imgCell based on input "L" or "R"
function navigateCells(direction){
	var $parentCell = $(".activeBsImg").parent();
	(direction === "L") ? $parentCell.prevAll(".imgCell:visible").first().click() : $parentCell.nextAll(".imgCell:visible").first().click();
}

function loadOptions(){
	$(".filterOption").click(function(){
		$selectedFilter = $(this);

		if ($selectedFilter.hasClass("filterActive")) { // if active filter button has been clicked on, remove filters
			filter = null;
			$selectedFilter.removeClass("filterActive");
			$("#viewAllButton").addClass("filterActive");
		} else { // checks which filter button has been clicked on
			filter = $selectedFilter.attr("data-filterType"); 
			$(".filterActive").removeClass("filterActive");
			$selectedFilter.addClass("filterActive");
		}

		// fades out yearContainer while cells are shown/hidden
		$("#yearContainer").css("opacity",0).delay(110).queue(function(next){
			if (filter) { // if a filter has been selected, checks if imgCell matches the filter type; displays cell if so, hides cell if not
				$(".imgCell[data-bsType="+filter+"]").attr("data-display",1);
				$(".imgCell[data-bsType!="+filter+"]").hide().attr("data-display",0);
			} else { // if view all clicked, set all cells to be displayed
				$(".imgCell").attr("data-display",1);
			}
			reloadGrid();
			$("#yearContainer").css("opacity",1);
			next();
		});
	})

	$(document).keydown(function(key){
		if(key.which == 37) {
			navigateCells("L");
		} else if (key.which == 39) {
			navigateCells("R");
		}
	})
}

function reloadGrid(){
	yearArray.forEach(function(year){ loadImgs(year) });
	addDetailContainers();
	$(".spacerCell").css("padding",0);
}

function IERefresh(){ // Re-draws yearCells in IE to fix alignment issues
	(navigator.appVersion.indexOf("MSIE") > 0 || navigator.appVersion.indexOf("Trident") > 0) ? reloadGrid(): false;
}