const SOURCE_TYPES = [
    { value: "s", text: 'Server'},
    { value: "u", text: 'Url'},
    { value: "p", text: 'Path'}
];

const OPERATORS = [
    {value: "e", text:'Equals'},
    {value: "c", text:'Contains'},
    {value: "w", text:'Wildcard'},
    {value: "p", text:"Prefix"},
    {value: "s", text: "Suffix"}
];

const DATA_SOURCE_TYPES = [
    {value: "r", text: 'Redirect'},
    {value: "d", text: 'Data'}
];

const HTTP_METHODS = [
    {value: "al", text: 'ALL'},
    {value: "ge", text: 'GET'},
    {value: "po", text: 'POST'},
    {value: "pu", text: 'PUT'},
    {value: "de", text: 'DELETE'},
    {value: "pa", text: 'PATCH'}
];

const FILTER_BY_OPTIONS = [
    {value: "n", text: 'None'},
    {value: "q", text: 'Query'},
    {value: "b", text: 'Body'},
];

export default { SOURCE_TYPES, OPERATORS, DATA_SOURCE_TYPES, HTTP_METHODS,  FILTER_BY_OPTIONS};