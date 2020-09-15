export const actions = {
    URL_RELOAD : 'url_reload',
    RELOAD : 'reload',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    DISABLE_REFRESH: 'disable_refresh',
    ENABLE_REFRESH: 'enable_refresh',
    FULL_SCREEN_MODE: 'full_screen'
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

export const BROWSERS = {
    CHROME: 'c',
    FIREFOX: 'f',
    EDGE: 'e',
    SAFARI: 's',
    UNKNOWN: 'u',
    OPERA: 'o',
    INTERNET_EXPLORE: 'i'
}

export const DATA_SOURCE_TYPES = {
    REQUEST: 'q',
    RESPONSE: 's'
}
