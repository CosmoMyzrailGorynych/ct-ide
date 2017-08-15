
//   ___					   _   _  ___ 
//  / __| ___  ___ _ __   ___ | | | ||_ _|
// | (__ / _ \(_-<| '  \ / _ \| |_| | | | 
//  \___|\___//__/|_|_|_|\___/ \___/ |___|
//


$(function() {
	// ---------- Меню --------------------------------------------------------------------
	
	//Табы
	$('.tabs').delegate('[data-tab]', 'click', function() {
		var me = $(this),
			cont = me.closest('.tabs'),
			tabs = cont.next().children();
		tabs.hide().removeClass('show');
		cont.find('[data-tab]').removeClass('active');
		me.addClass('active');
		tabs.filter(me.attr('data-tab')).show().addClass('show');
	}).find('[data-tab-default]').click();
	
	// -------------------------------------------------------------------------------------
	

	// инпуты файлов
	$('.file button').click(function() {
		$(this).closest('.file').find('[type="file"]').click();
		return false;
	});

	//селекты
	var selectTransform = function() {
		var me = $(this);
		if (this.tagName.toUpperCase() == 'OPTION') {
			verst += '<li data-value="' + me.val() + '" ' + (me.attr('selected') ? 'data-selected ' : '') + 'class="option">' + me.html() + '</li>';
		} else if (this.tagName.toUpperCase() == 'OPTGROUP') {
			verst += '<ul class="optgroup>'
			me.children().each(selectTransform);
			verst += '</ul>';
		}
	}
	$('select.select').each(function() {
		verst = '<ul class="menu">';
		var me = $(this);
		me.hide().after('<div class="selectbox inline"><span></span><i class="icon icon-next"/></div>')
			.children().each(selectTransform);
		me.next().append(verst).find('[data-selected], .option:first').eq(0).each(function() {
			var me = $(this);
			me.closest('.selectbox').attr('data-value', me.attr('data-value'))
				.children('span').html(me.html());
		});
		me.next().delegate('li', 'click', function() {
			var me = $(this);
			me.closest('.selectbox').removeClass('focus').attr('data-value', me.attr('data-value'))
				.children('span').html(me.html());
			return false;
		}).click(function() {
			$(this).toggleClass('focus');
			return false;
		});
		verst += '</ul>';
	});
	$('body').on('click', function () {
	// TODO: make select blur in some other way
		$('select.select').removeClass('focus'); // почему оно не работает?!
	});

});
