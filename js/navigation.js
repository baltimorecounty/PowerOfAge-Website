namespacer('seniorExpo');

seniorExpo.nav = (($, undefined) => {

	const 
	
		dropdownDisplayHandler = event => {
			const $target = $(event.currentTarget),
				$dropdown = $target.find('.dropdown'),
				isActive = $dropdown.is('.active'),
				isNavActive = $target.closest('nav').is('.active');

			if (isActive) {
				if (event.type === 'click' || event.type === 'mouseout') {
					$dropdown.removeClass('active');
					$target.find('.fa').toggleClass('fa-caret-down').toggleClass('fa-caret-right');
				}
			} else {
				if (event.type != 'mouseout') {
					$dropdown.addClass('active');
					$target.find('.fa').toggleClass('fa-caret-right').toggleClass('fa-caret-down');
				}
			}
		},

		menuDisplayHandler = (event) => {
			const $target = $(event.currentTarget),
				$menu = $target.siblings('nav'),
				$menuItems = $menu.find('.has-dropdown');
			
			$menu.toggleClass('active');
		},

		init = () => {
			const $menuItems = $('nav .has-dropdown'),
				$dropdowns = $menuItems.find('.dropdown'),
				$hamburgerMenu = $('.hamburger-menu');
				
			$menuItems.on('click mouseover mouseout', dropdownDisplayHandler);
			$hamburgerMenu.on('click', menuDisplayHandler);
		};

	return { init };
})(jQuery);

$(() => { 
	seniorExpo.nav.init(); 
});