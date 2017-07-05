namespacer('seniorExpo');

seniorExpo.nav = (($, undefined) => {
	
	let $allDropdowns;

	/**
	 * Hamburger menu control 
	 */
	const menuDisplayHandler = (event) => {
		const $target = $(event.currentTarget),
			$menu = $target.siblings('nav'),
			$menuItems = $menu.find('.has-dropdown');
		
		$menuItems.on('click', event => {
			$menu.find('.dropdown').not($(event.target).siblings('.dropdown')).removeClass('active');
			$(event.target).siblings('.dropdown').toggleClass('active');
		});

		$menu.toggleClass('active');
	};

	/**
	 * Make the nav keyboard navigable.
	 */
	const keyboardNavigationHandler = event => {
		const keyCode = event.which || event.keyCode;
		const $target = $(event.currentTarget);
		const $closestDropdown = $target.closest('.has-dropdown').find('.dropdown');
		const enterKeyCode = 13;
		const tabKeyCode = 9;

		if (keyCode === enterKeyCode) {
			$allDropdowns.not($closestDropdown).removeClass('active');
			$closestDropdown.toggleClass('active');
		}

		if (keyCode === tabKeyCode && $target.is('.has-dropdown > span, .has-dropdown > a')) {
			$allDropdowns.removeClass('active');
		}

	};

	/**
	 * Cancel menus when tabbing off the nav.
	 */
	const bodyKeyupHandler = event => {
		const keyCode = event.which || event.keyCode;
		const tabKeyCode = 9;
		const $target = $(event.target);

		if (keyCode === tabKeyCode) {
			if ($target.closest('nav').length === 0) {
				$allDropdowns.removeClass('active');
			}
		}
	};

	/**
	 * Assign handlers
	 */
	const init = () => {
		const $hamburgerMenu = $('.hamburger-menu');
		const $mainMenu = $('header nav .has-dropdown span, header nav .has-dropdown a');
		const $body = $('body');

		$allDropdowns = $('header nav .dropdown');

		$hamburgerMenu.on('click', menuDisplayHandler);
		$mainMenu.on('keyup', keyboardNavigationHandler);
		$body.on('keyup', bodyKeyupHandler);
	};

	return { init };

})(jQuery);

$(() => { 
	seniorExpo.nav.init(); 
});