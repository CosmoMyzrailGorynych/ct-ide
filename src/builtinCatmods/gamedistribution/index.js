(function ctGamedistribution() {
	const gamedistribution = {
			init() {
				gamedistribution.isFinished = false;
				gamedistribution.adPlaying = false;
				gamedistribution.isPaused = false;

				window["GD_OPTIONS"] = {
					"gameId": "/*%gameID%*/", // Your gameId can be found at your Gamedistribution.com account.
					advertisementSettings: {
						debug: [/*%debugMode%*/][0],
					 	"locale": "/*%gdsdkLocale%*/", // Locale used in IMA SDK, this will localize the "Skip ad after x seconds" phrases.
				  	},
				"onEvent": function(event) {
						switch (event.name) {
							case "SDK_GAME_START":
								gamedistribution.adPlaying = false;
								break;
							case "SDK_GAME_PAUSE":
								gamedistribution.adPlaying = true;
								break;
							case "SDK_READY":
								gamedistribution.sdkReady = true;
								break;
							case "SDK_ERROR":
								/** This is not managed right now */
								gamedistribution.sdkError = true;
								break;
							case "COMPLETE":
								gamedistribution.isFinished = true;
								gamedistribution.adPlaying = false;
								break;	
							case "SDK_GDPR_TRACKING":
								/** This is not managed right now */
								gamedistribution.sdkGdprTracking = true;
								break;
							case "SDK_GDPR_TARGETING":
								/** This is not managed right now */
								gamedistribution.sdkGdprTargeting = true;
								break;
							case "SDK_GDPR_THIRD_PARTY":
								/** This is not managed right now */
								gamedistribution.sdkGdprThirdParty = true;
								break;
						}
					},
				};
				(function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s);
					js.id = id;
					js.src = 'https://html5.api.gamedistribution.com/main.min.js';
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'gamedistribution-jssdk'));

				/**
				 * Includes a basic GDPR
				 */
				if([/*%gdpr%*/][0]){
					const script = document.createElement("script");
					script.src = "//acdn.adnxs.com/cmp/cmp.complete.bundle.js";
					document.head.appendChild(script);
				}
						
			},
			showAd(){
				if (typeof gdsdk !== 'undefined' && gdsdk.showAd !== 'undefined') {
					gdsdk.showAd();
				}
			},
			pauseGame(){
				if(gamedistribution.adPlaying){
					return true;
				}
			},
			resumeGame(){
				if(!gamedistribution.adPlaying){
					return true;
				}
			}
	}
	/**
	 * Auto init the Game Distribution SDK.
	 */
	if([/*%autoInit%*/][0]){
		gamedistribution.init();
	}

    window.gamedistribution = gamedistribution;
})();
