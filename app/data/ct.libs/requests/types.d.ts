/**
 * Make a GET request
 * @catnipName Get
 * @catnipIcon globe
 * @param [url] URL for request
 * @catnipPromise
 * @catnipPromiseSave json
 */
declare async function getRequest(url: string, headers: { [id: string] : string } = {}): Promise<object>;

/**
 * Make a POST request
 * @catnipName POST
 * @param [url] URL for request
 * @param [headers] HTTP request headers
 * @param [body] request body
 * @catnipPromise
 * @catnipPromiseSave json
 */
declare async function postRequest(url: string, headers: { [id: string] : string } = {}, body: object): Promise<object>;