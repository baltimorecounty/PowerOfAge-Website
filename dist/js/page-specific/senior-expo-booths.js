'use strict';

namespacer('seniorExpo.pageSpecific');

seniorExpo.pageSpecific.seniorExpoBooths = function ($, undefined) {

	var

	/**
  * Load everything up and display the SVG.
  */
	display = function display(svgFilePath, width, height) {
		if (!Snap) {
			console.log('"Snap" library not loaded.');
			return;
		}

		Snap.load(svgFilePath, function (fragment) {
			snapLoadHandler(fragment, width, height);
		});
	},


	/**
  * Load up the SVG, highlight the booths, and attach the click handler
  */
	snapLoadHandler = function snapLoadHandler(fragment, width, height) {
		var snap = Snap(width, height),
		    parentElement = snap.append(fragment),
		    $parentElement = $(parentElement.node),
		    booths = parentElement.selectAll('svg > g > g');

		$.ajax('http://ba224964:1000/api/aging-expo/booth-assignments').done(function (boothAssigmentData) {
			var extractedBoothAssigmentData = extractDataFromHtml(boothAssigmentData);

			highlightAssignedBooths(extractedBoothAssigmentData, booths, function (snapElement, boothData) {
				snapElement.click(function (clickEvent) {
					svgElementClickHandler(clickEvent, boothData);
				});
			});
		});
	},


	/**
  * Extract data from the HTML table 
  */
	extractDataFromHtml = function extractDataFromHtml(htmlData) {
		var htmlArray = Array.prototype.slice.call($(htmlData)),
		    data = [];

		var $tableRows = void 0;

		for (var i = 0; i < htmlArray.length; i++) {
			if (htmlArray[i].id === "SEContentResults") {
				$tableRows = $(htmlArray[i]).find('tbody tr');
				break;
			}
		}
		console.log($tableRows);
		$.each($tableRows, function (index, row) {
			var $cols = $(row).find('td'),
			    rowData = {
				id: $cols.eq(0).text(),
				name: $cols.eq(1).text(),
				description: $cols.eq(2).text()
			};

			data.push(rowData);
		});

		return data;
	},


	/**
  * Highlight all of the booths indicated on the HTML page
  */
	highlightAssignedBooths = function highlightAssignedBooths(boothAssigmentData, booths, callback) {
		var assignedBoothIds = [];

		$.each(boothAssigmentData, function (index, boothDataItem) {
			assignedBoothIds.push(boothDataItem.id);
		});

		$.each(booths, function (index, snapElement) {

			var boothAssignmentIndex = assignedBoothIds.indexOf(snapElement.node.id);

			if (boothAssignmentIndex != -1) {
				var $snapElementNode = $(snapElement.node);
				$snapElementNode.addClass('highlight');
				callback(snapElement, boothAssigmentData[boothAssignmentIndex]);
			}
		});
	},


	/**
  * Click handler for the selected booths. 
  */
	svgElementClickHandler = function svgElementClickHandler(clickedSnapElement, boothData) {
		var $active = $(clickedSnapElement.path[0]),
		    $target = $active.closest('g'),
		    targetId = $target.attr('id'),
		    $flyouts = $('.flyout');

		$flyouts.animate({
			top: 0,
			opacity: 0
		}, 250, function () {
			$flyouts.detach();
		});

		var $div = $('<div class="flyout" style="top: ' + clickedSnapElement.clientY + 'px; left: ' + clickedSnapElement.clientX + 'px"><i class="fa fa-times fa-2x exit"></i><h2>' + boothData.name + '</h2><p>' + boothData.description + '</p></div>');
		var $body = $('body');

		$body.append($div);

		$div.animate({
			top: $body.height() / 2 - $div.outerHeight() / 2,
			left: $body.width() / 2 - $div.outerWidth() / 2,
			opacity: 1
		}, 250);

		$div.on('click', function (event) {
			$div.animate({
				top: 0,
				opacity: 0
			}, 250, function () {
				$div.detach();
			});
		});
	};

	return {
		display: display
	};
}(jQuery);