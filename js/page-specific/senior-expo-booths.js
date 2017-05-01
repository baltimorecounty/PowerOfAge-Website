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

			$.ajax('http://ba224964:1000/api/aging-expo/booth-assignments')
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
				if (htmlArray[i].id === "SEContentResults") {
					$tableRows = $(htmlArray[i]).find('tbody tr');
					break;
				}
			}

			$.each($tableRows, (index, row) => {
				const $cols = $(row).find('td'),
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
			const $active = $(clickedSnapElement.path[0]),
				$target = $active.closest('g'),
				targetId = $target.attr('id'),
				$flyouts = $('.flyout');
			
			$flyouts.hide();

			const $div = $(`<div class="flyout" style="top: ${clickedSnapElement.pageY}px; left: ${clickedSnapElement.pageX}px"><i class="fa fa-times fa-2x exit"></i><h2>${boothData.name}</h2><p>${boothData.description}</p></div>`);
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