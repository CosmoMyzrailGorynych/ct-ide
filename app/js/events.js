/*
    ___                 _       
   | __|__ __ ___  _ _ | |_  ___
   | _| \ V // -_)| ' \|  _|(_-<
   |___| \_/ \___||_||_|\__|/__/

	Searchables:
	  — $main menu
	  — $notepad
	  — $intro
	  — $settings
	  — $modules
	  — $graphs
	  — $types
	  — $sounds
	  — $styles
	  — $rooms

*/
$(function () {
	$('[data-input]').change(function () {
		try {
			// won't work with arrays...
			/*
			var me = $(this),
				arr = me.attr('data-input').split('.');
			context = window;
			for (var i = 0; i < arr.length - 1; i++) {
				context = context[arr[i]];
			}
			context[arr[arr.length - 1]] = me.val();
			*/
			var me = $(this);
			if (me.attr('type') == 'text' || !me.attr('type')) {
				eval(me.attr('data-input') +' = "'+ me.val().replace(/\"/g,'\\"')+ '"');
			} else {
				eval(me.attr('data-input') +' = '+ me.val());
			}
		}
		catch (err) {
			console.error(err);
			document.getElementById('scream').play();
		}
	});
});

/* templates */

tmpl = {
	graph: '<li data-graph="{2}"><span>{0}</span><img src="{1}"/></li>',
	type: '<li data-type="{2}"><span>{0}</span><img src="{1}"/></li>',
	sound: '<li data-sound="{2}" style="background-image: url({1});"><span>{0}</span><img src="{1}"/></li>',
	style: '<li data-style="{2}"><span>{0}</span><img src="{1}"/></li>',
	room: '<li data-room="{2}"><img src="{1}"/></li><span>{0}</span>'
};


/* some patterns */
apatterns = {
	SymbolDigitUnderscore: /[^qwertyuiopasdfghjklzxcvbnm1234567890_]/gi
}
patterns = {
	images: /\.(jpg|gif|png|jpeg)/gi
}

/*
	temporary global objects for editing:
	
	currentGraphic = {};
	currentType = {};
	currentSound = {};
	currentRoom = {};
	currentStyle = {};
	currentMod = {};
	currentProject = {};
*/
events = {
	// $main menu
	"fullscreen": function () {
		win.toggleFullscreen();
		$('#fullscreen .icon').toggleClass('icon-minimize').toggleClass('icon-maximize');
	},
	"ct": function (e) {
		catMenu.popup(e.clientX, e.clientY);
	},
	"save": function () {
		fs.outputJSON(projdir + '.ict', currentProject, function (e) {
			if (e) {
				throw e;
			}
			alertify.log(languageJSON.common.savedcomm,"success",3000);
		})
	},
	// $notepad
	"notepadToggle": function () {
		var pad = $('#notepad');
		if (pad.hasClass('opened')) {
			pad.css('left',(window.innerWidth + 'px'));
			pad.removeClass('opened');
		} else {
			pad.css('left',(window.innerWidth - pad.width()) + 'px');
			pad.addClass('opened');
		}
	},

	// $intro
	"newProject": function () {
		currentProject = {
			'info': 'New Project',
			'notes': '***empty***',
			'libs': {},
			'graphs': [],
			'types': [],
			'sounds': [],
			'styles': [],
			'rooms': [],
			'graphtick': 0,
			'soundtick': 0,
			'roomtick': 0,
			'typetick': 0,
			'styletick': 0,
			'starting': 0,
			'codename': $('#id').val()
		};
		fs.writeJSON(way + '/' + currentProject.codename + '.ict', currentProject, function (e) {
			if (e) {
				throw e;
			}
		});
		projdir = way + '/' + currentProject.codename;
		projname = currentProject.codename + '.ict';
		fs.ensureDir(projdir);
		fs.ensureDir(projdir+'/img');
		fs.ensureDir(projdir+'/snd');
		megacopy(assets + '/img/nograph.png', projdir + '/img/splash.png')
		events.loadProject();
	},
	"loadProject": function () {
		$('#rooms ul, #types ul, #graphs ul, #styles ul, #sounds ul, #modulelist, #moduleincluded').empty();

		events.fillProjectSettings();
		events.fillModuleList();
		events.fillGraphs();
		events.fillTypes();
		events.fillSounds();
		events.fillStyles();
		events.fillRooms();

		if (glob.lastProjects.indexOf(projdir + '.ict') !== -1) {
			glob.lastProjects.splice(glob.lastProjects.indexOf(projdir + '.ict'),1);
		}
		glob.lastProjects.unshift(projdir + '.ict');
		if (glob.lastProjects.length > 15) {
			glob.lastProjects.pop();
		}
		localStorage.lastProjects = glob.lastProjects.join(';');

		$('#intr').fadeOut(350);
	},
	"previewProject": function (src) {
		$('#previewProject').html('<img src="{0}" />'.f(src))
		.find('img').hide().fadeIn(350);
	},
	// 'change' event of input[type="file"] field
	"openProjectFind": function (me) {
		if (path.extname(me.val()).toLowerCase() == '.ict') {
			fs.readFile(me.val(), function (err, data) {
				if (err) {
					throw err;
				}
				projname = path.basename(me.val());
				projdir = path.dirname(me.val()) + path.sep + path.basename(me.val(), '.ict');
				currentProject = JSON.parse(data);
				me.val('');
				events.loadProject();
			});
		} else {
			// TODO: modals
			alert(languageJSON.common.wrongFormat);
		}
	},
	// $settings
	"fillProjectSettings": function () {
		$('#settings [data-input]:not([type="checkbox"], [type="radio"])').each(function () {
			me = $(this);
			me.val(eval(me.attr('data-input'))); // D:
		});
		$('#settings [data-input]').filter('[type="checkbox"], [type="radio"]').each(function () {
			me = $(this);
			me.prop("checked", eval(me.attr('data-input'))); // D:
		});
	},
	// $modules
	"fillModuleList": function () {
		fs.readdir(exec + '/ct.libs', function (err, files) {
			if (err) {
				throw err;
			}
			$('#modulelist, #moduleincluded').children().remove();
			for (var i = 0; i < files.length; i++) {
				if (path.extname(files[i]) == '.json') {
					var q = path.basename(files[i], '.json');
					if (currentProject.libs[q]) {
						$('#modulelist').append('<li><i class="icon icon-confirm" /><span>{0}</span></li>'.f(q));
						$('#moduleincluded').append('<li><i class="icon icon-confirm" /><span>{0}</span></li>'.f(q));
					} else {
						$('#modulelist').append('<li><i class="icon icon-share" /><span>{0}</span></li>'.f(q));
					}
				}
			}
		});
	},
	"openModules": function () {
		$('#modules .borderright li:eq(0)').click();
	},
	"toggleModule": function () {
		if (currentProject.libs[currentModName]) {
			delete currentProject.libs[currentModName];
		} else {
			currentProject.libs[currentModName] = {};
		}
		events.renderMod(currentModName);
		events.fillModuleList();
	},
	"renderMod": function (name) {
		fs.readFile(exec + '/ct.libs/' + name + '.json', function (err, data) {
			if (err) {
				throw err;
			}
			currentMod = JSON.parse(data);
			currentModName = name;

			// super-duper button
			if (currentProject.libs[currentModName]) {
				$('#moduleinfo .bigpower').removeClass('off');
			} else {
				$('#moduleinfo .bigpower').addClass('off');
			}

			// 'Info' page
			$('#modname span:eq(0)').text(currentMod.main.name);
			$('#modname span:eq(1)').text(currentMod.main.version);
			$('#modauthor').text(currentMod.info.author);
			$('#modsite').attr('href',currentMod.info.site);
			if (currentMod.injects) {
				$('#modinjects').show();
			} else {
				$('#modinjects').hide();
			}
			if (currentMod.fields) {
				$('#modconfigurable').show();
			} else {
				$('#modconfigurable').hide();
			}
			$('#modinfohtml').children().remove();
			//description
			$('#modinfohtml').append('<p>{0}</p>'.f(markdown.toHTML(currentMod.main.help)));
			if (currentMod.main.license) {
				$('#modinfohtml').append('<h1>{1}</h1><p>{0}</p>'.f(markdown.toHTML(currentMod.main.license),languageJSON.modules.license));
			}
			preparetext('#modinfohtml');

			// 'Settings' page
			$('#modulesettings').children().remove();
			if (currentMod.fields && currentProject.libs[name]) {
				for (var k in currentMod.fields) {
					if (!currentProject.libs[name][k]) {
						if (currentMod.fields[k].default) {
							currentProject.libs[name][k] = currentMod.fields[k].default;
						} else {
							if (currentMod.fields[k].type == 'number') {
								currentProject.libs[name][k] = 0;
							} else if (currentMod.fields[k].type == 'checkbox') {
								currentProject.libs[name][k] = false;
							} else {
								currentProject.libs[name][k] = '';
							}
						}
					}
					if (currentMod.fields[k].type == 'textfield') {
						$('#modulesettings').append('<dl><dd>{0}</dd><dt><textarea data-input="{1}"></textarea><div class="desc">{2}</div></dt></dl>'.f(
							currentMod.fields[k].name,
							'currentProject.libs.'+name,
							currentMod.fields[k].help ? markdown.toHTML(currentMod.fields[k].help) : ''
						));
						$('#modulesettings input:last').val(currentProject.libs[name][k]);
					} else if (currentMod.fields[k].type == 'number') {
						$('#modulesettings').append('<dl><dd>{0}</dd><dt><input type="number" data-input="{1}" /><div class="desc">{2}</div></dt></dl>'.f(
							currentMod.fields[k].name,
							'currentProject.libs.'+name,
							currentMod.fields[k].help ? markdown.toHTML(currentMod.fields[k].help) : ''
						));
						$('#modulesettings input:last').val(currentProject.libs[name][k]);
					} else if (currentMod.fields[k].type == 'checkbox') {
						$('#modulesettings').append('<dl><dd>{0}</dd><dt><input type="checkbox" data-input="{1}" /><div class="desc">{2}</div></dt></dl>'.f(
							currentMod.fields[k].name,
							'currentProject.libs.'+name,
							currentMod.fields[k].help ? markdown.toHTML(currentMod.fields[k].help) : ''
						));
						$('#modulesettings input:last').prop('checked',currentProject.libs[name][k]);
					} else {
						$('#modulesettings').append('<dl><dd>{0}</dd><dt><input type="text" data-input="{1}" /><div class="desc">{2}</div></dt></dl>'.f(
							currentMod.fields[k].name,
							'currentProject.libs.'+name,
							currentMod.fields[k].help ? markdown.toHTML(currentMod.fields[k].help) : ''
						));
						$('#modulesettings input:last').val(currentProject.libs[name][k]);
					}
				}
				preparetext('#modsettings');
				$('#modsettings').show();
			} else {
				$('#modsettings').hide();
			}

			// 'Reference' page
			var html = '';
			if (currentMod.methods) {
				html += '<h1>{0}</h1>'.f(languageJSON.modules.methods);
				for (i in currentMod.methods) {
					// TODO: escape
					html += '<h2 class="copyme">ct.{0}.{1}</h2>'.f(name, i);
					if (currentMod.methods[i].exp) html += '<p>{0}</p>'.f(markdown.toHTML(currentMod.methods[i].exp));
				}
			}
			if (currentMod.params) {
				html += '<h1>{0}</h1>'.f(languageJSON.modules.parameters);
				for (i in currentMod.params) {
					// TODO: escape
					html += '<h2 class="copyme">ct.{0}.{1}</h2>'.f(name, i);
					if (currentMod.params[i].exp) html += '<p>{0}</p>'.f(markdown.toHTML(currentMod.params[i].exp));
				}
			}
			$('#modulehelp').children().remove();
			$('#modulehelp').append(html);
			if (!(currentMod.params || currentMod.methods)) {
				$('#modhelp').hide();
			} else {
				$('#modhelp').show();
			}

			// 'Logs' page
			if (currentMod.logs) {
				$('#modulelogs').html(markdown.toHTML(currentMod.logs));
				$('#modlogs').show();
			} else {
				$('#modlogs').hide();
			}
			$('#modinfo').click();
		});
	},
	// $graphs
	"fillGraphs": function () {
		$('#graphic ul').children().remove();
		for (var i = 0; i < currentProject.graphs.length; i++) {
			$('#graphic ul').append(tmpl.graph.f(
				currentProject.graphs[i].name,
				projdir + '/img/' + currentProject.graphs[i].origname + '_prev.png',
				i
			));
		}
	},
	"launchGraphPreview": function () {
		if (glob.prev.time) {
			window.clearTimeout(glob.prev.time);
		}
		var kw, kh, w, h, k;

		glob.prev.pos = 0;

		kw = Math.min($('#preview').width() / (graphCanvas.img.width / currentGraphic.grid[0]), 1);
		kh = Math.min($('#preview').height() / (graphCanvas.img.height / currentGraphic.grid[1]), 1);
		k = Math.min(kw,kh);
		w = Math.floor(k * graphCanvas.img.width / currentGraphic.grid[0]);
		h = Math.floor(k * graphCanvas.img.height / currentGraphic.grid[1]);
		grprCanvas.width = w;
		grprCanvas.height = h;

		$('#graphplay i').removeClass('icon-play').addClass('icon-pause');
		glob.prev.playing = true;

		events.stepGraphPreview();
	},
	"stopGraphPreview": function () {
		window.clearTimeout(glob.prev.time);
		$('#graphplay i').removeClass('icon-pause').addClass('icon-play');
		glob.prev.playing = false;
	},
	"currentGraphicPreviewPlay": function () {
		if (glob.prev.playing) {
			events.stopGraphPreview();
		} else {
			events.launchGraphPreview();
		}
	},
	"stepGraphPreview": function () {
		glob.prev.time = window.setTimeout(function () {
			var total = Math.min(currentGraphic.untill === 0 ? currentGraphic.grid[0]*currentGraphic.grid[1] : currentGraphic.untill,currentGraphic.grid[0]*currentGraphic.grid[1]);
			glob.prev.pos ++;
			if (glob.prev.pos >= total) {
				glob.prev.pos = 0;
			}
			grprCanvas.x.clearRect(0,0,grprCanvas.width, grprCanvas.height);
			grprCanvas.x.drawImage (graphCanvas.img,
									(glob.prev.pos % currentGraphic.grid[0]) * graphCanvas.img.width/currentGraphic.grid[0],
									(~~(glob.prev.pos / currentGraphic.grid[0])) * graphCanvas.img.height/currentGraphic.grid[1],
									graphCanvas.img.width/currentGraphic.grid[0],
									graphCanvas.img.height/currentGraphic.grid[1],
									0,
									0,
									grprCanvas.width,
									grprCanvas.height);
			$('#graphviewframe').text('{0} / {1}'.f(glob.prev.pos, total));
			events.stepGraphPreview();
		},~~(1000 / $('#grahpspeed').val()));
	},
	"currentGraphicPreviewBack": function () {
		glob.prev.pos--;
		var total = Math.min(currentGraphic.untill === 0 ? currentGraphic.grid[0]*currentGraphic.grid[1] : currentGraphic.untill,currentGraphic.grid[0]*currentGraphic.grid[1]);
		if (glob.prev.pos < 0) {
			glob.prev.pos = currentGraphic.untill === 0 ? currentGraphic.grid[0]*currentGraphic.grid[1] : total - 0;
		}
		grprCanvas.x.clearRect(0,0,grprCanvas.width, grprCanvas.height);
		grprCanvas.x.drawImage (graphCanvas.img,
								(glob.prev.pos % currentGraphic.grid[0]) * graphCanvas.img.width/currentGraphic.grid[0],
								(~~(glob.prev.pos / currentGraphic.grid[0])) * graphCanvas.img.height/currentGraphic.grid[1],
								graphCanvas.img.width/currentGraphic.grid[0],
								graphCanvas.img.height/currentGraphic.grid[1],
								0,
								0,
								grprCanvas.width,
								grprCanvas.height);
		$('#graphviewframe').text('{0} / {1}'.f(glob.prev.pos, total));
	},
	"currentGraphicPreviewNext": function () {
		glob.prev.pos ++;
		var total = Math.min(currentGraphic.untill === 0 ? currentGraphic.grid[0]*currentGraphic.grid[1] : currentGraphic.untill,currentGraphic.grid[0]*currentGraphic.grid[1]);
		if (glob.prev.pos >= total) {
			glob.prev.pos = 0;
		}
		grprCanvas.x.clearRect(0,0,grprCanvas.width, grprCanvas.height);
		grprCanvas.x.drawImage (graphCanvas.img,
								(glob.prev.pos % currentGraphic.grid[0]) * graphCanvas.img.width/currentGraphic.grid[0],
								(~~(glob.prev.pos / currentGraphic.grid[0])) * graphCanvas.img.height/currentGraphic.grid[1],
								graphCanvas.img.width/currentGraphic.grid[0],
								graphCanvas.img.height/currentGraphic.grid[1],
								0,
								0,
								grprCanvas.width,
								grprCanvas.height);
		$('#graphviewframe').text('{0} / {1}'.f(glob.prev.pos, total));
	},
	"openGraph": function (graph) {
		$('#graphview').show();

		currentGraphic = currentProject.graphs[graph];
		currentGraphicId = graph;

		var img = document.createElement('img');
		img.onload = function () {
			currentGraphic.width = this.width;
			currentGraphic.height = this.height;
			events.refreshGraphCanvas();
		};
		img.onerror = function () {
			// TODO: l10n + modals
			alert('File not found or corrupt! Leaving now.');
			events.graphicSave();
		};
		img.src = projdir + '/img/' + currentGraphic.origname;
		graphCanvas.img = img;

		// map values
		$('#graphname').val(currentGraphic.name ? currentGraphic.name : '');
		$('#graphx').val(currentGraphic.axis[0] ? currentGraphic.axis[0] : 0);
		$('#graphy').val(currentGraphic.axis[1] ? currentGraphic.axis[1] : 0);
		$('#graphrad').val(currentGraphic.r ? currentGraphic.r : 0);
		$('#graphtop').val(currentGraphic.top ? currentGraphic.top : 0);
		$('#graphleft').val(currentGraphic.left ? currentGraphic.left : 0);
		$('#graphright').val(currentGraphic.right ? currentGraphic.right : 0);
		$('#graphbottom').val(currentGraphic.bottom ? currentGraphic.bottom : 0);
		$('#graphcols').val(currentGraphic.grid[0] ? currentGraphic.grid[0] : 1);
		$('#graphrows').val(currentGraphic.grid[1] ? currentGraphic.grid[1] : 1);
		$('#graphframes').val(currentGraphic.frames ? currentGraphic.frames : 0);

		if (currentGraphic.shape == "rect") {
			$('#graphviewshaperectangle').click();
		} else {
			$('#graphviewshaperound')[0].click();
		}
		$('#grahpspeed').val(10);
		events.launchGraphPreview();
	},
	"graphicShowCircle": function () {
		$('#graphviewround').show();
		$('#graphviewrect').hide();
		if (currentGraphic.r == 0 || !currentGraphic.r)  {
			r = Math.min(Math.floor(currentGraphic.width / currentGraphic.grid[0] / 2),
						 Math.floor(currentGraphic.height / currentGraphic.grid[1] / 2));
		}
	},
	"graphicShowRect": function () {
		$('#graphviewround').hide();
		$('#graphviewrect').show();
	},
	"graphicFillRect": function () {
		currentGraphic.left = ~~(currentGraphic.axis[0]);
		currentGraphic.top = ~~(currentGraphic.axis[1]);
		currentGraphic.right = ~~(currentGraphic.width / currentGraphic.grid[0] - currentGraphic.axis[0]);
		currentGraphic.bottom = ~~(currentGraphic.height / currentGraphic.grid[1] - currentGraphic.axis[1]);
		$('#graphtop').val(currentGraphic.top);
		$('#graphleft').val(currentGraphic.left);
		$('#graphright').val(currentGraphic.right);
		$('#graphbottom').val(currentGraphic.bottom);
		events.refreshGraphCanvas();
	},
	"graphicCenter": function () {
		currentGraphic.axis[0] = Math.floor(currentGraphic.width / currentGraphic.grid[0] / 2);
		currentGraphic.axis[1] = Math.floor(currentGraphic.height / currentGraphic.grid[1] / 2);
		$('#graphx').val(currentGraphic.axis[0]);
		$('#graphy').val(currentGraphic.axis[1]);
		events.refreshGraphCanvas();
	},
	"graphicSave": function () {
		events.graphGenPreview();
		$('#graphview').hide();
	},
	"refreshGraphCanvas": function () {
		var kw, kh, w, h, k, i;

		kw = Math.min(($('#atlas').width()-40) / graphCanvas.img.width, 1);
		kh = Math.min(($('#atlas').height()-40) / graphCanvas.img.height, 1);
		k = Math.min(kw,kh);
		w = Math.floor(k * graphCanvas.img.width);
		h = Math.floor(k * graphCanvas.img.height);
		graphCanvas.width = w;
		graphCanvas.height = h;
		graphCanvas.x.strokeStyle = "#0ff";
		graphCanvas.x.lineWidth = 1;
		graphCanvas.x.globalCompositeOperation = 'source-over';
		graphCanvas.x.clearRect(0,0,w,h);
		graphCanvas.x.drawImage(graphCanvas.img,0,0,w,h);
		graphCanvas.x.globalCompositeOperation = 'lighter';
		graphCanvas.x.globalAlpha = 1;

		// 0 - cols
		// 1 - rows

		// cols
		for (i = 0; i <= currentGraphic.grid[0]; i++) {
			graphCanvas.x.beginPath();
			graphCanvas.x.moveTo(i*graphCanvas.img.width*k/currentGraphic.grid[0],0);
			graphCanvas.x.lineTo(i*graphCanvas.img.width*k/currentGraphic.grid[0],h);
			graphCanvas.x.stroke();
		}
		//rows
		for (i = 0; i <= currentGraphic.grid[1]; i++) {
			graphCanvas.x.beginPath();
			graphCanvas.x.moveTo(0,i*graphCanvas.img.height*k/currentGraphic.grid[1]);
			graphCanvas.x.lineTo(w,i*graphCanvas.img.height*k/currentGraphic.grid[1]);
			graphCanvas.x.stroke();
		}

		graphCanvas.x.strokeStyle = "#f00";
		// horisontal
		graphCanvas.x.beginPath();
		graphCanvas.x.moveTo(0,currentGraphic.axis[1]*k);
		graphCanvas.x.lineTo(graphCanvas.img.width*k/currentGraphic.grid[0],currentGraphic.axis[1]*k);
		graphCanvas.x.stroke();
		// vertical
		graphCanvas.x.beginPath();
		graphCanvas.x.moveTo(currentGraphic.axis[0]*k,0);
		graphCanvas.x.lineTo(currentGraphic.axis[0]*k,graphCanvas.img.height*k/currentGraphic.grid[1]);
		graphCanvas.x.stroke();
		// shape
		graphCanvas.x.globalAlpha = 0.5;
		graphCanvas.x.fillStyle = '#ff0';
		if (currentGraphic.shape == 'rect') {
			graphCanvas.x.fillRect ((currentGraphic.axis[0]-currentGraphic.left)*k,
									(currentGraphic.axis[1]-currentGraphic.top)*k,
									(currentGraphic.right+currentGraphic.left)*k,
									(currentGraphic.bottom+currentGraphic.top)*k);
		} else {
			graphCanvas.x.beginPath();
			graphCanvas.x.arc(currentGraphic.axis[0]*k,currentGraphic.axis[1]*k,currentGraphic.r*k,0,2*Math.PI);
			graphCanvas.x.fill();
		}
		// unused frames
		if (currentGraphic.untill !== 0) {
			graphCanvas.x.globalAlpha = 0.5;
			graphCanvas.x.fillStyle = '#f00';
			for (var i = currentGraphic.untill; i < currentGraphic.grid[0]*currentGraphic.grid[1]; i++) {
				graphCanvas.x.fillRect (w/currentGraphic.grid[0]*(i%currentGraphic.grid[0]),
									h/currentGraphic.grid[1]*(~~(i/currentGraphic.grid[0])),
									w/currentGraphic.grid[0],
									h/currentGraphic.grid[1]);
			}
		}

		events.launchGraphPreview();
	},
	graphicImport: function (me) { // input[type="file"]
		var i;
		files = me.val().split(';');
		for (i = 0; i < files.length; i++) {
			if (/\.(jpg|gif|png|jpeg)/gi.test(files[i])) {
				console.log(i, files[i], 'passed');
				currentProject.graphtick ++;
				events.loadImg(i,files[i],projdir+'/img/i'+ currentProject.graphtick +path.extname(files[i]));
			} else {
				console.log(i, files[i], 'NOT passed');
			}
		}
	},
	"loadImg": function (myi, filename, dest) {
		console.log(myi, filename, 'copying');
		// TODO: resolve duplicates (overwriting one over another)
		megacopy(filename,dest, function (e) {
			console.log(myi, filename, 'copy finished');
			if (e) throw e;
			imga = document.createElement('img');
			imga.onload = function () {
				var obj = {
					name: path.basename(filename).replace(patterns.images, '').replace(/\s/g,'_'),
					untill: 0,
					grid: [1, 1],
					axis: [0, 0],
					origname: path.basename(dest),
					shape: "rect",
					left: 0,
					right: this.width,
					top: 0,
					bottom: this.height
				};
				$('#graphic .cards').append(tmpl.graph.f(
					obj.name,
					projdir + '/img/' + obj.origname,
					currentProject.graphs.length
				));
				this.id = currentProject.graphs.length;
				currentProject.graphs.push(obj);
				events.imgGenPreview(dest, dest + '_prev.png', function () {
					console.log(myi, filename, 'preview generated');
					$('#graphic .cards li[data-graph="{0}"] img'.f(this.id)).attr('src', dest + '_prev.png');
				});
			}
			imga.onerror = function (e) {
				console.log('ERROR');
			}
			imga.src = dest;
		});
	},
	"imgGenPreview": function (source,name,cb) {
		var imga = document.createElement('img');
		imga.onload = function () {
			var c = document.createElement('canvas');
			c.x = c.getContext('2d');
			c.width = c.height = 64;
			c.x.clearRect(0,0,64,64);
			c.x.drawImage(this,0,0,64,64);
			// strip off the data: url prefix to get just the base64-encoded bytes
			var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
			var buf = new Buffer(data, 'base64');
			fs.writeFile(name, buf, function(err) {
				if (err) {
					console.log(err);
				}
				else {
					cb();
				}
			});
			$(c).remove(); // is needed?
		}
		imga.src = source;
	},
	"graphGenPreview": function () {
		var c = document.createElement('canvas');
		c.x = c.getContext('2d');
		c.width = c.height = 64;
		c.x.clearRect(0,0,64,64);
		c.x.drawImage(graphCanvas.img,
					  0,
					  0,
					  graphCanvas.img.width/currentGraphic.grid[0],
					  graphCanvas.img.height/currentGraphic.grid[1],
					  0,
					  0,
					  64,
					  64);
		var data = c.toDataURL().replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		fs.writeFile(projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev.png', buf, function(err) {
			if (err) {
				console.log(err);
			}
			console.log('new thumbnail', projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev.png');
			$('#graphic .cards li[data-graph="{0}"] img'.f(currentGraphicId)).attr('src','').attr('src',projdir + '/img/' + currentProject.graphs[currentGraphicId].origname + '_prev.png');
		});
		$(c).remove(); // is needed?
	},
	// $types
	"fillTypes": function () {
		for (var i = 0; i < currentProject.types.length; i++) {
			$('#types ul').append(tmpl.type.f(
				currentProject.types[i].name,
				currentProject.types[i].graph == -1 ? projdir + '/img/' + currentProject.graphs[currentProject.types[i].graph].origname + '_prev.png' : assets + '/img/nograph.png',
				i
			));
		}
	},
	// $sounds
	"fillSounds": function () {
		for (var i = 0; i < currentProject.sounds.length; i++) {
			$('#sounds ul').append(tmpl.sound.f(
				currentProject.sounds[i].name,
				projdir + '/sounds/' + currentProject.sounds[i].origname + '.png',
				i
			));
		}
	},
	// $styles
	"fillStyles": function () {
		for (var i = 0; i < currentProject.styles.length; i++) {
			$('#styles ul').append(tmpl.style.f(
				currentProject.styles[i].name,
				projdir + '/styles/' + currentProject.styles[i].origname + '.png',
				i
			));
		}
	},
	"openStyle": function (style) {
		$('#styleview').show();
		currentStyle = currentProject.styles[style];
		$('#iftochangefont')[0].checked = !!currentStyle.font;
		$('#iftochangefill')[0].checked = !!currentStyle.fill;
		$('#iftochangestroke')[0].checked = !!currentStyle.stroke;
		$('#iftochangeshadow')[0].checked = !!currentStyle.shadow;
		$('#styleview [data-input]').each(function () {
			me = $(this);
			if (me.hasClass('color')) {
				me.val(eval(me.attr('data-input')) == undefined ? '#000000' : eval(me.attr('data-input')));
			} else if (me.attr('type') == 'number') {
				me.val(eval(me.attr('data-input')) == undefined ? 0 : eval(me.attr('data-input')));
			} else {
				me.val(eval(me.attr('data-input')) == undefined ? '' : eval(me.attr('data-input')));
			}
		});
		events.refreshStyleGraphic();
	},
	"styleToggleFont": function () {
		if (this.checked) {
			currentStyle.font = {};
		} else {
			currentStyle.font = false;
		}
	},
	"styleToggleFill": function () {
		if (this.checked) {
			currentStyle.fill = {};
		} else {
			currentStyle.fill = false;
		}
	},
	"styleToggleStroke": function () {
		if (this.checked) {
			currentStyle.stroke = {};
		} else {
			currentStyle.stroke = false;
		}
	},
	"styleToggleShadow": function () {
		if (this.checked) {
			currentStyle.shadow = {};
		} else {
			currentStyle.shadow = false;
		}
	},
	"refreshStyleGraphic": function () {
		styleCanvas.x.strokeStyle = '#000000'; // обводка
		styleCanvas.x.globalAlpha = 1; // непрозрачность
		styleCanvas.x.font = '12px sans-serif'; // шрифт
		styleCanvas.x.fillStyle = '#000000'; // заливка
		styleCanvas.x.shadowBlur = 0; // размытие тени
		styleCanvas.x.shadowColor = 'none'; // цвет тени
		styleCanvas.x.shadowOffsetX = 0; // смещение тени по горизонтали
		styleCanvas.x.shadowOffsetY = 0; // смещение тени по вертикали
		styleCanvas.x.lineWidth = 0; // толщина линий для обводки
		styleCanvas.x.textBaseline = 'alphabet'; // способ выравнивания текста по вертикали
		styleCanvas.x.textAlign = 'left'; 

		styleCanvas.x.clearRect(0,0,styleCanvas.width,styleCanvas.height);
		if (currentStyle.font) {
			styleCanvas.x.font = currentStyle.font.size + 'px ' + currentStyle.font.family;
		}
		if (currentStyle.fill) {
			if (currentStyle.fill.type == 0) {
				styleCanvas.x.fillStyle = fill.color;
			} else if (currentStyle.fill.type == 1 && currentStyle.fill.gradtype == 0) {
				var grad = styleCanvas.x.createRadialGradient(fill.r,fill.r,0,0,0,fill.r);
				for (k in fill.colors) {
				  grad.addColorStop(fill.colors[k].pos,fill.colors[k].color);
				}
				styleCanvas.x.fillStyle = grad;
			} else if (currentStyle.fill.type == 1) {
				var grad = styleCanvas.x.createLinearGradient(fill.x1,fill.y1,fill.x2,fill.y2);
				for (k in fill.colors) {
				  grad.addColorStop(fill.colors[k].pos,fill.colors[k].color);
				}
				styleCanvas.x.fillStyle = grad;
			} else if (currentStyle.fill.type == 3) {
				styleCanvas.x.fillStyle = ct.background.types[name];
			}
		}
		if (currentStyle.stroke) {
			styleCanvas.x.strokeStyle = currentStyle.stroke.color;
			styleCanvas.x.lineWidth = currentStyle.stroke.width;
		}

		styleCanvas.x.beginPath();
		styleCanvas.x.rect(100,100,100,100);
		styleCanvas.x.fill();
		styleCanvas.x.stroke();

		styleCanvas.x.beginPath();
		styleCanvas.x.arc(350,150,50,0,2*Math.PI);
		styleCanvas.x.closePath();
		styleCanvas.x.fill();
		styleCanvas.x.stroke();

		styleCanvas.x.fillText(languageJSON.styleview.testtext,styleCanvas.width/2, 300);
		styleCanvas.x.strokeText(languageJSON.styleview.testtext,styleCanvas.width/2, 300);
	},
	"styleCreate": function () {
		var obj = {
			name: "style"+ currentProject.styletick,
			shadow: false,
			stroke: false,
			fill: false,
			font: false
		};
		$('#styles .cards').append(tmpl.style.f(
			obj.name,
			assets + '/img/nograph.png',
			currentProject.styles.length
		));
		currentProject.styles.push(obj);
		$('#styles .cards li:last').click();
	},
	"styleSave": function () {
		events.styleGenPreview();
		$('#graphview').hide();
	},
	// $rooms
	"fillRooms": function () {
		for (var i = 0; i < currentProject.rooms.length; i++) {
			$('#rooms ul').append(tmpl.room.f(
				currentProject.rooms[i].name,
				projdir + '/rooms/' + currentProject.rooms[i].origname + '.png',
				i
			));
		}
	}

}

function checkAntiPattern () {
	var me = $(this);
	if (apatterns[me.attr('data-apattern')].exec(me.val())) {
		passed = false;
		me.addClass('error');
	} else {
		me.removeClass('error');
	}
}
function checkPattern () {
	var me = $(this);
	if (!patterns[me.attr('data-pattern')].exec(me.val())) {
		passed = false;
		me.addClass('error');
	} else {
		me.removeClass('error');
	}
}

$(function () {
	// bind events on items in "recent projects" list
	$('#recent').delegate('li','click', function () {
		var me = $(this);
		events.previewProject(path.dirname(me.text()) + '/' + path.basename(me.attr('data-name'),'.ict') + '/splash.png');
	}).delegate('li','dblclick',function () {
		var me = $(this);
		fs.readFile(me.text(), function (err, data) {
			if (err) {
				// TODO: add modal like "file not found"
				alert(languageJSON.common.notfoundorunknown);
				return false;
			}
			projdir = path.dirname(me.text()) + path.sep + path.basename(me.text(),'.ict');
			projname = path.basename(me.text());
			currentProject = JSON.parse(data);
			events.loadProject();
		});
		return false; // block 'click' event
	});
	// delegate events on module lists
	$('#moduleincluded, #modulelist').delegate('li', 'click', function () {
		me = $(this);
		events.renderMod(me.text());
	});

	// delegate events on graph cards
	$('#graphic .cards').delegate('li', 'click', function () {
		events.openGraph($(this).attr('data-graph'));
	}).delegate('li','contextmenu', function (e) {
		console.log(e);
		var me = $(this);
		currentGraphicId = me.attr('data-graph');
		currentGraphic = currentProject.graphs[me.attr('data-graph')];
		graphMenu.popup(e.clientX, e.clientY);
	});
	// bind events on graphview inputs
	$('#graphx, #graphy, #graphviewshaperound, #graphviewshaperectangle, #graphrad, #graphtop, #graphleft, #graphright, #graphbottom, #graphcols, #graphrows, #graphframes').change(events.refreshGraphCanvas);


	// delegate events on style cards
	$('#styles .cards').delegate('li', 'click', function () {
		events.openStyle($(this).attr('data-style'));
	}).delegate('li','contextmenu', function (e) {
		console.log(e);
		var me = $(this);
		currentStyleId = me.attr('data-style');
		currentStyle = currentProject.styles[me.attr('data-style')];
		styleMenu.popup(e.clientX, e.clientY);
	});
	// styleview events
	$('#styleview').delegate('input','change', events.refreshStyleGraphic);

	// init events
	$('[data-event]:not([type="file"])').click(function (e) {
		var me = $(this);
		passed = true;
		try {
			if (me.attr('data-check')) {
				var they = $(me.attr('data-check'));
				they.filter('[data-pattern]').each(function () {
					checkPattern.apply(this);
				});
				they.filter('[data-apattern]').each(function () {
					checkAntiPattern.apply(this);
				});
				they.filter('[data-required]').each(function () {
					if (this.value == '') {
						passed = false;
						$(this).addClass('error');
					} else {
						$(this).removeClass('error');
					}
				});
			}
			if (passed) {
				events[me.attr('data-event')](e);
			}
		}
		catch (err) {
			console.error(err);
			document.getElementById('scream').play();
		}
	});
	// wrapping [type="file"] in jQuery causes a DOM error?! O_o
	// the same is with console.log(input);
	$('[data-event][type="file"]').each(function () {
		this.onchange = function () {// we don't need validations, do we?
			var me = this;
			try {
				events[me.attributes['data-event'].value]($(me));
			}
			catch (err) {
				console.error(err);
				document.getElementById('scream').play();
			}
			// back to default
			//me.value = '';
		}
	});
	preparetext('body');
});