namespacer('seniorExpo');

seniorExpo.searchBoxer = (($, window, undefined) => {

	const init = () => {
		$('#search-button').on('click', event => {
			const searchValue = $('#search-box').val();
			window.location = '/search-results?search=' + searchValue;
		});

		$('#search-box').on('keyup', event => {
			const keyCode = event.which || event.keyCode;

			if (keyCode === 13) {
				$('#search-button').trigger('click');
			}
		});
	};

	return { init };

})(jQuery, window);

$(() => {
	seniorExpo.searchBoxer.init();
});
