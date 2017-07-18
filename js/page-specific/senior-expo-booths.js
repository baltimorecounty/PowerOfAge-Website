namespacer('seniorExpo.pageSpecific');

seniorExpo.pageSpecific.seniorExpoBooths = (($, undefined) => {

	const $floorplan = $('.floorplan');

	let lastBoothId = '';

	/**
	 * Load up the SVG, highlight the booths, and attach the click handler
	 */
	const loadHtml = (callback) => {
		$.ajax('/exhibitors/2017-exhibitors.html')
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

	const hoverInfoHandler = (event, boothData) => {
		const $target = $(event.target);
		const targetOffset = $target.offset();
		const $flyouts = $('.flyout');
		const $body = $('body');

		$flyouts.remove();

		$target.on('mouseleave mouseenter', event => {
			lastBoothId = '';
		});

		if (lastBoothId != boothData.id) {

			const $div = $(`<div class="flyout" style="top: ${targetOffset.top}px; left: ${targetOffset.left}px; display: none; min-width: ${$target.outerWidth()}px"><i class="fa fa-times fa-2x exit"></i><h2>${boothData.name}</h2><p><strong>Booth: ${boothData.id}</strong></p></div>`);
			const link = boothData.link.indexOf('<a') === -1 ? '' : $(boothData.link).attr('href');

			if (link) {
				$div.append(`<p><a href="${link}" target="_blank" title="Visit ${boothData.name}">Visit us online!</a></p>`);
			}

			$body.append($div);

			$div.slideDown(250, () => {
				lastBoothId = boothData.id;
			});		

			$div.on('mouseleave', event => {
				$div.slideUp(250, () => {
					lastBoothId = '';
				});
			});

			$div.find('.exit').on('click', event => {
				$div.slideUp(250, () => {
					lastBoothId = '';
				});
			});
		}

	};

	/**
	 * Lets get the ball rolling!
	 */
	$(() => {
		const $booths = $('.floorplan td.booth');

		loadHtml(html => {
			const extractedData = extractDataFromHtml(html);
			highlightAssignedBooths(extractedData, $booths, (boothElement, boothData) => {
				$(boothElement).on('click mouseenter', event => {			
					hoverInfoHandler(event, boothData);
				});
			});
		});
	});

})(jQuery);