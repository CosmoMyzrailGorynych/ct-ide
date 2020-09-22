declare namespace ct {
    namespace storage {
        /**
         * Sets a value to `localStorage`. Supports objects, arrays, numbers, strings, probably other types.
         *
         * @param   {String}  name   The name
         * @param   {any}     value  The value
         *
         * @return  {void}
         */
        function set(name: String, value: any): void;

        /**
         * Gets a value from `localStorage`. Supports objects, arrays, numbers, strings, probably other types.
         *
         * @param   {String}  name  The name
         *
         * @return  {any}           The value
         */
        function get(name: String): any;

        /**
         * Sets a value to `sessionStorage`. Supports objects, arrays, numbers, strings, probably other types.
         *
         * @param   {String}  name   The name
         * @param   {any}     value  The value
         *
         * @return  {void}
         */
        function setSession(name: String, value: any): void;

        /**
         * Gets a value from `sessionStorage`. Supports objects, arrays, numbers, strings, probably other types.
         *
         * @param   {String}  name  The name
         *
         * @return  {any}           The value
         */
        function getSession(name: String): any;
    }
}
