namespacer('seniorExpo');

seniorExpo.sponsorLister = (($, undefined) => {
	
	let $target;

	const 
		htmlLoadedHandler = (html, htmlBuiltCallback) => {
			const $table = $(html).find('#SEContentResults table'),
				$rows = $table.find('tr').has('td'),
				nameIndex = 0,
				imageUrlIndex = 1,
				websiteUrlIndex = 2,
				tierIndex = 3;
			
			let sponsorData = [];

			$.each($rows, (index, tableRow) => {
				let dataItem = {
					name: $(tableRow).find('td').eq(nameIndex).text(),
					imageUrl: $(tableRow).find('td').eq(imageUrlIndex).text(),
					websiteUrl: $(tableRow).find('td').eq(websiteUrlIndex).text(),
					tier: $(tableRow).find('td').eq(tierIndex).text()
				};

				sponsorData.push(dataItem);
			});

			htmlBuiltCallback(sponsorData);
		},
	
		getData = () => {
			$.ajax('/PowerOfAge/_data/Power_of_Age_Sponsors').done((data) => {
				htmlLoadedHandler(data, buildHtml);
			})
				.fail(errorResponse => {
					console.log(errorResponse);
				});
		},

		buildHtml = (sponsorData) => {
			$.each(sponsorData, (index, sponsorItem) => {
				$target.append(`<div><a href="${sponsorItem.websiteUrl}" target="_blank"><img src="${sponsorItem.imageUrl}"/></a></div>`)
			});
		},

		init = () => {
			$target = $('#sponsorship-list');

			if ($target.length) {
				getData();
			}
		};

	return { init };

})(jQuery);

$(() => {
	seniorExpo.sponsorLister.init();
});