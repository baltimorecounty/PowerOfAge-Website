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

namespacer('seniorExpo.utility');

seniorExpo.utility.flexDetect = function (document, $, undefined) {

	var init = function init() {
		var hasFlex = document.createElement('div').style.flex !== undefined;

		if (!hasFlex) {
			$('body').addClass('no-flex');
		}
	};

	return { init: init };
}(document, jQuery);

$(function () {
	seniorExpo.utility.flexDetect.init();
});
'use strict';

namespacer('baltimoreCounty.utility');

baltimoreCounty.utility.numericStringTools = function () {
  'use strict';

  var
  /*
         * We want to consider the column text to be a number if it starts with a dollar 
         * sign, so let's peek at the first character and see if that's the case.
         * Don't worry, if it's just a normal number, it's handled elsewhere.
         */
  getIndexOfFirstDigit = function getIndexOfFirstDigit(numberString) {
    var startsWithCurrencyRegex = /[\$]/;
    return startsWithCurrencyRegex.test(numberString[0]) && numberString.length > 1 ? 1 : 0;
  },


  /*
   * Is the first character of the value in question a number (without the dollar sign, if present)? 
   * If so, return the value as an actual number, rather than a string of numbers.
   */
  extractNumbersIfPresent = function extractNumbersIfPresent(stringOrNumber) {
    var firstCharacterIndex = getIndexOfFirstDigit(stringOrNumber),
        stringOrNumberPossiblyWithoutFirstCharacter = stringOrNumber.slice(firstCharacterIndex),
        firstSetOfNumbers = getFirstSetOfNumbersAndRemoveNonDigits(stringOrNumberPossiblyWithoutFirstCharacter);
    return typeof firstSetOfNumbers === 'number' ? firstSetOfNumbers : stringOrNumber;
  },


  /*
   * Here, we're converting the first group of characters to a number, so we can sort 
   * numbers numerically, rather than alphabetically.
   */
  getFirstSetOfNumbersAndRemoveNonDigits = function getFirstSetOfNumbersAndRemoveNonDigits(numbersAndAssortedOtherCharacters) {
    var allTheDigitsRegex = /^\.{0,1}(\d+[\,\.]{0,1})*\d+\b/,
        extractedNumerics = numbersAndAssortedOtherCharacters.match(allTheDigitsRegex);
    return extractedNumerics ? parseFloat(extractedNumerics[0].split(',').join('')) : numbersAndAssortedOtherCharacters;
  };

  return {
    getIndexOfFirstDigit: getIndexOfFirstDigit,
    extractNumbersIfPresent: extractNumbersIfPresent,
    getFirstSetOfNumbersAndRemoveNonDigits: getFirstSetOfNumbersAndRemoveNonDigits
  };
}();
'use strict';

namespacer('baltimoreCounty');

