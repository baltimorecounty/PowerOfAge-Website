'use strict';

/*
 * Creates namespaces safely and conveniently, reusing 
 * existing objects instead of overwriting them.
 */
var namespacer = function namespacer(ns) {
	var nsArr = ns.split('.'),
	    parent = window;

	if (!nsArr.length) return;

	for (var i = 0; i < nsArr.length; i++) {
		var nsPart = nsArr[i];

		if (typeof parent[nsPart] === 'undefined') {
			parent[nsPart] = {};
		}

		parent = parent[nsPart];
	}
};
'use strict';

namespacer('seniorExpo');

seniorExpo.nav = function ($, undefined) {

	var dropdownDisplayHandler = function dropdownDisplayHandler(event) {
		var $target = $(event.currentTarget),
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
	    menuDisplayHandler = function menuDisplayHandler(event) {
		var $target = $(event.currentTarget),
		    $menu = $target.siblings('nav'),
		    $menuItems = $menu.find('.has-dropdown');

		$menu.toggleClass('active');
	},
	    init = function init() {
		var $menuItems = $('nav .has-dropdown'),
		    $dropdowns = $menuItems.find('.dropdown'),
		    $hamburgerMenu = $('.hamburger-menu');

		$menuItems.on('click mouseover mouseout', dropdownDisplayHandler);
		$hamburgerMenu.on('click', menuDisplayHandler);
	};

	return { init: init };
}(jQuery);

$(function () {
	seniorExpo.nav.init();
});