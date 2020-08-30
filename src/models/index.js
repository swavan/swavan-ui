export const actions = {
    RELOAD : 'reload',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
}


export const HTTP_METHODS = {
    OPTION : 'option',
    POST: 'post',
    PUT: 'put',
    GET: 'get',
    DELETE: 'delete',
    PATCH: 'patch'
}

export const MAPPED_HTTP_METHODS = {
    'al' : 'all',
    'po': 'post',
    'pu': 'put',
    'ge': 'get',
    'de': 'delete',
    'pa': 'patch'
}

export const MAPPED_FILTER_BY = {
    NONE : 'n',
    QUERY : 'q',
    HEADER : 'h',
    BODY : 'b',
    ROUTE : 'r',
}

export const MAPPED_OPERATOR = {
    EQUALS: 'e',
    CONTAINS: 'c',
    WILDCARD: 'w',
    PREFIX: 'p',
    SUFFIX: 's',
}