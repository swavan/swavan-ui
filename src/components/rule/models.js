import { v4 as uuidv4 } from 'uuid';

export const RuleModel = {
    id: null,
    name: "",
    description: "",
    source_type: "u",
    operator: "c",
    source: "",
    is_enabled: true,
    responses: [],
}

export const ResponseModel = {
    mark_for_deletion: false,
    data_source_type: "r",
    data: {...DataModel},
    http_method: "al",
    filters: [],
    is_logic_enabled: true,
    cloud_store_permission: 'a'
}

export const FilterModel = {
    filter_by: 'n',
    key: '',
    value: '',
    is_active: true
}

export const HeaderModel = {
    type: '',
    field: '',
    value: ''
}

export const DataModel = {
    id: null,
    content: "",
    link: "",
    key: uuidv4(),
    status: 200,
    contentType: "application/json",
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
                        if (res.mark_for_deletion)
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
