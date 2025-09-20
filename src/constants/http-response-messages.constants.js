const RESPONSE_MESSAGES = {

    "DEFAULT_ERROR_MSG" : "Something Went Wrong!",
    "DEFAULT_SUCCESS_MSG" : "Success"
};

const HTTP_RESPONSES = {
    "HTTP_CONTINUE": {
        "id": "HTTP_CONTINUE",
        "statusCode": 100,
        "statusMessage": "Continue",
        "description": "The server has received the initial part of the request and is continuing with the request.",
        "category": "Informational"
    },
    "HTTP_SWITCHING_PROTOCOLS": {
        "id": "HTTP_SWITCHING_PROTOCOLS",
        "statusCode": 101,
        "statusMessage": "Switching Protocols",
        "description": "The server is switching protocols according to the Upgrade header sent by the client.",
        "category": "Informational"
    },
    "HTTP_PROCESSING": {
        "id": "HTTP_PROCESSING",
        "statusCode": 102,
        "statusMessage": "Processing",
        "description": "This code indicates that the server has received and is processing the request, but no response is available yet.",
        "category": "Informational"
    },
    "HTTP_EARLY_HINTS": {
        "id": "HTTP_EARLY_HINTS",
        "statusCode": 103,
        "statusMessage": "Early Hints",
        "description": "This status code is primarily intended to be used with the Link header to allow the user agent to start preloading resources while the server is still preparing a response.",
        "category": "Informational"
    },
    "HTTP_OK": {
        "id": "HTTP_OK",
        "statusCode": 200,
        "statusMessage": "OK",
        "description": "The request has succeeded. The meaning of the success depends on the HTTP method.",
        "category": "Success"
    },
    "HTTP_CREATED": {
        "id": "HTTP_CREATED",
        "statusCode": 201,
        "statusMessage": "Created",
        "description": "The request has been fulfilled, resulting in the creation of a new resource.",
        "category": "Success"
    },
    "HTTP_ACCEPTED": {
        "id": "HTTP_ACCEPTED",
        "statusCode": 202,
        "statusMessage": "Accepted",
        "description": "The request has been accepted for processing, but the processing has not been completed.",
        "category": "Success"
    },
    "HTTP_NON_AUTHORITATIVE_INFORMATION": {
        "id": "HTTP_NON_AUTHORITATIVE_INFORMATION",
        "statusCode": 203,
        "statusMessage": "Non-Authoritative Information",
        "description": "The server successfully processed the request but is returning information that may be from another source.",
        "category": "Success"
    },
    "HTTP_NO_CONTENT": {
        "id": "HTTP_NO_CONTENT",
        "statusCode": 204,
        "statusMessage": "No Content",
        "description": "The server successfully processed the request but is not returning any content.",
        "category": "Success"
    },
    "HTTP_RESET_CONTENT": {
        "id": "HTTP_RESET_CONTENT",
        "statusCode": 205,
        "statusMessage": "Reset Content",
        "description": "The server successfully processed the request, but requires that the requester reset the document view.",
        "category": "Success"
    },
    "HTTP_PARTIAL_CONTENT": {
        "id": "HTTP_PARTIAL_CONTENT",
        "statusCode": 206,
        "statusMessage": "Partial Content",
        "description": "The server is delivering only part of the resource due to a range header sent by the client.",
        "category": "Success"
    },
    "HTTP_MULTI_STATUS": {
        "id": "HTTP_MULTI_STATUS",
        "statusCode": 207,
        "statusMessage": "Multi-Status",
        "description": "The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.",
        "category": "Success"
    },
    "HTTP_ALREADY_REPORTED": {
        "id": "HTTP_ALREADY_REPORTED",
        "statusCode": 208,
        "statusMessage": "Already Reported",
        "description": "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.",
        "category": "Success"
    },
    "HTTP_IM_USED": {
        "id": "HTTP_IM_USED",
        "statusCode": 226,
        "statusMessage": "IM Used",
        "description": "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
        "category": "Success"
    },
    "HTTP_MULTIPLE_CHOICES": {
        "id": "HTTP_MULTIPLE_CHOICES",
        "statusCode": 300,
        "statusMessage": "Multiple Choices",
        "description": "The requested resource corresponds to any one of a set of representations, each with its own specific location, and agent-driven negotiation information is being provided so that the user (or user agent) can select a preferred representation.",
        "category": "Redirection"
    },
    "HTTP_MOVED_PERMANENTLY": {
        "id": "HTTP_MOVED_PERMANENTLY",
        "statusCode": 301,
        "statusMessage": "Moved Permanently",
        "description": "The requested resource has been assigned a new permanent URI and any future references to this resource should use one of the returned URIs.",
        "category": "Redirection"
    },
    "HTTP_FOUND": {
        "id": "HTTP_FOUND",
        "statusCode": 302,
        "statusMessage": "Found",
        "description": "The requested resource resides temporarily under a different URI.",
        "category": "Redirection"
    },
    "HTTP_SEE_OTHER": {
        "id": "HTTP_SEE_OTHER",
        "statusCode": 303,
        "statusMessage": "See Other",
        "description": "The server is redirecting the client to a different URI as the response to the request.",
        "category": "Redirection"
    },
    "HTTP_NOT_MODIFIED": {
        "id": "HTTP_NOT_MODIFIED",
        "statusCode": 304,
        "statusMessage": "Not Modified",
        "description": "The client has performed a conditional GET request and the server has indicated that the resource has not been modified.",
        "category": "Redirection"
    },
    "HTTP_USE_PROXY": {
        "id": "HTTP_USE_PROXY",
        "statusCode": 305,
        "statusMessage": "Use Proxy",
        "description": "The requested resource must be accessed through the proxy given by the Location field.",
        "category": "Redirection"
    },
    "HTTP_RESERVED": {
        "id": "HTTP_RESERVED",
        "statusCode": 306,
        "statusMessage": "Reserved",
        "description": "This status code is no longer used; it is just reserved for future use.",
        "category": "Redirection"
    },
    "HTTP_TEMPORARY_REDIRECT": {
        "id": "HTTP_TEMPORARY_REDIRECT",
        "statusCode": 307,
        "statusMessage": "Temporary Redirect",
        "description": "The requested resource has been temporarily moved to a different URI.",
        "category": "Redirection"
    },
    "HTTP_PERMANENT_REDIRECT": {
        "id": "HTTP_PERMANENT_REDIRECT",
        "statusCode": 308,
        "statusMessage": "Permanent Redirect",
        "description": "The requested resource has been permanently moved to a different URI.",
        "category": "Redirection"
    },
    "HTTP_BAD_REQUEST": {
        "id": "HTTP_BAD_REQUEST",
        "statusCode": 400,
        "statusMessage": "Bad Request",
        "description": "The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).",
        "category": "Client Error"
    },
    "HTTP_UNAUTHORIZED": {
        "id": "HTTP_UNAUTHORIZED",
        "statusCode": 401,
        "statusMessage": "Unauthorized",
        "description": "The request has not been applied because it lacks valid authentication credentials for the target resource.",
        "category": "Client Error"
    },
    "HTTP_PAYMENT_REQUIRED": {
        "id": "HTTP_PAYMENT_REQUIRED",
        "statusCode": 402,
        "statusMessage": "Payment Required",
        "description": "This status code is reserved for future use. The initial aim for creating this code was to use it for digital payment systems, however, this status code is currently not used in any standard.",
        "category": "Client Error"
    },
    "HTTP_FORBIDDEN": {
        "id": "HTTP_FORBIDDEN",
        "statusCode": 403,
        "statusMessage": "Forbidden",
        "description": "The server understood the request but refuses to authorize it.",
        "category": "Client Error"
    },
    "HTTP_NOT_FOUND": {
        "id": "HTTP_NOT_FOUND",
        "statusCode": 404,
        "statusMessage": "Not Found",
        "description": "The server cannot find the requested resource.",
        "category": "Client Error"
    },
    "HTTP_METHOD_NOT_ALLOWED": {
        "id": "HTTP_METHOD_NOT_ALLOWED",
        "statusCode": 405,
        "statusMessage": "Method Not Allowed",
        "description": "The method specified in the request-line is not allowed for the resource identified by the Request-URI.",
        "category": "Client Error"
    },
    "HTTP_NOT_ACCEPTABLE": {
        "id": "HTTP_NOT_ACCEPTABLE",
        "statusCode": 406,
        "statusMessage": "Not Acceptable",
        "description": "The resource identified by the request is only capable of generating response entities that have content characteristics not acceptable according to the accept headers sent in the request.",
        "category": "Client Error"
    },
    "HTTP_PROXY_AUTHENTICATION_REQUIRED": {
        "id": "HTTP_PROXY_AUTHENTICATION_REQUIRED",
        "statusCode": 407,
        "statusMessage": "Proxy Authentication Required",
        "description": "Similar to 401 Unauthorized, but it indicates that the client needs to authenticate itself in order to use a proxy.",
        "category": "Client Error"
    },
    "HTTP_REQUEST_TIMEOUT": {
        "id": "HTTP_REQUEST_TIMEOUT",
        "statusCode": 408,
        "statusMessage": "Request Timeout",
        "description": "The client did not produce a request within the time that the server was prepared to wait.",
        "category": "Client Error"
    },
    "HTTP_CONFLICT": {
        "id": "HTTP_CONFLICT",
        "statusCode": 409,
        "statusMessage": "Conflict",
        "description": "The request could not be completed due to a conflict with the current state of the target resource.",
        "category": "Client Error"
    },
    "HTTP_GONE": {
        "id": "HTTP_GONE",
        "statusCode": 410,
        "statusMessage": "Gone",
        "description": "The requested resource is no longer available at the server and no forwarding address is known.",
        "category": "Client Error"
    },
    "HTTP_LENGTH_REQUIRED": {
        "id": "HTTP_LENGTH_REQUIRED",
        "statusCode": 411,
        "statusMessage": "Length Required",
        "description": "The server refuses to accept the request without a defined Content-Length.",
        "category": "Client Error"
    },
    "HTTP_PRECONDITION_FAILED": {
        "id": "HTTP_PRECONDITION_FAILED",
        "statusCode": 412,
        "statusMessage": "Precondition Failed",
        "description": "The precondition given in one or more of the request-header fields evaluated to false when it was tested on the server.",
        "category": "Client Error"
    },
    "HTTP_PAYLOAD_TOO_LARGE": {
        "id": "HTTP_PAYLOAD_TOO_LARGE",
        "statusCode": 413,
        "statusMessage": "Payload Too Large",
        "description": "The server is refusing to process a request because the request payload is larger than the server is willing or able to process.",
        "category": "Client Error"
    },
    "HTTP_URI_TOO_LONG": {
        "id": "HTTP_URI_TOO_LONG",
        "statusCode": 414,
        "statusMessage": "URI Too Long",
        "description": "The server is refusing to service the request because the request-target is longer than the server is willing to interpret.",
        "category": "Client Error"
    },
    "HTTP_UNSUPPORTED_MEDIA_TYPE": {
        "id": "HTTP_UNSUPPORTED_MEDIA_TYPE",
        "statusCode": 415,
        "statusMessage": "Unsupported Media Type",
        "description": "The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.",
        "category": "Client Error"
    },
    "HTTP_RANGE_NOT_SATISFIABLE": {
        "id": "HTTP_RANGE_NOT_SATISFIABLE",
        "statusCode": 416,
        "statusMessage": "Range Not Satisfiable",
        "description": "The server cannot serve the requested byte range.",
        "category": "Client Error"
    },
    "HTTP_EXPECTATION_FAILED": {
        "id": "HTTP_EXPECTATION_FAILED",
        "statusCode": 417,
        "statusMessage": "Expectation Failed",
        "description": "The server cannot meet the requirements of the Expect request-header field.",
        "category": "Client Error"
    },
    "HTTP_I_AM_A_TEAPOT": {
        "id": "HTTP_I_AM_A_TEAPOT",
        "statusCode": 418,
        "statusMessage": "I'm a teapot",
        "description": "This code was defined in 1998 as one of the traditional IETF April Fools' jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not expected to be implemented by actual HTTP servers.",
        "category": "Client Error"
    },
    "HTTP_MISDIRECTED_REQUEST": {
        "id": "HTTP_MISDIRECTED_REQUEST",
        "statusCode": 421,
        "statusMessage": "Misdirected Request",
        "description": "The request was directed at a server that is not able to produce a response (for example, because of connection reuse).",
        "category": "Client Error"
    },
    "HTTP_UNPROCESSABLE_ENTITY": {
        "id": "HTTP_UNPROCESSABLE_ENTITY",
        "statusCode": 422,
        "statusMessage": "Unprocessable Entity",
        "description": "The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.",
        "category": "Client Error"
    },
    "HTTP_LOCKED": {
        "id": "HTTP_LOCKED",
        "statusCode": 423,
        "statusMessage": "Locked",
        "description": "The resource that is being accessed is locked.",
        "category": "Client Error"
    },
    "HTTP_FAILED_DEPENDENCY": {
        "id": "HTTP_FAILED_DEPENDENCY",
        "statusCode": 424,
        "statusMessage": "Failed Dependency",
        "description": "The request failed due to the failure of a previous request.",
        "category": "Client Error"
    },
    "HTTP_TOO_EARLY": {
        "id": "HTTP_TOO_EARLY",
        "statusCode": 425,
        "statusMessage": "Too Early",
        "description": "The server is unwilling to risk processing a request that might be replayed.",
        "category": "Client Error"
    },
    "HTTP_UPGRADE_REQUIRED": {
        "id": "HTTP_UPGRADE_REQUIRED",
        "statusCode": 426,
        "statusMessage": "Upgrade Required",
        "description": "The client should switch to a different protocol such as TLS/1.0.",
        "category": "Client Error"
    },
    "HTTP_PRECONDITION_REQUIRED": {
        "id": "HTTP_PRECONDITION_REQUIRED",
        "statusCode": 428,
        "statusMessage": "Precondition Required",
        "description": "The origin server requires the request to be conditional.",
        "category": "Client Error"
    },
    "HTTP_TOO_MANY_REQUESTS": {
        "id": "HTTP_TOO_MANY_REQUESTS",
        "statusCode": 429,
        "statusMessage": "Too Many Requests",
        "description": "The user has sent too many requests in a given amount of time.",
        "category": "Client Error"
    },
    "HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE": {
        "id": "HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE",
        "statusCode": 431,
        "statusMessage": "Request Header Fields Too Large",
        "description": "The server is unwilling to process the request because its header fields are too large.",
        "category": "Client Error"
    },
    "HTTP_UNAVAILABLE_FOR_LEGAL_REASONS": {
        "id": "HTTP_UNAVAILABLE_FOR_LEGAL_REASONS",
        "statusCode": 451,
        "statusMessage": "Unavailable For Legal Reasons",
        "description": "The server is denying access to the resource as a consequence of a legal demand.",
        "category": "Client Error"
    },
    "HTTP_INTERNAL_SERVER_ERROR": {
        "id": "HTTP_INTERNAL_SERVER_ERROR",
        "statusCode": 500,
        "statusMessage": "Internal Server Error",
        "description": "The server has encountered a situation it doesn't know how to handle.",
        "category": "Server Error"
    },
    "HTTP_NOT_IMPLEMENTED": {
        "id": "HTTP_NOT_IMPLEMENTED",
        "statusCode": 501,
        "statusMessage": "Not Implemented",
        "description": "The request method is not supported by the server and cannot be handled.",
        "category": "Server Error"
    },
    "HTTP_BAD_GATEWAY": {
        "id": "HTTP_BAD_GATEWAY",
        "statusCode": 502,
        "statusMessage": "Bad Gateway",
        "description": "The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.",
        "category": "Server Error"
    },
    "HTTP_SERVICE_UNAVAILABLE": {
        "id": "HTTP_SERVICE_UNAVAILABLE",
        "statusCode": 503,
        "statusMessage": "Service Unavailable",
        "description": "The server is currently unable to handle the request due to temporary overload or maintenance of the server.",
        "category": "Server Error"
    },
    "HTTP_GATEWAY_TIMEOUT": {
        "id": "HTTP_GATEWAY_TIMEOUT",
        "statusCode": 504,
        "statusMessage": "Gateway Timeout",
        "description": "The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI.",
        "category": "Server Error"
    },
    "HTTP_VERSION_NOT_SUPPORTED": {
        "id": "HTTP_VERSION_NOT_SUPPORTED",
        "statusCode": 505,
        "statusMessage": "HTTP Version Not Supported",
        "description": "The server does not support the HTTP protocol version that was used in the request.",
        "category": "Server Error"
    },
    "HTTP_VARIANT_ALSO_NEGOTIATES": {
        "id": "HTTP_VARIANT_ALSO_NEGOTIATES",
        "statusCode": 506,
        "statusMessage": "Variant Also Negotiates",
        "description": "The server has an internal configuration error: transparent content negotiation for the request results in a circular reference.",
        "category": "Server Error"
    },
    "HTTP_INSUFFICIENT_STORAGE": {
        "id": "HTTP_INSUFFICIENT_STORAGE",
        "statusCode": 507,
        "statusMessage": "Insufficient Storage",
        "description": "The server is unable to store the representation needed to complete the request.",
        "category": "Server Error"
    },
    "HTTP_LOOP_DETECTED": {
        "id": "HTTP_LOOP_DETECTED",
        "statusCode": 508,
        "statusMessage": "Loop Detected",
        "description": "The server detected an infinite loop while processing the request.",
        "category": "Server Error"
    },
    "HTTP_NOT_EXTENDED": {
        "id": "HTTP_NOT_EXTENDED",
        "statusCode": 510,
        "statusMessage": "Not Extended",
        "description": "Further extensions to the request are required for the server to fulfill it.",
        "category": "Server Error"
    },
    "HTTP_NETWORK_AUTHENTICATION_REQUIRED": {
        "id": "HTTP_NETWORK_AUTHENTICATION_REQUIRED",
        "statusCode": 511,
        "statusMessage": "Network Authentication Required",
        "description": "The client needs to authenticate to gain network access.",
        "category": "Server Error"
    }
}

export {HTTP_RESPONSES, RESPONSE_MESSAGES};