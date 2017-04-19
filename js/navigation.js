namespacer('seniorExpo');

seniorExpo.nav = (($, undefined) => {

	const 
	
		dropdownDisplayHandler = event => {
			const $target = $(event.currentTarget),
				$dropdown = $target.find('.dropdown'),
				isActive = $dropdown.is('.active');

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

		init = () => {
			const $menuItems = $('nav .has-dropdown'),
				$dropdowns = $menuItems.find('.dropdown');
				
			$menuItems.on('click mouseover mouseout', dropdownDisplayHandler);
		};

	return { init };
})(jQuery);

$(() => { 
	seniorExpo.nav.init(); 
});