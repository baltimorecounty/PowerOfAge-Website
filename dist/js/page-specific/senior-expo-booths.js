'use strict';

namespacer('seniorExpo.pageSpecific');

seniorExpo.pageSpecific.seniorExpoBooths = function ($, undefined) {

	/**
  * Load up the SVG, highlight the booths, and attach the click handler
  */
	var loadHtml = function loadHtml(callback) {
		$.ajax('/PowerOfAge/exhibitors/2017-exhibitors.html').done(function (boothAssigmentData) {
			callback(boothAssigmentData);
		}).fail(function (errorResponse) {
			console.log(errorResponse);
		});
	};

	/**
  * Extract data from the HTML table 
  */
	var extractDataFromHtml = function extractDataFromHtml(htmlData) {
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
				id: $cols.eq(1).text()
			};

			data.push(rowData);
		});

		return data;
	};

	/**
  * Highlight all of the booths indicated on the HTML page
  */
	var highlightAssignedBooths = function highlightAssignedBooths(boothAssigmentData, $booths, callback) {
		var assignedBoothIds = [];

		$.each(boothAssigmentData, function (index, boothDataItem) {
			assignedBoothIds.push(boothDataItem.id.trim());
		});

		$.each($booths, function (index, boothElement) {

			var boothAssignmentIndex = assignedBoothIds.indexOf(boothElement.innerText);

			if (boothAssignmentIndex != -1) {
				var $boothElementNode = $(boothElement);
				$boothElementNode.addClass('reserved');
				callback(boothElement, boothAssigmentData[boothAssignmentIndex]);
			}
		});
	};

	/**
  * Click handler for the selected booths. 
  */
	/*const svgElementClickHandler = (clickedSnapElement, boothData) => {
 	const $flyouts = $('.flyout');
 	
 	$flyouts.hide();
 
 	const $div = $(`<div class="flyout" style="top: ${clickedSnapElement.pageY}px; left: ${clickedSnapElement.pageX}px"><i class="fa fa-times fa-2x exit"></i><h2>${boothData.name}</h2><p><strong>Booth: ${boothData.id}</strong></p><p>${boothData.name}</p></div>`);
 	const $body = $('body');
 
 	$body.append($div);
 
 	$div.show();
 
 	$div.on('click', event => {
 		$div.hide();
 	});
 };*/

	/**
  * Lets get the ball rolling!
  */
	$(function () {
		var $booths = $('.floorplan td.booth');

		loadHtml(function (html) {
			var extractedData = extractDataFromHtml(html);
			highlightAssignedBooths(extractedData, $booths, function (boothElement, boothData) {
				// do something witty
			});
		});
	});
}(jQuery);