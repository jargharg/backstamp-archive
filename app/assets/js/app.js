import { bsData } from "./modules/BsData"

var $gridContainer = $("#gridContainer")
var liveImgPrefix =
	window.location.href.indexOf("emmabridgewater.co.uk") != -1
		? "https://www.emmabridgewater.co.uk/content/ebiz/eb/"
		: ""
var bsImageArray
var yearArray = []
var years
var currentYear
var filter

// return input sorted with S first, L middle and X last - input array must be ordered by year
function sortArray(arrayToSort) {
	currentYear = arrayToSort[0].year
	var sortedArray = []
	var sLocation = -1
	var lLocation = 0
	var i = 0

	while (i < arrayToSort.length) {
		if (arrayToSort[i].year === currentYear) {
			if (arrayToSort[i].type === "S") {
				sortedArray.splice(sLocation + 1, 0, arrayToSort[i])
				sLocation++
				lLocation++
			} else if (arrayToSort[i].type === "L") {
				sortedArray.splice(lLocation, 0, arrayToSort[i])
				lLocation++
			} else {
				sortedArray.splice(lLocation + 10, 0, arrayToSort[i])
			}
			i++
		} else {
			// updates currentYear and S/L locations if current array record is in a later year, then runs sorting again on the record
			currentYear = arrayToSort[i].year
			sLocation = i - 1
			lLocation = i
		}
	}
	return sortedArray
}

// return number of unique years in array
function countYears(arrayToCount) {
	return arrayToCount[arrayToCount.length - 1].year - arrayToCount[0].year + 1
}

// create yearCells and imgCells and append to gridContainer
function createGrid() {
	for (var i = 0; i < years; i++) {
		var $newYearCell = $("<li />")
			.addClass("gridCell yearCell visYearCell")
			.append(
				$("<text />")
					.html(
						1985 +
							i +
							"<i class='icon-right-marker icon-large'></i>"
					)
					.addClass("yearNum centreCell")
			)
		yearArray.push($newYearCell)

		currentYear = 1985 + i
		var currentYearBsArray = []

		// !!! can this be optimised? e.g. set new start point from array, exit when new year
		for (var j = 0; j < bsImageArray.length; j++) {
			// puts all relevant images into current year backstamp array
			if (bsImageArray[j].year == currentYear)
				currentYearBsArray.push(bsImageArray[j])
		}

		currentYearBsArray.forEach(function(bsCell) {
			var $newImgCell = $("<li />")
				.addClass("gridCell imgCell")
				.attr({
					"data-display": 1,
					"data-img": bsCell.filename,
					"data-bsType": bsCell.type,
					"data-desc": bsCell.description
				})
				.append(
					$("<img />").addClass("bsImg").attr({
						src:
							liveImgPrefix +
							"images/backstamps/s/" +
							bsCell.filename +
							"_s.jpg",
						alt: bsCell.description
					})
				)
			$newYearCell.push($newImgCell) // adds image cell to array with current year window at the start
		})
	}

	yearArray.forEach(function(year) {
		$gridContainer.append(year[0]) // adds first year window and then images after
		for (var j = 1; j < year.length; j++) {
			// scans through images in that year
			$gridContainer.append(year[j]) // adds first year window and then images after
			year[j].click(clickImg(year[j]))
		}
	})
	$gridContainer.after($("<div id = 'detailHeight'></div>")) // allows us to get height of detailContainerE
}

// load detailContainers and spacerCells
function addDetailContainers() {
	$(".detailContainer").remove()
	$(".spacerCell").parent().remove()

	$(".activeBsImg").removeClass("activeBsImg")
	var $gridCells = $(".gridCell")
	for (var i = 0; i < $gridCells.length; i++) {
		var $currentCell = $($gridCells[i])
		if (
			$gridContainer.offset().left +
				$gridContainer.width() -
				$currentCell.offset().left -
				$currentCell.width() <
				30 ||
			i === $gridCells.length - 1
		) {
			if ($currentCell.hasClass("visYearCell")) {
				$currentCell.before(
					($currentCell = $("<div />")
						.addClass("gridCell")
						.append($("<div />").addClass("spacerCell centreCell")))
				)
			}
			$currentCell.after($("<div />").addClass("detailContainer"))
		}
	}
	// square cells
	$(".gridCell").height($(".gridCell").width())
}

// select next or previous imgCell based on input "L" or "R"
function navigateCells(direction) {
	var $parentCell = $(".activeBsImg").parent()
	direction === "L"
		? $parentCell.prevAll(".imgCell:visible").first().click()
		: $parentCell.nextAll(".imgCell:visible").first().click()
}

// navigate cells using arrow keys
function addKBNavigation() {
	$(document).keydown(function(key) {
		if (key.which == 37) {
			navigateCells("L")
		} else if (key.which == 39) {
			navigateCells("R")
		}
	})
}

