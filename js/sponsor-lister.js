namespacer('seniorExpo');

seniorExpo.sponsorLister = (($, undefined) => {

	let $target;

	const htmlLoadedHandler = (html, htmlBuiltCallback) => {
		const $table = $(html).find('#SEContentResults table'),
			$rows = $table.find('tr').has('td'),
			nameIndex = 0,
			imageUrlIndex = 1,
			websiteUrlIndex = 2,
			orderIndex = 3;

		let sponsorData = [];

		$.each($rows, (index, tableRow) => {
			let dataItem = {
				name: $(tableRow).find('td').eq(nameIndex).text(),
				imageUrl: $(tableRow).find('td').eq(imageUrlIndex).text(),
				websiteUrl: $(tableRow).find('td').eq(websiteUrlIndex).text(),
				order: $(tableRow).find('td').eq(orderIndex).text(),
			};

			sponsorData.push(dataItem);
		});

		sponsorData = sortSponsors(sponsorData);

		htmlBuiltCallback(sponsorData);
	};

	const sortSponsors = sponsorData => {
		sponsorData = sponsorData.sort(nameComparer);
		sponsorData = sponsorData.sort(orderComparer);
		return sponsorData;
	};

	const nameComparer = (a, b) => {
		const aName = a.name.toLowerCase();
		const bName = b.name.toLowerCase();

		if (aName < bName)
			return -1;

		if (aName > bName)
			return 1;

		return 0;
	};

	const orderComparer = (a, b) => {
		const aOrder = a.order * 1;
		const bOrder = b.order * 1;
		
		if (aOrder < bOrder)
			return -1;

		if (aOrder > bOrder)
			return 1;

		return 0;
	};

	const getData = () => {
		$.ajax('/PowerOfAge/_data/Power_of_Age_Sponsors')
			.done(data => {
				htmlLoadedHandler(data, buildHtml);
			})
			.fail(errorResponse => {
				console.log(errorResponse);
			});
	};

	const buildHtml = (sponsorData) => {
		let lineNumber = 0;
		let $wrapper = $('<div class="sponsor-row flex flex-row flex-space-around flex-wrap"></div>');

		$.each(sponsorData, (index, sponsorItem) => {
			$wrapper.append(`<div class="sponsor"><a href="${sponsorItem.websiteUrl}" title="Visit ${sponsorItem.name}" target="_blank"><img src="${sponsorItem.imageUrl}" alt="Logo for ${sponsorItem.name}" /></a></div>`);
		});

		$target.append($wrapper);
	};

	const init = () => {
		$target = $('#sponsorship-list');

		if ($target.length) {
			getData();
		}
	};

	return {
		init
	};

})(jQuery);

$(() => {
	seniorExpo.sponsorLister.init();
});