namespacer('seniorExpo');

seniorExpo.sponsorLister = (($, undefined) => {

	let $target;

	const htmlLoadedHandler = (html, htmlBuiltCallback) => {
		const $table = $(html).find('#SEContentResults table'),
			$rows = $table.find('tr').has('td'),
			nameIndex = 0,
			imageUrlIndex = 1,
			websiteUrlIndex = 2,
			lineIndex = 3;

		let sponsorData = [];

		$.each($rows, (index, tableRow) => {
			let dataItem = {
				name: $(tableRow).find('td').eq(nameIndex).text(),
				imageUrl: $(tableRow).find('td').eq(imageUrlIndex).text(),
				websiteUrl: $(tableRow).find('td').eq(websiteUrlIndex).text(),
				line: $(tableRow).find('td').eq(lineIndex).text()
			};

			sponsorData.push(dataItem);
		});

		sponsorData = sortSponsors(sponsorData);

		htmlBuiltCallback(sponsorData);
	};

	const sortSponsors = sponsorData => {
		sponsorData = sponsorData.sort(nameComparer);
		sponsorData = sponsorData.sort(lineComparer);
		return sponsorData;
	};

	const nameComparer = (a, b) => {
		if (a.name < b.name)
			return -1;

		if (a.name > b.name)
			return 1;

		return 0;
	};

	const lineComparer = (a, b) => {
		if (a.line < b.line)
			return -1;

		if (a.line > b.line)
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
			$wrapper.append(`<div class="sponsor"><a href="${sponsorItem.websiteUrl}" target="_blank"><img src="${sponsorItem.imageUrl}"/></a></div>`);
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