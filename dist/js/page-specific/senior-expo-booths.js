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

		var floorplan = Snap('.floorplan');

		Snap.load(svgFilePath, function (fragment) {
			snapLoadHandler(fragment, floorplan, width, height);
		});
	},


	/**
  * Load up the SVG, highlight the booths, and attach the click handler
  */
	snapLoadHandler = function snapLoadHandler(fragment, floorplan, width, height) {
		var parentElement = floorplan.append(fragment),
		    $parentElement = $(parentElement.node),
		    booths = parentElement.selectAll('svg > g > g');

		$.ajax('/PowerOfAge/exhibitors/2017-exhibitors.html').done(function (boothAssigmentData) {
			var extractedBoothAssigmentData = extractDataFromHtml(boothAssigmentData);

			highlightAssignedBooths(extractedBoothAssigmentData, booths, function (snapElement, boothData) {
				snapElement.click(function (clickEvent) {
					svgElementClickHandler(clickEvent, boothData);
				});
				snapElement.hover(function (clickEvent) {
					svgElementClickHandler(clickEvent, boothData);
				});
			});
		}).fail(function (errorResponse) {
			console.log(errorResponse);
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
			var $target = $(htmlArray[i]).find('#SEContentResults');

			if ($target.length) {
				$tableRows = $target.find('tbody tr');
				break;
			}
		}

		$.each($tableRows, function (index, row) {
			var $cols = $(row).find('td'),
			    rowData = {
				name: $cols.eq(0).text(),
				id: $cols.eq(1).text(),
				link: $cols.eq(2).text()
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
		var $flyouts = $('.flyout');

		$flyouts.hide();

		var $div = $('<div class="flyout" style="top: ' + clickedSnapElement.pageY + 'px; left: ' + clickedSnapElement.pageX + 'px"><i class="fa fa-times fa-2x exit"></i><h2>' + boothData.name + '</h2><p><strong>Booth: ' + boothData.id + '</strong></p><p><a href="' + boothData.link + '" title="' + boothData.name + '" target="_blank">' + boothData.link + '</a></p></div>');
		var $body = $('body');

		$body.append($div);

		$div.show();

		$div.on('click', function (event) {
			$div.hide();
		});
	};

	return {
		display: display
	};
}(jQuery);