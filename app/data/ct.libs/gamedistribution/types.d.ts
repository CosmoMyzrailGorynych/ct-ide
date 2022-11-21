declare namespace ct {
    namespace gamedistribution {

        /**
         * Is the ad finished.
         * 
         * True if the ad is completed 
         * 
         * @return {boolean}
         */
        var isFinished: boolean;

        /**
         * Check if the game is paused or running when the Resume game event is called.
         * 
         * @return {boolean}
         */
        var isPaused: boolean;

        /**
         * @return {boolean}
         */
        var sdkReady: boolean;
        
        /**
         * @return {boolean}
         */
        var adPlaying: boolean;
        
        /**
         * @return {boolean}
         */
        var sdkError: boolean;
        
        /**
         * @return {boolean}
         */
        var sdkGdprTracking: boolean;
        
        /**
         * @return {boolean}
         */
        var sdkGdprTargeting: boolean;
        
        /**
         * @return {boolean}
         */
        var sdkGdprThirdParty: boolean;

        /**
         * Init `Game distribution SDK`.
         * 
         * If you decide to run the init in the `editor`
         * 
         * This is how to
         * 
         * Add an event from the left panel `Room start`
         * 
         * then add this code:
         * 
         ```js
         ct.gamedistribution.init();
         ```
         * @return  {void}
         */
        function init(): void;

        /**
         * Check if the Game Distribution SDK is ready.
         * @returns boolean
         */
        function gdsdkReady(): boolean;

        /**
         * This is going to be true when an Ad is playing.
         * So you must pause the game and mute the sounds and music.
         * 
         * Example of usage:
         * 
         * Add this `event` in the left panel.
         * 
         * Add this in the `editor` code.
         ```js
         if(ct.sound.playing('MainMusic')){
            ct.sound.pause("MainMusic");
         }
         ```
         * @returns boolean
         */
        function pauseGame(): boolean;
        
        /**
         * Resume the game after the Ad is completed, skipped or cancelled.
         * 
         * Example of usage: 
         * 
         * Add this `event` in the left panel
         * 
         * Add this in the `code editor`
         * 
         ```js
         if(!ct.sound.playing('MainMusic')){
            ct.sound.resume("MainMusic");
         }
         ```
         * @returns boolean
         */
        function resumeGame(): boolean;


        /**
        * Show an Ad when is ready.
        * @return {void}
        */
        function showAd(): void;


    }
}