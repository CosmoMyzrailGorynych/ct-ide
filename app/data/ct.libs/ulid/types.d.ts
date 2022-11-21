declare namespace ct{
    namespace  ulid{

        /**
         * @return {string}
         */
        var rn: string;

        /**
         * @return {string}
         */
        var uuid: string;

        /**
         * Generate random string based on Math.
         * 
         * @returns string
         */
        function randomizr(): string;

        /**
         * Generate random string based on Math.
         * 
         * @returns string
         */
         function crandomizr(): string;
        
        /**
         * Generate a new id with a pattern of 8-4-4-4-12
         ```js
         var id = ct.ulid.make(); 
         //Result is:f2eda03a-dd0d-d723-6ff3-765480b5d3ba
         ``` 
         * @returns string
         */
        function make(): string;

        /**
         * Generate a new id with your pattern.
         ```js
         var id = ct.ulid.custom(); 
         ``` 
         * @returns string
         */
         function custom(): string;
    }

}