baltimoreCounty.contentFilter = function ($) {

    var DEFAULT_WRAPPER_SELECTOR = '.bc-filter-content',
        DEFAULT_SEARCH_BOX_SELECTOR = '.bc-filter-form .bc-filter-form-filter',
        DEFAULT_CLEAR_BUTTON_SELECTOR = '.bc-filter-form .bc-filter-form-clearButton',
        DEFAULT_ERROR_MESSAGE_SELECTOR = '.bc-filter-noResults',
        DEFAULT_CONTENT_TYPE = 'list',


    /*
     * Initialize the filter, and activate it.
     */
    init = function init(options) {

        options = options || {};

        var wrapperSelector = options.wrapper || DEFAULT_WRAPPER_SELECTOR,
            searchBoxSelector = options.searchBox || DEFAULT_SEARCH_BOX_SELECTOR,
            clearButtonSelector = options.clearButton || DEFAULT_CLEAR_BUTTON_SELECTOR,
            errorMessageSelector = options.errorMessage || DEFAULT_ERROR_MESSAGE_SELECTOR,
            contentType = options.contentType || DEFAULT_CONTENT_TYPE,
            $wrapper = safeLoad(wrapperSelector),
            $searchBox = safeLoad(searchBoxSelector),
            $clearButton = safeLoad(clearButtonSelector),
            $errorMessage = safeLoad(errorMessageSelector),
            $clearIcon = $('.icon-clear');

        $errorMessage.hide();

        $searchBox.on('keyup', function (eventObject) {
            var criteria = $(eventObject.currentTarget).val();

            if (criteria.length) {
                showIcon('clear');
            } else {
                showIcon('search');
            }

            switch (contentType) {
                case 'table':
                    filterTable($wrapper, criteria, $errorMessage);
                    break;
                case 'list':
                    filterList($wrapper, criteria, $errorMessage);
                    break;
            }
        });

        $searchBox.closest('form').on('submit', function (e) {
            return false;
        });

        $clearButton.on('click', function () {
            clearFilter($wrapper, $searchBox, $errorMessage);
        });

        $clearIcon.on('click', function () {
            clearFilter($wrapper, $searchBox, $errorMessage, function () {
                showIcon('search');
            });
        });
    },
        showIcon = function showIcon(iconType, callback) {
        setTimeout(function () {
            var $iconSearch = $('.icon-search'),
                $iconClear = $('.icon-clear'),
                animationDuration = 150,
                animationPropertiesOut = {
                top: 0,
                opacity: 0
            },
                animationPropertiesIn = {
                top: '25px',
                opacity: 1
            };

            if (iconType === 'search' && $iconClear.is(':visible')) {
                $iconClear.animate(animationPropertiesOut, animationDuration, function () {
                    $iconSearch.animate(animationPropertiesIn, animationDuration, function () {
                        if (typeof callback === 'function') callback();
                    });
                });
            }

            if (iconType === 'clear' && $iconSearch.is(':visible')) {
                $iconSearch.animate(animationPropertiesOut, animationDuration, function () {
                    $iconClear.animate(animationPropertiesIn, animationDuration, function () {
                        if (typeof callback === 'function') callback();
                    });
                });
            }
        }, 0);
    },
        setColumnWidthToInitialWidth = function setColumnWidthToInitialWidth(index, item) {
        var $columnHeader = $(item);
        $columnHeader.width($columnHeader.width());
    },
        safeLoad = function safeLoad(selector) {
        var $items = $(selector);
        if ($items.length === 0) throw 'No elements for "' + selector + '" were found.';
        return $items;
    },


    /*
     * Tokenized search that returns the matches found in the list or table.
     */
    findMatches = function findMatches($wrapper, selector, criteria) {
        var criteriaTokens = criteria.trim().toLowerCase().replace(',', '').split(' ');

        var $matches = $wrapper.find(selector).filter(function (idx, element) {
            var selectorText = $(element).text().toLowerCase().replace(',', '');
            return criteriaTokens.every(function (tokenValue) {
                return selectorText.indexOf(tokenValue) > -1;
            });
        });

        return $matches;
    },


    /*
     * Filters an unordered list based on the user's input.
     */
    filterList = function filterList($wrapper, criteria, $errorMessage) {
        var $matches = findMatches($wrapper, 'ul li', criteria);

        $wrapper.find('li').not($matches).hide();
        $matches.show();

        var $divsWithResults = $wrapper.children('div').find('li').not('[style="display: none;"]').closest('div');

        $wrapper.children('div').not($divsWithResults).hide();
        $divsWithResults.show();

        if ($divsWithResults.length === 0) $errorMessage.show();else $errorMessage.hide();
    },


    /*
     * Since the current table stripes are based on :nth-child(), they'll get funky
     * when the filter removes rows. So, let's reset the row striping when there's a search. 
     * This is using inline styles since there's inline CSS that sets the color and 
     * has to be overwritten.
     */
    resetTableStripes = function resetTableStripes($matches, selector, color) {
        $matches.parent().children(selector).has('td').css('background-color', color);
    },


    /*
     * Filters an table of links and content based on the user's input.
     */
    filterTable = function filterTable($wrapper, criteria, $errorMessage) {
        var $matches = findMatches($wrapper, 'tr', criteria);

        $wrapper.find('tr').has('td').not($matches).hide();
        $matches.show();

        if ($matches.length === 0) {
            $errorMessage.show();
            $wrapper.find('tr').has('th').hide();
        } else {
            $errorMessage.hide();
            $wrapper.find('tr').has('th').show();
        }

        resetTableStripes($matches, 'tr:visible:even', '#ebebeb');
        resetTableStripes($matches, 'tr:visible:odd', '#fff');
    },


    /*
     * Clears the filter and displays all nodes in the list.
     */
    clearFilter = function clearFilter($wrapper, $searchbox, $errorMessage, callback) {
        var $everythingWeFilter = $wrapper.find('li, div, tr');
        $everythingWeFilter.show();
        resetTableStripes($everythingWeFilter.filter('tr'), 'tr:visible:even', '#ebebeb');
        resetTableStripes($everythingWeFilter.filter('tr'), 'tr:visible:odd', '#fff');
        $searchbox.val('');
        $errorMessage.hide();
        if (typeof callback === 'function') callback();
    };

    /* Reveal! */

    return {
        init: init
    };
}(jQuery);
'use strict';

