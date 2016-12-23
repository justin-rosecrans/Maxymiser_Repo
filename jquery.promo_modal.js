(function($) {
	var $body = $(document.body);

	$('<style/>').html([
		'.modal {',
			'background: rgba(0,0,0,0.75)',
			'height: 100vh',
			'left: 0',
			'padding-top: 100px',
			'position: fixed',
			'text-align: center',
			'top: 0',
			'width: 100vw',
			'z-index: 9001',
		'}',
		'.modal .modal--stage {',
			'display: inline-block',
			'margin: 0 40px',
			'position: relative',
			'userSelect: none'
		'}',
		'.modal .modal--closer {',
			'background: #ddd',
			'border-radius: 100em',
			'color: black',
			'cursor: pointer',
			'font-family: Helvetica',
			'font-size: 1.5rem',
			'font-style: italic',
			'outline: none',
			'padding: .15em .6em .3em .5em',
			'position: absolute',
			'right: 0',
			'top: 0',
			'transform: translate(50%, -50%)',
		'}',
		'.modal .modal--img {',
			'boxShadow: -5px 5px 3px rgba(0,0,0,1)',
			'maxWidth: calc(100vw - 80px)',
		'}'
	].join('')).appendTo($body)

	/**
	 * Call like so: `$.promo_modal(options)`
	 * where `options` = {
	 *   id: "unique id" <- REQUIRED
	 *   imgSrc: "url to image" <- REQUIRED
	 *   imgHref: "url to go to on click" <- Optional
	 *   sliver: "#selector" <- Optional. Clicking assoc. element will show modal
	 * }
	 * Only the LAST registered modal will show, and only if it hasn't been seen before
	**/
	$.promo_modal = (function() {
		var _key = 'promotional_modals'
		var _modals = []

		// Get list of all modals already seen
		function getSession() {
			var session = sessionStorage.getItem(_key)
			return session ? JSON.parse(session) : []
		}

		// Check if a modal is seen
		function isInSession(id) {
			return getSession().indexOf(id) !== -1
		}

		// Mark a modal as being seen
		function addToSession(id) {
			if(!isInSession(id)) {
				var nextSession = JSON.stringify(getSession().concat(id))
				sessionStorage.setItem(_key, nextSession)
			}
		}

		$(function() {
			// Last registered modal
			var modal = _modals[_modals.length - 1]

			if(modal && !isInSession(modal.id)) {
				modal.show()
			}

			// Mark all modals as seen
			_modals.forEach(function(modal) {
				addToSession(modal.id)
			})
		})

		return function(options) {
			if (!options.imgSrc) {
				return console.warn('Oops! Cannot register a modal without `options.imgSrc`')
			}

			if (!options.id) {
				return console.warn('Oops! Cannot register a modal without a unique `options.id`')
			}

			if (options.excludedPSIDs) {
				var excludes = options.excludedPSIDs.split(',')
				var siteId = TCS.SiteID || TCS.TcsProps.Site.SiteID.toString()
				if (excludes.indexOf(siteId) !== -1) {
					return console.info('Registered modal', options.id, 'was blocked on this SiteID')
				}
			}

			var $modal = $('<div/>')
			.addClass('modal')
			.data('modal-id', options.id)

			var $stage = $('<div/>')
			.addClass('modal--stage')

			var $closer = $('<button/>')
			.text('X')
			.addClass('modal--closer')

			var $img = $('<img/>')
			.addClass('modal--img')
			.attr('src', options.imgSrc)

			var hide = $modal.hide.bind($modal)
			var show = $modal.show.bind($modal)

			$modal.append(
				$stage.append(
					$closer.on('click', hide),
					(options.imgHref
						? $('<a/>').attr('href', options.imgHref).append($img)
						: $img.on('click', hide)
					)
				)
			).hide().on('click', hide).appendTo($body)

			// Last modal registered to a specific sliver keeps that click behavior
			$(options.sliver).off('click').on('click', show)

			$body.on('keypress', function(e) {
				// hide on ESC
				e.keyCode == 27 && hide()
			})

			// Store with global record of all modals
			_modals = _modals.concat({
				id: options.id,
				show: show
			})
		}
	}());
}(window.jQuery));
