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
		},
	
		sortSponsors = sponsorData => {
			sponsorData = sponsorData.sort(nameComparer);
			sponsorData = sponsorData.sort(lineComparer);
			return sponsorData;
		},

		nameComparer = (a, b) => {
			if (a.name < b.name)
				return -1;

			if (a.name > b.name)
				return 1;

			return 0;			
		},

		lineComparer = (a, b) => {
			if (a.line < b.line)
				return -1;

			if (a.line > b.line)
				return 1;

			return 0;			
		},

		getData = () => {
			$.ajax('/PowerOfAge/_data/Power_of_Age_Sponsors')
				.done(data => {
					htmlLoadedHandler(data, buildHtml);
				})
				.fail(errorResponse => {
					console.log(errorResponse);
				});
		},

		buildHtml = (sponsorData) => {
			let lineNumber = 0,
				wrapperHtml = '<div class="sponsor-row flex flex-row flex-space-around flex-wrap"></div>',
				$wrapper;
			
			$.each(sponsorData, (index, sponsorItem) => {

				if (sponsorItem.line != lineNumber) {
					lineNumber = sponsorItem.line;
					if ($wrapper) 
						$target.append($wrapper);
					$wrapper = $(wrapperHtml);
				}

				$wrapper.append(`<div class="sponsor"><a href="${sponsorItem.websiteUrl}" target="_blank"><img src="${sponsorItem.imageUrl}"/></a></div>`);

				if (!sponsorData[index+1]) {
					$target.append($wrapper);					
				}
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