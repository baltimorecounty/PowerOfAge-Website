namespacer('seniorExpo.pageSpecific');

seniorExpo.pageSpecific.seniorExpoBooths = (($, undefined) => {
	
	const 
		
		/**
		 * Load everything up and display the SVG.
		 */
		display = (svgFilePath, width, height) => {
			if (!Snap) {
				console.log('"Snap" library not loaded.');
				return;
			}

			const floorplan = Snap('.floorplan');

			Snap.load(svgFilePath, fragment => {
				snapLoadHandler(fragment, floorplan, width, height);
			});			
		},

		/**
		 * Load up the SVG, highlight the booths, and attach the click handler
		 */
		snapLoadHandler = (fragment, floorplan, width, height) => {
			const parentElement = floorplan.append(fragment),
				$parentElement = $(parentElement.node),
				booths = parentElement.selectAll('svg > g > g');	

			$.ajax('/PowerOfAge/_data/Power_of_Age_Booth_Assignments')
				.done(boothAssigmentData => {
					let extractedBoothAssigmentData = extractDataFromHtml(boothAssigmentData);

					highlightAssignedBooths(extractedBoothAssigmentData, booths, (snapElement, boothData) => {
						snapElement.click((clickEvent) => {
							svgElementClickHandler(clickEvent, boothData);
						});
						snapElement.hover((clickEvent) => {
							svgElementClickHandler(clickEvent, boothData);
						});
					});
				})
				.fail(errorResponse => {
					console.log(errorResponse);
				});
		},

		/**
		 * Extract data from the HTML table 
		 */
		extractDataFromHtml = htmlData => {
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
						link: $cols.eq(2).text()
					};
				
				data.push(rowData);
			});

			return data;
		},

		/**
		 * Highlight all of the booths indicated on the HTML page
		 */
		highlightAssignedBooths = (boothAssigmentData, booths, callback) => {
			let assignedBoothIds = [];

			$.each(boothAssigmentData, (index, boothDataItem) => {
				assignedBoothIds.push(boothDataItem.id);
			});

			$.each(booths, (index, snapElement) => {				

				let boothAssignmentIndex = assignedBoothIds.indexOf(snapElement.node.id);

				if (boothAssignmentIndex != -1) {
					let $snapElementNode = $(snapElement.node);
					$snapElementNode.addClass('highlight');
					callback(snapElement, boothAssigmentData[boothAssignmentIndex]);
				}				
			});
		},

		/**
		 * Click handler for the selected booths. 
		 */
		svgElementClickHandler = (clickedSnapElement, boothData) => {
			const $flyouts = $('.flyout');
			
			$flyouts.hide();

			const $div = $(`<div class="flyout" style="top: ${clickedSnapElement.pageY}px; left: ${clickedSnapElement.pageX}px"><i class="fa fa-times fa-2x exit"></i><h2>${boothData.name}</h2><p><strong>Booth: ${boothData.id}</strong></p><p><a href="${boothData.link}" title="${boothData.name}" target="_blank">${boothData.link}</a></p></div>`);
			const $body = $('body');

			$body.append($div);

			$div.show();

			$div.on('click', event => {
				$div.hide();
			});
		};

	return {
		display: display
	};

})(jQuery);