declare namespace storage {
    /**
     * Sets a value to `localStorage`. Supports objects, arrays, numbers, strings,
     * probably other types.
     *
     * @param   {string}  name   The name
     * @param   {any}     value  The value
     *
     * @return  {void}
     */
    function set(name: string, value: any): void;

    /**
     * Gets a value from `localStorage`. Supports objects, arrays, numbers, strings,
     * probably other types.
     *
     * @param   {string}  name  The name
     *
     * @return  {any}           The value
     */
    function get(name: string): any;

    /**
     * Sets a value to `sessionStorage`. Supports objects, arrays, numbers, strings,
     * probably other types.
     *
     * @param   {string}  name   The name
     * @param   {any}     value  The value
     *
     * @return  {void}
     */
    function setSession(name: string, value: any): void;

    /**
     * Gets a value from `sessionStorage`. Supports objects, arrays, numbers, strings,
     * probably other types.
     *
     * @param   {string}  name  The name
     *
     * @return  {any}           The value
     */
    function getSession(name: string): any;
}
