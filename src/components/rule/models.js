export const RuleModel = {
    id: null,
    name: "",
    description: "",
    source_type: "u",
    operator: "c",
    source: "",
    is_enabled: true,
    responses: [],
    errors: [],
    is_validate:  function() {
        if (this.name &&
            this.source_type &&
            this.operator &&
            this.source &&
            this.responses &&
            this.responses.length > 0) {
                
                const valid = this.responses
                    .filter(row => row.is_validate())
                    .length
                if ( valid === this.responses.length ) {
                    this.errors = [];
                    return true   
                }
        }
        return false
    },
    getErrors: function() {
        if (!this.name) {
            this.errors.push("Name required")
        }

        if(!this.source) {
            this.errors.push(`${this.source_type} required`)
        }

        if(!this.responses.length < 1) {
            this.errors.push(`Response required`)
        }

    }
}

export const ResponseModel = {
    id: null,
    rule_id: null,
    mark_for_deletion: false,
    data_source_type: "r",
    data: "",
    http_method: "al",
    filter_by: "n",
    logic: "",
    filters: [],
    headers: [],
    is_logic_enabled: true,
    is_validate:  function() {
        if (this.mark_for_deletion) {
            return true
        }
        if (this.http_method &&
            this.data &&
            this.filter_by) {
            if (this.filter_by !== 'n' && this.logic) {
                return true
            } else if (this.filter_by === 'n') {
                return true
            }
        }
        return false
    }
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