// handle use of top filters
function loadOptions() {
	$(".filterOption").click(function() {
		var $selectedFilter = $(this)

		if ($selectedFilter.hasClass("filterActive")) {
			// if active filter button has been clicked on, remove filters
			filter = null
			$selectedFilter.removeClass("filterActive")
			$("#viewAllButton").addClass("filterActive")
		} else {
			// checks which filter button has been clicked on
			filter = $selectedFilter.attr("data-filterType")
			$(".filterActive").removeClass("filterActive")
			$selectedFilter.addClass("filterActive")
		}

		// fades out gridContainer while cells are shown/hidden
		$gridContainer.css("opacity", 0).delay(110).queue(function(next) {
			if (filter) {
				// if a filter has been selected, checks if imgCell matches the filter type; displays cell if so, hides cell if not
				$(".imgCell[data-bsType=" + filter + "]").attr(
					"data-display",
					1
				)
				$(".imgCell[data-bsType!=" + filter + "]")
					.hide()
					.attr("data-display", 0)
			} else {
				// if view all clicked, set all cells to be displayed
				$(".imgCell").attr("data-display", 1)
			}
			reloadGrid()
			$gridContainer.css("opacity", 1)
			next()
		})
	})
}

// show/hide imgCells of selected year based on filter
function loadImgs(yearToDisplay) {
	var $firstWindow = $(yearToDisplay[0])
	$firstWindow.children().html($firstWindow.children().html().substring(0, 4))
	var validImages = 0

	for (var j = 1; j < yearToDisplay.length; j++) {
		var $imgDisplay = yearToDisplay[j]
		if ($imgDisplay.attr("data-display") == 1) {
			// if filter is set to show the filtered backstamp type, proceed
			$imgDisplay.show()
			validImages++
		}
	}

	if (validImages === 0) {
		$firstWindow.removeClass("visYearCell")
	} else {
		$firstWindow.addClass("visYearCell")
		$firstWindow
			.children()
			.html(
				$firstWindow.children().html() +
					"&#9658;"
			)
	}
}

// show/hide detailContainer with content for the img
function clickImg(img) {
	return function() {
		// find next detailContainer
		var $nextDetailContainer = $(this).nextAll(".detailContainer").first()

		if ($(this).children().hasClass("activeBsImg")) {
			// if clicking on currently selected cell
			hideDetails()
		} else {
			var prevBsImgTop = $(".activeBsImg")[0]
				? $(".activeBsImg").offset().top
				: null
			hideDetails()

			// create content for detailContainer
			var $bsImgDetail = $("<div />")
				.addClass("bsImgDetail")
				.append(
					$("<img>").attr(
						"src",
						liveImgPrefix +
							"images/backstamps/" +
							$(this).attr("data-img") +
							".jpg"
					)
				)

			var $bsDataDetail = $("<div />")
				.addClass("bsDataDetail")
				.append(
					$("<div />")
						.addClass("bsYear")
						.html($(this).attr("data-img").substring(0, 4))
				)
				.append(
					$("<div />")
						.addClass("bsName")
						.html($(this).attr("data-desc"))
				)

			// expand next detailContainer and append content
			$(this)
				.nextAll(".detailContainer")
				.first()
				.addClass("detailContainerE")
				.append(addNavigation())
				.append($bsDataDetail.hide().fadeIn(200))
				.append($bsImgDetail.hide().fadeIn(200))

			// re-arrange details for mobile screens
			if ($(window).width() < 600)
				$bsImgDetail.insertBefore($bsDataDetail)

			$(this).children().addClass("activeBsImg")

			// scroll to top of selected cell
			var currentBsImgTop = $(this).children().offset().top - 8
			var scrollPoint =
				prevBsImgTop > currentBsImgTop || prevBsImgTop === null
					? currentBsImgTop
					: currentBsImgTop - $("#detailHeight").height()
			$("html, body")
				.clearQueue()
				.animate({ scrollTop: scrollPoint }, 200, "swing")
		}
	}
}

// hide expanded detailContainer and un-highlights active img
function hideDetails() {
	$(".detailContainerE").removeClass("detailContainerE").empty()
	$(".activeBsImg").removeClass("activeBsImg")
}

// add navigation buttons to detailContainer
function addNavigation() {
	var $newNav = $("<div />")
		.addClass("detailNav")
		.append(
			$("<span />")
				.addClass("detailBtn detailBtnNav")
				.html("<i class='icon-left-marker icon-large'></i>")
				.click(function() {
					navigateCells("L")
				})
		)
		.append(
			$("<span />")
				.addClass("detailBtn detailBtnNav")
				.html("<i class='icon-right-marker icon-large'></i>")
				.click(function() {
					navigateCells("R")
				})
		)
		.append(
			$("<span />")
				.addClass("detailBtn detailBtnClose")
				.html("<i class='icon-close icon-large'></i>")
				.click(hideDetails)
		)
	return $newNav
}

// re-draw cells and detailContainers
function reloadGrid() {
	yearArray.forEach(function(year) {
		loadImgs(year)
	})
	addDetailContainers()
	$(".spacerCell").css("padding", 0)
}

// Re-draw yearCells in IE to fix alignment issues
function IERefresh() {
	if (
		navigator.appVersion.indexOf("MSIE") > 0 ||
		navigator.appVersion.indexOf("Trident") > 0
	)
		reloadGrid()
}

function initialiseBSApp() {
	bsImageArray = sortArray(bsData)
	years = countYears(bsData)
	createGrid()
	loadOptions()
	$("button[data-filterType='S']").click()
	addDetailContainers()
	addKBNavigation()
	navigateCells()
	IERefresh()
}

$(document).ready(function() {
	initialiseBSApp()
})

$(window).resize(function() {
	reloadGrid()
})
