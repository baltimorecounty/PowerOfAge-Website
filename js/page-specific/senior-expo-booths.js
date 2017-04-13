namespacer('baltimoreCounty.pageSpecific');

baltimoreCounty.pageSpecific.seniorExpoBooths = (($, undefined) => {
	
	const displayInteractive = (svgFilePath, hallId, width, height) => {

			if (!Snap) {
				console.log('"Snap" library not loaded.');
				return;
			}

			Snap.load(svgFilePath, fragment => {

				const snap = Snap(width, height),
					parentElement = snap.append(fragment),
					booths = parentElement.selectAll('svg > g > g');	

				$.each(booths, (index, snapElement) => {				
					snapElement.click(clickedElement => {

						const $active = $(clickedElement.path[0]),
							$target = $active.closest('g'),
							targetId = $target.attr('id');
						
						$.ajax(`http://localhost:1000/api/aging-expo/booth-assignments/${targetId}`)
							.done(() => {
								console.log('The dishes are done, man.');
							});


						$target.toggleClass('highlight');
						
					});
				});
			});
		};

	return {
		displayInteractive: displayInteractive
	};

})(jQuery);