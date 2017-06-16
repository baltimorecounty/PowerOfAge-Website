namespacer('seniorExpo');

seniorExpo.contraster = (($, undefined) => {

	const stylesheets = {
		master: {
			normal: '/sebin/h/e/master.min.css',
			high: '/sebin/x/u/master-high-contrast.min.css'
		},
		home: {
			normal: '/sebin/r/d/home.min.css',
			high: '/sebin/f/p/home-high-contrast.min.css'				
		}
	};

	const contrastButtonClickHandler = event => {
		const $stylesheetMaster = $('#stylesheet-master');
		const $stylesheetHome = $('#stylesheet-home');

		if ($stylesheetMaster.length) {
			let masterHref = $stylesheetMaster.attr('href');
			$stylesheetMaster.attr('href', masterHref === stylesheets.master.normal ? stylesheets.master.high : stylesheets.master.normal);
		}

		if ($stylesheetHome.length) {
			let homeHref = $stylesheetHome.attr('href');
			$stylesheetHome.attr('href', homeHref === stylesheets.home.normal ? stylesheets.home.high : stylesheets.home.normal);
		}
	};

	const init = () => {
		const $contrastButton = $('#contrastButton');

		if ($contrastButton.length) {
			$contrastButton.on('click', contrastButtonClickHandler);
		}
	};

	return { init };

})(jQuery);

$(() => {
	seniorExpo.contraster.init();
});