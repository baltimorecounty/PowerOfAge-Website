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

				$.ajax('http://localhost:1000/api/aging-expo/booth-assignments').done(boothAssigmentData => {
					let assgnedBoothIds = [];

					$.each(boothAssigmentData, (index, booth) => {
						assgnedBoothIds.push(booth.Booth_Id);
					});
	
					$.each(booths, (index, snapElement) => {				

						let boothAssignmentIndex = assgnedBoothIds.indexOf(snapElement.node.id * 1);

						if (boothAssignmentIndex != -1) {
							let $snapElementNode = $(snapElement.node);
							$snapElementNode.addClass('highlight');
						}

						snapElement.click(clickedElement => {

							const $active = $(clickedElement.path[0]),
								$target = $active.closest('g'),
								targetId = $target.attr('id');
							
							$.ajax(`http://localhost:1000/api/aging-expo/booth-assignments/${targetId}`)
								.done(() => {
									console.log(`Booth number ${targetId} has been updated.`);
								});

							$target.toggleClass('highlight');
							
						});
					});

				});

			});
			
		};

	return {
		displayInteractive: displayInteractive
	};

})(jQuery);