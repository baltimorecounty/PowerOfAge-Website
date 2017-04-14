namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.seniorExpoBooths = (($, undefined) => {
	
	const 
		
		/**
		 * Load everything up and display the SVG.
		 */
		display = (svgFilePath, width, height) => {
			if (!Snap) {
				console.log('"Snap" library not loaded.');
				return;
			}

			Snap.load(svgFilePath, fragment => {
				snapLoadHandler(fragment, width, height);
			});			
		},

		/**
		 * Load up the SVG, highlight the booths, and attach the click handler
		 */
		snapLoadHandler = (fragment, width, height) => {
			const snap = Snap(width, height),
				parentElement = snap.append(fragment),
				$parentElement = $(parentElement.node),
				booths = parentElement.selectAll('svg > g > g');	

			$.ajax('http://ba224964:1300/dist/data.html').done((boothAssigmentData) => {
				let extractedBoothAssigmentData = extractDataFromHtml(boothAssigmentData);

				highlightAssignedBooths(extractedBoothAssigmentData, booths, (snapElement, boothData) => {
					snapElement.click((clickEvent) => {
						svgElementClickHandler(clickEvent, boothData);
					});
				});
			});
		},

		/**
		 * Extract data from the HTML table 
		 */
		extractDataFromHtml = htmlData => {
			const $html = $(htmlData),
				$tableRows = $html.find('tr'),
				data = [];

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

			$flyouts.animate({
				top: 0,
				opacity: 0
			}, 250, () => {
				$flyouts.detach();
			});
			
			const $div = $(`<div class="flyout" style="top: ${clickedSnapElement.clientY}px; left: ${clickedSnapElement.clientX}px"><i class="fa fa-times fa-2x exit"></i><h2>${boothData.name}</h2><p>${boothData.description}</p></div>`);
			const $body = $('body');

			$body.append($div);

			$div.animate({
				top: $body.height()/2 - $div.outerHeight()/2,
				left: $body.width()/2 - $div.outerWidth()/2,
				opacity: 1
			}, 250);

			$div.on('click', event => {
				$div.animate({
					top: 0,
					opacity: 0
				}, 250, () => {
					$div.detach();
				});
			});
		};

	return {
		display: display
	};

})(jQuery);