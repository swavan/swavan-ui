import { v4 as uuidv4 } from 'uuid';

export const actions = {
    URL_RELOAD : 'url_reload',
    TYPES_UPDATE: 'types_update',
    RELOAD : 'reload',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    DISABLE_REFRESH: 'disable_refresh',
    ENABLE_REFRESH: 'enable_refresh',
    FULL_SCREEN_MODE: 'full_screen',
    HARD_RELOAD: 'hard_reload'
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

export const SOURCE_TYPES_OPTION = [
    { value: "s", text: 'Server'},
    { value: "u", text: 'Url'},
    { value: "p", text: 'Path'}
];

export const OPERATORS = [
    {value: "e", text:'Equals'},
    {value: "c", text:'Contains'},
    {value: "w", text:'Wildcard'},
    {value: "p", text:"Prefix"},
    {value: "s", text: "Suffix"}
];

export const DATA_SOURCE_TYPES_OPTION = [
    {value: "r", text: 'Redirect'},
    {value: "d", text: 'Mock Data'},
    {value: "b", text: 'Block Request'},
];

export const HTTP_METHODS_OPTIONS = [
    {value: "al", text: 'ALL'},
    {value: "ge", text: 'GET'},
    {value: "po", text: 'POST'},
    {value: "pu", text: 'PUT'},
    {value: "de", text: 'DELETE'},
    {value: "pa", text: 'PATCH'}
];

export const FILTER_BY_OPTIONS = [
    {value: "n", text: 'None'},
    {value: "q", text: 'Query'},
    {value: "b", text: 'Body'},
];

export const RuleModel = {
    id: null,
    name: "",
    description: "",
    source_type: "u",
    operator: "c",
    source: "",
    is_enabled: true,
    is_favorite: false,
    responses: [],
}

export const ResponseModel = {
    mark_for_deletion: false,
    data_source_type: "r",
    data: {...DataModel},
    http_method: "al",
    filters: [],
    is_logic_enabled: true,
    cloud_store_permission: 'a',
    tags: '',
    delay: 0,
}

export const FilterModel = {
    filter_by: 'n',
    key: '',
    value: '',
    is_active: true
}

export const HeaderModel = {
    type: '',
    key: '',
    value: ''
}

export const DataModel = {
    id: null,
    content: "",
    link: "",
    key: uuidv4(),
    status: "200",
    content_type: "application/json",
    headers: [],
    action_perform: 'a',
    is_mock_loading: false
}

export const isValid = (_rule) => {
    if (_rule.name &&
            _rule.source_type &&
            _rule.operator &&
            _rule.source &&
            _rule.responses &&
            _rule.responses.length > 0) {
                
                const valid = _rule.responses
                    .filter(res => {
                        if (res.mark_for_deletion ||  res.data_source_type === 'b')
                            return true
                        else if (res.http_method && res.data && (res.data.link || res.data.content) ) {
                            const areValid = res.filters.every((_filter) => _filter.filter_by
                                && _filter.key
                                && _filter.value)
                            if (areValid) {
                                return true
                            } else if (res.filters.length === 0 ) {
                                return true  
                            }
                            return false
                        }
                        return false
                    })
                    .length
                if ( valid === _rule.responses.length ) {
                    return true   
                }
    }
    return false
}
