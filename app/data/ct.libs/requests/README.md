# Requests
This mod contains wrappers for GET and POST requests with `fetch`, to be used with Catnip. You can use the functions with scripting, but there is not much point to it, since they do nothing, `fetch` doesn't already do.

Any errors will be logged to the console, since Catnip currently has no error handling.

## GET
This is a simple GET request, which takes an URL and an optional object with request headers. The method returns the result of the request as an object or a string. 

## POST
This is a POST request, which takes an URL, an optional object with request headers and an object as body. The body contains the data sent to the server. The method returns the result of the request as an object or a string. 

> Some servers require at least a `Content-Type` header.

