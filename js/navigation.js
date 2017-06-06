namespacer('seniorExpo');

seniorExpo.nav = (($, undefined) => {

	const 
	
		dropdownDisplayHandler = event => {
			const $target = $(event.currentTarget),
				$dropdown = $target.find('.dropdown'),
				wasActive = $dropdown.is('.active'),
				isNavActive = $target.closest('nav').is('.active');

			hideSubmenu($target);

			if (!wasActive) {
				displaySubmenu($target, $dropdown);
				
				setTimeout(() => {
					hideSubmenu($target, $dropdown);
				}, 5000);
			}
		},

		menuDisplayHandler = (event) => {
			const $target = $(event.currentTarget),
				$menu = $target.siblings('nav'),
				$menuItems = $menu.find('.has-dropdown');
			
			$menu.toggleClass('active');
		},

		displaySubmenu = ($target, $dropdown) => {
			$dropdown.addClass('active');
			$target.find('.fa').removeClass('fa-caret-right').addClass('fa-caret-down');
		},

		hideSubmenu = ($target, $dropdown) => {
			$('nav .dropdown').removeClass('active');
			$target.find('.fa').addClass('fa-caret-right').removeClass('fa-caret-down');
		},

		init = () => {
			const $menuItems = $('nav .has-dropdown'),
				$dropdowns = $menuItems.find('.dropdown'),
				$hamburgerMenu = $('.hamburger-menu');
				
			$menuItems.on('click', dropdownDisplayHandler);
				
			$hamburgerMenu.on('click', menuDisplayHandler);
		};

	return { init };
})(jQuery);

$(() => { 
	seniorExpo.nav.init(); 
});