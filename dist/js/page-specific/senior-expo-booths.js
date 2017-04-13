namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.seniorExpoBooths = (function($, undefined) {
	
	var display = function(svgFilePath, hallId, width, height) {

			if (!Snap) {
				console.log('"Snap" library not loaded.');
				return;
			}

			Snap.load(svgFilePath, function(fragment) {

				var snap = Snap(width, height);

				var parentElement = snap.append(fragment),
					booths = parentElement.selectAll('svg > g > g');	

				$.each(booths, function(index, snapElement) {				
					snapElement.click(function(clickedElement) {

						var $active = $(clickedElement.path[0]),
							$target = $active.closest('g'),
							targetText = $target.text().trim().replace(/[\r\n\t\s]/g, '');
						
						console.log('Post ' + targetText + ' to something.');

						$target.toggleClass('highlight');
						
					});
				});
			});
		};

	return {
		display: display
	};

})(jQuery);