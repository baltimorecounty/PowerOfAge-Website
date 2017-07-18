'use strict';

namespacer('seniorExpo.pageSpecific');

seniorExpo.pageSpecific.seniorExpoBooths = function ($) {

	var lastBoothId = '';

	/**
  * Load up the SVG, highlight the booths, and attach the click handler
  */
	var loadHtml = function loadHtml(callback) {
		$.ajax('/exhibitors/2017-exhibitors.html').done(function (boothAssigmentData) {
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
				id: $cols.eq(1).text(),
				link: $cols.eq(0).html()
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
				var $boothElement = $(boothElement);
				$boothElement.addClass('reserved');

				if ($boothElement.is('.feature')) {
					$boothElement.text(boothAssigmentData[boothAssignmentIndex].name + ' (' + boothAssigmentData[boothAssignmentIndex].id.trim() + ')');
				}

				callback(boothElement, boothAssigmentData[boothAssignmentIndex]);
			}
		});
	};

	var hoverInfoHandler = function hoverInfoHandler(event, boothData) {
		var $target = $(event.target);
		var targetOffset = $target.offset();
		var $flyouts = $('.flyout');
		var $body = $('body');

		$flyouts.remove();

		$target.on('mouseleave mouseenter', function () {
			lastBoothId = '';
		});

		if (lastBoothId != boothData.id) {

			var $div = $('<div class="flyout" style="top: ' + targetOffset.top + 'px; left: ' + targetOffset.left + 'px; display: none; min-width: ' + $target.outerWidth() + 'px"><i class="fa fa-times fa-2x exit"></i><h2>' + boothData.name + '</h2><p><strong>Booth: ' + boothData.id + '</strong></p></div>');
			var link = boothData.link.indexOf('<a') === -1 ? '' : $(boothData.link).attr('href');

			if (link) {
				$div.append('<p><a href="' + link + '" target="_blank" title="Visit ' + boothData.name + '">Visit us online!</a></p>');
			}

			$body.append($div);

			$div.slideDown(250, function () {
				lastBoothId = boothData.id;
			});

			$div.on('mouseleave', function () {
				$div.slideUp(250, function () {
					lastBoothId = '';
				});
			});

			$div.find('.exit').on('click', function () {
				$div.slideUp(250, function () {
					lastBoothId = '';
				});
			});
		}
	};

	var init = function init() {
		var $booths = $('.floorplan td.booth');

		loadHtml(function (html) {
			var extractedData = extractDataFromHtml(html);
			highlightAssignedBooths(extractedData, $booths, function (boothElement, boothData) {
				$(boothElement).on('click mouseenter', function (event) {
					hoverInfoHandler(event, boothData);
				});
			});
		});
	};

	/**
  * Lets get the ball rolling!
  */
	$(function () {
		init();
	});
}(jQuery);