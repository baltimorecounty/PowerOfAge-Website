namespacer('seniorExpo');

seniorExpo.nav = (($, undefined) => {

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

	const init = () => {
		const $hamburgerMenu = $('.hamburger-menu');

		$hamburgerMenu.on('click', menuDisplayHandler);
	};

	return { init };

})(jQuery);

$(() => { 
	seniorExpo.nav.init(); 
});