namespacer('seniorExpo');

seniorExpo.contraster = function ($, localStorage, undefined) {

	var stylesheets = {
		master: {
			normal: '/sebin/h/e/master.min.css',
			high: '/sebin/x/u/master-high-contrast.min.css'
		},
		home: {
			normal: '/sebin/r/d/home.min.css',
			high: '/sebin/f/p/home-high-contrast.min.css'
		}
	};

	var contrastButtonClickHandler = function contrastButtonClickHandler(event) {
		var $stylesheetMaster = $('#stylesheet-master');
		var $stylesheetHome = $('#stylesheet-home');

		if ($stylesheetMaster.length) {
			var masterHref = $stylesheetMaster.attr('href');
			$stylesheetMaster.attr('href', masterHref === stylesheets.master.normal ? stylesheets.master.high : stylesheets.master.normal);
			localStorage.setItem('isHighContrast', masterHref === stylesheets.master.normal);
		}

		if ($stylesheetHome.length) {
			var homeHref = $stylesheetHome.attr('href');
			$stylesheetHome.attr('href', homeHref === stylesheets.home.normal ? stylesheets.home.high : stylesheets.home.normal);
		}
	};

	var init = function init() {
		var $contrastButton = $('#contrastButton');

		if ($contrastButton.length) {
			$contrastButton.on('click', contrastButtonClickHandler);
		}

		if (localStorage.getItem('isHighContrast') === 'true') $contrastButton.trigger('click');else localStorage.setItem('isHighContrast', 'false');
	};

	return { init: init };
}(jQuery, localStorage);

$(function () {
	seniorExpo.contraster.init();
});
'use strict';

namespacer('seniorExpo');

