jQuery(document).ready(function($){

	var menuIcons = ['fa-address-book','fa-briefcase','fa-envelope-open'];

	var menuURL = "https://jsonblob.com/api/jsonBlob/6766327f-607d-11e9-95ef-9bcb815ba4a4";
	$.ajax({url: menuURL, success: function(menuData){
		//get the main menu list and append to html 
		let menu = recurseMenu(menuData);
		$(".main-nav").append(menu);
		//get the sub menu list and append to html
		let innerMenuItems = innerMenu(menuData);
		$(".dropdown-list").append(innerMenuItems);
		//init the dropdown prototype instances
		initNavigationDropdown();
	  }});

	function recurseMenu(menuItems) {
		var s = '<ul>';
		for (var x in menuItems) {
			s += '<li class="has-dropdown gallery" data-content="' + x + '"><a href="#">' + x + '</a>';
			s += '</li>';
		}
		return s + '</ul>';
	}

	function innerMenu(menuItems){
		var inner = '<ul>';
		for(var xInner in menuItems){
			inner += '<li id="' +xInner + '" class="dropdown gallery"><a href="#" class="label">' + xInner + '</a>';
			inner += '<div class="content"><ul>';
			for(let i = 0; i < menuItems[xInner].length > 0; i++){
				inner += '<li><a href="#" class="fa ' + menuIcons[i] + '"><em>' + menuItems[xInner][i]['title'] + '</em><span>' + menuItems[xInner][i]['sub-title'] + '</span></a></li>'
			}
			inner += '</ul></div>';
			inner += '</li>';
		}
		return inner + '</ul>';
	}

	function navigationDropdown( element ) {
		this.element = element;
		this.mainNavigation = this.element.find('.main-nav');
		this.mainNavigationItems = this.mainNavigation.find('.has-dropdown');
		this.dropdownList = this.element.find('.dropdown-list');
		this.dropdownWrappers = this.dropdownList.find('.dropdown');
		this.dropdownItems = this.dropdownList.find('.content');
		this.dropdownBg = this.dropdownList.find('.bg-layer');
		this.mq = this.checkMq();
		this.bindEvents();
	}

	function initNavigationDropdown(){
		navigationDropdown.prototype.checkMq = function() {
			//check screen size
			var self = this;
			return window.getComputedStyle(self.element.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
		};
	
		navigationDropdown.prototype.bindEvents = function() {
			var self = this;
			//hover over an item in the main navigation
			this.mainNavigationItems.mouseenter(function(event){
				//hover over one of the nav items -> show dropdown
				self.showDropdown($(this));
			}).mouseleave(function(){
				setTimeout(function(){
					//if not hovering over a nav item or a dropdown -> hide dropdown
					if( self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0 ) self.hideDropdown();
				}, 50);
			});
			
			//hover over the dropdown
			this.dropdownList.mouseleave(function(){
				setTimeout(function(){
					//if not hovering over a dropdown or a nav item -> hide dropdown
					(self.mainNavigation.find('.has-dropdown:hover').length == 0 && self.element.find('.dropdown-list:hover').length == 0 ) && self.hideDropdown();
				}, 50);
			});
	
			//click on an item in the main navigation -> open a dropdown on a touch device
			this.mainNavigationItems.on('touchstart', function(event){
				var selectedDropdown = self.dropdownList.find('#'+$(this).data('content'));
				if( !self.element.hasClass('is-dropdown-visible') || !selectedDropdown.hasClass('active') ) {
					event.preventDefault();
					self.showDropdown($(this));
				}
			});
	
			//on small screens, open navigation clicking on the menu icon
			this.element.on('click', '.nav-trigger', function(event){
				event.preventDefault();
				self.element.toggleClass('nav-open');
			});
		};
	
		navigationDropdown.prototype.showDropdown = function(item) {
			this.mq = this.checkMq();
			if( this.mq == 'desktop') {
				var self = this;
				var selectedDropdown = this.dropdownList.find('#'+item.data('content')),
					selectedDropdownHeight = selectedDropdown.innerHeight(),
					selectedDropdownWidth = selectedDropdown.children('.content').innerWidth(),
					selectedDropdownLeft = item.offset().left + item.innerWidth()/2 - selectedDropdownWidth/2;
	
				//update dropdown position and size
				this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
				//add active class to the proper dropdown item
				this.element.find('.active').removeClass('active');
				selectedDropdown.addClass('active').removeClass('move-left move-right').prevAll().addClass('move-left').end().nextAll().addClass('move-right');
				item.addClass('active');
				//show the dropdown wrapper if not visible yet
				if( !this.element.hasClass('is-dropdown-visible') ) {
					setTimeout(function(){
						self.element.addClass('is-dropdown-visible');
					}, 10);
				}
			}
		};
	
		navigationDropdown.prototype.updateDropdown = function(dropdownItem, height, width, left) {
			this.dropdownList.css({
				'-moz-transform': 'translateX(' + left + 'px)',
				'-webkit-transform': 'translateX(' + left + 'px)',
				'-ms-transform': 'translateX(' + left + 'px)',
				'-o-transform': 'translateX(' + left + 'px)',
				'transform': 'translateX(' + left + 'px)',
				'width': width+'px',
				'height': height+'px'
			});
	
			this.dropdownBg.css({
				'-moz-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
				'-webkit-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
				'-ms-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
				'-o-transform': 'scaleX(' + width + ') scaleY(' + height + ')',
				'transform': 'scaleX(' + width + ') scaleY(' + height + ')'
			});
		};
	
		navigationDropdown.prototype.hideDropdown = function() {
			this.mq = this.checkMq();
			if( this.mq == 'desktop') {
				this.element.removeClass('is-dropdown-visible').find('.active').removeClass('active').end().find('.move-left').removeClass('move-left').end().find('.move-right').removeClass('move-right');
			}
		};
	
		navigationDropdown.prototype.resetDropdown = function() {
			this.mq = this.checkMq();
			if( this.mq == 'mobile') {
				this.dropdownList.removeAttr('style');
			}
		};
	
		var navigationDropdowns = [];
		if( $('.ad-nav-dropdown').length > 0 ) {
			$('.ad-nav-dropdown').each(function(){
				//create a navigationDropdown object for each .ad-nav-dropdown
				navigationDropdowns.push(new navigationDropdown($(this)));
			});
	
			var resizing = false;
	
			//on resize, reset dropdown style property
			updateDropdownPosition();
			$(window).on('resize', function(){
				if( !resizing ) {
					resizing =  true;
					(!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
				}
			});
	
			function updateDropdownPosition() {
				navigationDropdowns.forEach(function(element){
					element.resetDropdown();
				});
	
				resizing = false;
			};
		}
	}
});