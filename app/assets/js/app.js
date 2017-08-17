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

// create cell__years and cell__images and append to gridContainer
function createGrid() {
	for (var i = 0; i < years; i++) {
		var $newYearCell = $("<li />")
			.addClass("cell cell__year cell__year--visible")
			.append(
				$("<text />")
					.html(
						1985 +
							i +
							"<i class='icon-right-marker icon-large'></i>"
					)
					.addClass("cell__year__number cell--center")
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
			var $newcell__image = $("<li />")
				.addClass("cell cell__image")
				.attr({
					"data-display": 1,
					"data-img": bsCell.filename,
					"data-bsType": bsCell.type,
					"data-desc": bsCell.description
				})
				.append(
					$("<img />").addClass("backstamp").attr({
						src:
							liveImgPrefix +
							"images/backstamps/s/" +
							bsCell.filename +
							"_s.jpg",
						alt: bsCell.description
					})
				)
			$newYearCell.push($newcell__image) // adds image cell to array with current year window at the start
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
	$gridContainer.after($("<div id = 'detailHeight'></div>")) // allows us to get height of detail__container--expanded
}

// load detail__containers and cell__spacers
function addDetailContainers() {
	$(".detail__container").remove()
	$(".cell__spacer").parent().remove()

	$(".backstamp--active").removeClass("backstamp--active")
	var $cells = $(".cell")
	for (var i = 0; i < $cells.length; i++) {
		var $currentCell = $($cells[i])
		if (
			$gridContainer.offset().left +
				$gridContainer.width() -
				$currentCell.offset().left -
				$currentCell.width() <
				30 ||
			i === $cells.length - 1
		) {
			if ($currentCell.hasClass("cell__year--visible")) {
				$currentCell.before(
					($currentCell = $("<div />")
						.addClass("cell")
						.append($("<div />").addClass("cell__spacer cell--center")))
				)
			}
			$currentCell.after($("<div />").addClass("detail__container"))
		}
	}
	// square cells
	$(".cell").height($(".cell").width())
}

// select next or previous cell__image based on input "L" or "R"
function navigateCells(direction) {
	var $parentCell = $(".backstamp--active").parent()
	direction === "L"
		? $parentCell.prevAll(".cell__image:visible").first().click()
		: $parentCell.nextAll(".cell__image:visible").first().click()
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
	$(".filter__option").click(function() {
		var $selectedFilter = $(this)

		if ($selectedFilter.hasClass("filter--active")) {
			// if active filter button has been clicked on, remove filters
			filter = null
			$selectedFilter.removeClass("filter--active")
			$("#viewAllButton").addClass("filter--active")
		} else {
			// checks which filter button has been clicked on
			filter = $selectedFilter.attr("data-filterType")
			$(".filter--active").removeClass("filter--active")
			$selectedFilter.addClass("filter--active")
		}

		// fades out gridContainer while cells are shown/hidden
		$gridContainer.css("opacity", 0).delay(110).queue(function(next) {
			if (filter) {
				// if a filter has been selected, checks if cell__image matches the filter type; displays cell if so, hides cell if not
				$(".cell__image[data-bsType=" + filter + "]").attr(
					"data-display",
					1
				)
				$(".cell__image[data-bsType!=" + filter + "]")
					.hide()
					.attr("data-display", 0)
			} else {
				// if view all clicked, set all cells to be displayed
				$(".cell__image").attr("data-display", 1)
			}
			reloadGrid()
			$gridContainer.css("opacity", 1)
			next()
		})
	})
}

// show/hide cell__images of selected year based on filter
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
		$firstWindow.removeClass("cell__year--visible")
	} else {
		$firstWindow.addClass("cell__year--visible")
		$firstWindow
			.children()
			.html(
				$firstWindow.children().html() +
					"&#9658;"
			)
	}
}

// show/hide detail__container with content for the img
function clickImg(img) {
	return function() {
		// find next detail__container
		var $nextDetailContainer = $(this).nextAll(".detail__container").first()

		if ($(this).children().hasClass("backstamp--active")) {
			// if clicking on currently selected cell
			hideDetails()
		} else {
			var prevBsImgTop = $(".backstamp--active")[0]
				? $(".backstamp--active").offset().top
				: null
			hideDetails()

			// create content for detail__container
			var $bsImgDetail = $("<div />")
				.addClass("detail__image")
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
				.addClass("detail__data")
				.append(
					$("<div />")
						.addClass("detail__data__year")
						.html($(this).attr("data-img").substring(0, 4))
				)
				.append(
					$("<div />")
						.addClass("detail__data__name")
						.html($(this).attr("data-desc"))
				)

			// expand next detail__container and append content
			$(this)
				.nextAll(".detail__container")
				.first()
				.addClass("detail__container--expanded")
				.append(addNavigation())
				.append($bsDataDetail.hide().fadeIn(200))
				.append($bsImgDetail.hide().fadeIn(200))

			// re-arrange details for mobile screens
			if ($(window).width() < 600)
				$bsImgDetail.insertBefore($bsDataDetail)

			$(this).children().addClass("backstamp--active")

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

// hide expanded detail__container and un-highlights active img
function hideDetails() {
	$(".detail__container--expanded").removeClass("detail__container--expanded").empty()
	$(".backstamp--active").removeClass("backstamp--active")
}

// add navigation buttons to detail__container
function addNavigation() {
	var $newNav = $("<div />")
		.addClass("detail__nav")
		.append(
			$("<span />")
				.addClass("detail__button detail__button__nav")
				.html("<i class='icon-left-marker icon-large'>L</i>")
				.click(function() {
					navigateCells("L")
				})
		)
		.append(
			$("<span />")
				.addClass("detail__button detail__button__nav")
				.html("<i class='icon-right-marker icon-large'>R</i>")
				.click(function() {
					navigateCells("R")
				})
		)
		.append(
			$("<span />")
				.addClass("detail__button detail__button__close")
				.html("<i class='icon-close icon-large'>X</i>")
				.click(hideDetails)
		)
	return $newNav
}

// re-draw cells and detail__containers
function reloadGrid() {
	yearArray.forEach(function(year) {
		loadImgs(year)
	})
	addDetailContainers()
	$(".cell__spacer").css("padding", 0)
}

// Re-draw cell__years in IE to fix alignment issues
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
