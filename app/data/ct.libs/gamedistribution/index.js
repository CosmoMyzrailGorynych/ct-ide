(function ctGamedistribution(ct) {
	ct.gamedistribution = {

			init() {
				ct.gamedistribution.isFinished = false;
				ct.gamedistribution.adPlaying = false;
				ct.gamedistribution.isPaused = false;

				window["GD_OPTIONS"] = {
					"gameId": "/*%gameID%*/", // Your gameId can be found at your Gamedistribution.com account.
					advertisementSettings: {
						debug: [/*%debugMode%*/][0],
					 	"locale": "/*%gdsdkLocale%*/", // Locale used in IMA SDK, this will localize the "Skip ad after x seconds" phrases.
				  	},
				"onEvent": function(event) {
						switch (event.name) {
							case "SDK_GAME_START":
								ct.gamedistribution.adPlaying = false;
								break;
							case "SDK_GAME_PAUSE":
								ct.gamedistribution.adPlaying = true;
								break;
							case "SDK_READY":
								ct.gamedistribution.sdkReady = true;
								break;
							case "SDK_ERROR":
								/** This is not managed right now */
								ct.gamedistribution.sdkError = true;
								break;
							case "COMPLETE":
								ct.gamedistribution.isFinished = true;
								ct.gamedistribution.adPlaying = false;
								break;	
							case "SDK_GDPR_TRACKING":
								/** This is not managed right now */
								ct.gamedistribution.sdkGdprTracking = true;
								break;
							case "SDK_GDPR_TARGETING":
								/** This is not managed right now */
								ct.gamedistribution.sdkGdprTargeting = true;
								break;
							case "SDK_GDPR_THIRD_PARTY":
								/** This is not managed right now */
								ct.gamedistribution.sdkGdprThirdParty = true;
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
				if(ct.gamedistribution.adPlaying){
					return true;
				}
			},
			resumeGame(){
				if(!ct.gamedistribution.adPlaying){
					return true;
				}
			}
	}
	/**
	 * Auto init the Game Distribution SDK.
	 */
	if([/*%autoInit%*/][0]){
		ct.gamedistribution.init();
	}
})(ct);