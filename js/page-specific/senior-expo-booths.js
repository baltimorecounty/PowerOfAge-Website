namespacer('seniorExpo.pageSpecific');

seniorExpo.pageSpecific.seniorExpoBooths = (($, undefined) => {
	
	/**
	 * Load up the SVG, highlight the booths, and attach the click handler
	 */
	const loadHtml = (callback) => {
		$.ajax('/PowerOfAge/exhibitors/2017-exhibitors.html')
			.done(boothAssigmentData => {
				callback(boothAssigmentData);
			})
			.fail(errorResponse => {
				console.log(errorResponse);
			});
	};

	/**
	 * Extract data from the HTML table 
	 */
	const extractDataFromHtml = htmlData => {
		const htmlArray = Array.prototype.slice.call($(htmlData)),
			data = [];

		let $tableRows;

		for (let i = 0; i < htmlArray.length; i++) {
			const $target = $(htmlArray[i]).find('#SEContentResults');

			if ($target.length) {
				$tableRows = $target.find('tbody tr');
				break;
			}
		}

		$.each($tableRows, (index, row) => {
			const $cols = $(row).find('td'),
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
	const highlightAssignedBooths = (boothAssigmentData, $booths, callback) => {
		let assignedBoothIds = [];

		$.each(boothAssigmentData, (index, boothDataItem) => {
			assignedBoothIds.push(boothDataItem.id.trim());
		});

		$.each($booths, (index, boothElement) => {				

			let boothAssignmentIndex = assignedBoothIds.indexOf(boothElement.innerText);

			if (boothAssignmentIndex != -1) {
				let $boothElement = $(boothElement);
				$boothElement.addClass('reserved');

				if ($boothElement.is('.feature')) {
					$boothElement.text(boothAssigmentData[boothAssignmentIndex].name + ' (' + boothAssigmentData[boothAssignmentIndex].id.trim() + ')');
				}

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
	$(() => {
		const $booths = $('.floorplan td.booth');

		loadHtml(html => {
			const extractedData = extractDataFromHtml(html);
			highlightAssignedBooths(extractedData, $booths, (boothElement, boothData) => {
				// do something witty
			});
		});
	});

})(jQuery);