seniorExpo.nav = function ($, undefined) {

	var $allDropdowns = void 0;

	/**
  * Hamburger menu control 
  */
	var menuDisplayHandler = function menuDisplayHandler(event) {
		var $target = $(event.currentTarget),
		    $menu = $target.siblings('nav'),
		    $menuItems = $menu.find('.has-dropdown');

		$menuItems.on('click', function (event) {
			$menu.find('.dropdown').not($(event.target).siblings('.dropdown')).removeClass('active');
			$(event.target).siblings('.dropdown').toggleClass('active');
		});

		$menu.toggleClass('active');
	};

	/**
  * Make the nav keyboard navigable.
  */
	var keyboardNavigationHandler = function keyboardNavigationHandler(event) {
		var keyCode = event.which || event.keyCode;
		var $target = $(event.currentTarget);
		var $closestDropdown = $target.closest('.has-dropdown').find('.dropdown');
		var enterKeyCode = 13;
		var tabKeyCode = 9;

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
	var bodyKeyupHandler = function bodyKeyupHandler(event) {
		var keyCode = event.which || event.keyCode;
		var tabKeyCode = 9;
		var $target = $(event.target);

		if (keyCode === tabKeyCode) {
			if ($target.closest('nav').length === 0) {
				$allDropdowns.removeClass('active');
			}
		}
	};

	/**
  * Assign handlers
  */
	var init = function init() {
		var $hamburgerMenu = $('.hamburger-menu');
		var $mainMenu = $('header nav .has-dropdown span, header nav .has-dropdown a');
		var $body = $('body');

		$allDropdowns = $('header nav .dropdown');

		$hamburgerMenu.on('click', menuDisplayHandler);
		$mainMenu.on('keyup', keyboardNavigationHandler);
		$body.on('keyup', bodyKeyupHandler);
	};

	return { init: init };
}(jQuery);

$(function () {
	seniorExpo.nav.init();
});
'use strict';

namespacer('baltimoreCounty');

baltimoreCounty.niftyTables = function ($, numericStringTools, undefined) {
    'use strict';

    var columnIndex = 0,
        shouldSortAscending = true,


    /*
     * Since we're sorting a table, we need to work out what we're 
     * comparing against, based on the column header that was clicked. 
     * Then we can compare the two rows that are passed in.
     */
    clickedColumnSorter = function clickedColumnSorter(aTableRow, bTableRow) {
        var aContent = getFirstTextFromCell(aTableRow, columnIndex).toLowerCase(),
            bContent = getFirstTextFromCell(bTableRow, columnIndex).toLowerCase(),
            aExtractedContent = numericStringTools.extractNumbersIfPresent(aContent),
            bExtractedContent = numericStringTools.extractNumbersIfPresent(bContent),
            directionComparer = shouldSortAscending ? ascendingComparer : descendingComparer;
        return comparer(directionComparer, aExtractedContent, bExtractedContent);
    },


    /*
     * Use the supplied comparerFunction to compare a and b.
     */
    comparer = function comparer(comparerFunction, a, b) {
        return comparerFunction(a, b);
    },


    /*
     * Compares two values, and returns a result that incidates whether 
     * or not the values are in ascending order.
     */
    ascendingComparer = function ascendingComparer(a, b) {
        if (a > b) return 1;

        if (b > a) return -1;

        return 0;
    },


    /*
     * Compares two values, and returns a result that incidates whether 
     * or not the values are in descending order.
     */
    descendingComparer = function descendingComparer(a, b) {
        if (a < b) return 1;

        if (b < a) return -1;

        return 0;
    },


    /*
     * Finds the content of the first <p> in a cell from the clicked column 
     * of the supplied row. If there's no <p>, returns the raw text of the cell.
     */
    getFirstTextFromCell = function getFirstTextFromCell(tableRow, clickedColumnIndex) {
        var $cell = $(tableRow).find('td').eq(clickedColumnIndex),
            $p = $cell.find('p');

        return $p.length ? $p.text() : $cell.text();
    },


    /*
     * Sorts the table based on the column header that was clicked.
     */
    tableSort = function tableSort(e) {
        var $clickedLink = $(e.target).closest('a'),
            $niftyTable = $clickedLink.closest('table'),
            $tableRows = $niftyTable.find('tr').has('td'),
            SORT_ASCENDING_CLASS = 'sort-ascending',
            SORT_DESCENDING_CLASS = 'sort-descending';

        columnIndex = $clickedLink.closest('th').index();

        shouldSortAscending = !($clickedLink.hasClass(SORT_ASCENDING_CLASS) || $clickedLink.hasClass(SORT_DESCENDING_CLASS)) || $clickedLink.hasClass(SORT_DESCENDING_CLASS);

        if (shouldSortAscending) $clickedLink.removeClass(SORT_DESCENDING_CLASS).addClass(SORT_ASCENDING_CLASS);else $clickedLink.removeClass(SORT_ASCENDING_CLASS).addClass(SORT_DESCENDING_CLASS);

        $clickedLink.closest('tr').find('a').not($clickedLink).removeClass(SORT_ASCENDING_CLASS).removeClass(SORT_DESCENDING_CLASS);

        $tableRows.detach();
        $tableRows.sort(clickedColumnSorter);
        $niftyTable.append($tableRows);

        resetTableStripes($tableRows, 'tr:visible:even', '#ebebeb');
        resetTableStripes($tableRows, 'tr:visible:odd', '#fff');
    },


    /*
     * Since the current table stripes are based on :nth-child(), they'll get funky
     * when the filter removes rows. So, let's reset the row striping when there's a search. 
     * This is using inline styles since there's inline CSS that sets the color and 
     * has to be overwritten.
     */
    resetTableStripes = function resetTableStripes($matches, selector, color) {
        $matches.parent().children(selector).has('td').css('background-color', color);
    },


    /*
     * Build links and attach event handlers.
     */
    init = function init() {

        var $niftyTables = $('table.nifty-table'),
            $sortableTables = $('.nifty-table').filter('.nifty-table-sortable'),
            $sortableColumnHeadings = $sortableTables.find('th');

        // Create sorting links    
        if ($sortableTables.length) {
            var $headingChildren = $sortableColumnHeadings.children();
            if ($headingChildren.length) {
                $sortableColumnHeadings.children().wrapInner('<a href="javascript:;" class="btn-sort" role="button"></a>');
            } else {
                $sortableColumnHeadings.wrapInner('<a href="javascript:;" class="btn-sort" role="button"></a>');
            }

            $sortableColumnHeadings.find('.btn-sort').on('click', tableSort);
        }
    };

    return {
        init: init
    };
}(jQuery, baltimoreCounty.utility.numericStringTools);

$(document).ready(function () {
    baltimoreCounty.niftyTables.init();
});
'use strict';

namespacer('seniorExpo');

seniorExpo.searchBoxer = function ($, window, undefined) {

	var init = function init() {
		$('#search-button').on('click', function (event) {
			var searchValue = $('#search-box').val();
			window.location = '/search-results?search=' + searchValue;
		});

		$('#search-box').on('keyup', function (event) {
			var keyCode = event.which || event.keyCode;

			if (keyCode === 13) {
				$('#search-button').trigger('click');
			}
		});
	};

	return { init: init };
}(jQuery, window);

$(function () {
	seniorExpo.searchBoxer.init();
});
'use strict';

namespacer('seniorExpo');

seniorExpo.sponsorLister = function ($, undefined) {

	var $target = void 0;

	var htmlLoadedHandler = function htmlLoadedHandler(html, htmlBuiltCallback) {
		var $table = $(html).find('#SEContentResults table'),
		    $rows = $table.find('tr').has('td'),
		    nameIndex = 0,
		    imageUrlIndex = 1,
		    websiteUrlIndex = 2,
		    orderIndex = 3;

		var sponsorData = [];

		$.each($rows, function (index, tableRow) {
			var dataItem = {
				name: $(tableRow).find('td').eq(nameIndex).text(),
				imageUrl: $(tableRow).find('td').eq(imageUrlIndex).text(),
				websiteUrl: $(tableRow).find('td').eq(websiteUrlIndex).text(),
				order: $(tableRow).find('td').eq(orderIndex).text()
			};

			sponsorData.push(dataItem);
		});

		sponsorData = sortSponsors(sponsorData);

		htmlBuiltCallback(sponsorData);
	};

	var sortSponsors = function sortSponsors(sponsorData) {
		sponsorData = sponsorData.sort(nameComparer);
		sponsorData = sponsorData.sort(orderComparer);
		return sponsorData;
	};

	var nameComparer = function nameComparer(a, b) {
		var aName = a.name.toLowerCase();
		var bName = b.name.toLowerCase();

		if (aName < bName) return -1;

		if (aName > bName) return 1;

		return 0;
	};

	var orderComparer = function orderComparer(a, b) {
		var aOrder = a.order * 1;
		var bOrder = b.order * 1;

		if (aOrder < bOrder) return -1;

		if (aOrder > bOrder) return 1;

		return 0;
	};

	var getData = function getData() {
		$.ajax('/_data/Power_of_Age_Sponsors').done(function (data) {
			htmlLoadedHandler(data, buildHtml);
		}).fail(function (errorResponse) {
			console.log(errorResponse);
		});
	};

	var buildHtml = function buildHtml(sponsorData) {
		var lineNumber = 0;
		var $wrapper = $('<div class="sponsor-row flex flex-row flex-space-around flex-wrap"></div>');

		$.each(sponsorData, function (index, sponsorItem) {
			$wrapper.append('<div class="sponsor"><a href="' + sponsorItem.websiteUrl + '" title="Visit ' + sponsorItem.name + '" target="_blank"><img src="' + sponsorItem.imageUrl + '" alt="Logo for ' + sponsorItem.name + '" /></a></div>');
		});

		$target.append($wrapper);
	};

	var init = function init() {
		$target = $('#sponsorship-list');

		if ($target.length) {
			getData();
		}
	};

	return {
		init: init
	};
}(jQuery);

$(function () {
	seniorExpo.sponsorLister.init();
});