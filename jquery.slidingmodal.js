/* example for calling

$.slidingModal({
	startClosed: true,
	bannerImg: "url.to.skinny.image",
	bannerArrowImg: "url.to.arrow.icon",
	modalImg: "url.to.big.image",
	modalLink: "modalImg click href", <-- higher precedence than modalInfo
	modalInfo: "<h1>hello friends</h1>" <-- foundation reval modal content
});

*/
$.slidingModal = (function() {
	var $body = $(document.body);

	var _sliders = [];

	$(function() {
		var $slider = _sliders[_sliders.lenth - 1];
		$slider && $body.append(slider);
	});

	$('<style/>').html([
		".slidingModal {",
		"	width: 100vw;",
		"	position: fixed;",
		"	bottom: 0;",
		"	z-index: 100;",
		"}",
		".slidingModal--lightbox {",
		"	potision: fixed;",
		"	width: 100vw;",
		"	height: 100vh;",
		"	background: rgba(0,0,0,0.6);",
		"}",
		".slidingModal.closed .slidingModal--lightbox {",
		"	display: none;",
		"}",
		".slidingModal img {",
		"	max-width: 100%;",
		"}",
		".slidingModal--banner {",
		"	position: relative;",
		"}",
		".slidingModal--bannerArrow {",
		"	position: absolute;",
		"	right: 2%;",
		"	top: 15%;",
		"	height: 70%;",
		"	transition: transform .6s;",
		"	transform: rotateZ(180deg);",
		"}",
		".slidingModal.closed .slidingModal--bannerArrow {",
		"	transform: rotateZ(0deg);",
		"}",
		".slidingModal--modal {",
		"	max-height: 300px;",
		"	transition: max-height .8s;",
		"}",
		".slidingModal.closed .slidingModal--modal {",
		"	max-height: 0;",
		"}"
	].join('')).appendTo($body);

	return function(options) {
		var $container = $('<div/>')
		.addClass('slidingModal')
		.toggleClass('closed', options.startClosed);

		var $lightbox = $('<div/>')
		.addClass('slidingModal--lightbox')

		var $banner = $('<div/>')
		.addClass('slidingModal--banner');

		var $bannerImg = $('<img/>')
		.addClass('slidingModal--bannerImg')
		.attr('src', options.bannerImg);

		var $bannerArrow = $('<img/>')
		.addClass('slidingModal--bannerArrow')
		.attr('src', options.bannerArrowImg);

		var $modal = $('<div/>')
		.addClass('slidingModal--modal')

		var $modalImg = $('<img/>')
		.addClass('slidingModal--modalImg')
		.attr('src', options.modalImg);

		var $modalLink = $('<a/>')
		.addClass('slidingModal--modalLink');

		if (options.modalHref) {
			$modalLink
			.attr('href', options.modalHref)
			.append($modalImg)
			.on('click', function(e) {
				e.stopPropagation();
			})
			.appendTo($modal);
		} else if (options.modalInfo) {
			var $modalInfo = $('<div id="shrinkingSliverModal" class="reveal-modal modal-padding" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">')
			.append(options.modalInfo)
			.append($('<a class="close-reveal-modal" aria-label="Close">x</a>'))
			.appendTo($modal);

			$modalLink
			.attr('href', '#')
			.attr('data-reveal-id', 'shrinkingSliverModal')
			.append($modalImg)
			.appendTo($modal);
		} else {
			$modalImg.appendTo($modal);
		}

		$container.append(
			$lightbox.on('scroll touchmove', function() {
				$container.addClass('closed');
			}),
			$banner.append(
				$bannerImg,
				$bannerArrow
			),
			$modal
		).on('click', (function($container) {
			return function(e) {
				$container.toggleClass('closed');
			}
		}($container)));

		_sliders = _sliders.concat($container);
	}
}());
