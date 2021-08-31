- project - gets the project based on hostname in the request - assigns it to the request.context

- post-process-locals - merges response.locals with common variables from request.context

- respond - render a view with the response.locals, if res.data exists, respond with json data
