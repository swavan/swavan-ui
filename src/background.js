import store from './store';
import { actions, HTTP_METHODS, MAPPED_HTTP_METHODS, MAPPED_FILTER_BY, MAPPED_OPERATOR } from './models';

let activeRules = []
let urls = [ `<all_urls>`]
let types = ["xmlhttprequest"]

const background = {
  request: {},
  storeInit: async () => {
    await store.dispatch("loadRedirectRule")
  },

   updateStore: async () => {
    activeRules = store.getters.activeRules
    for (const rule of activeRules) {
      await store.dispatch("loadResponses", rule.id)
    }
  },
  registerBrowserCalls: () => {
    
    browser.runtime.onMessage.addListener( async (request) => {
      if (request["action"]) {
        const _action = request["action"]
        switch (_action) {
          case actions.RELOAD : {
            await background.storeInit();
            await background.updateStore();
            break;
          }
        }
      }
    })

    browser.webRequest.onBeforeRequest.addListener(handleRedirect,
      { urls, types },
      ['blocking', 'requestBody', 'extraHeaders']
    );
  }
}

const generateDataUrl = (dt) => {
  return `data:application/json,${JSON.stringify(dt)}`
}

const handleRedirect = (req) => {
  const { requestBody, url, method } = req;
  if ( method.toLowerCase() === HTTP_METHODS.OPTION )
    return
   const urlParams = new URLSearchParams(`?${url.split(/\?(.+)/)[1]}`);

   const _rule = activeRules.find((row) => {
     switch(row.operator) {
       case MAPPED_OPERATOR.CONTAINS: { return url.includes(row.source) }
       case MAPPED_OPERATOR.EQUALS: { return url === row.source }
       case MAPPED_OPERATOR.WILDCARD: { return new RegExp('^' + url.replace(/\*/g, '.*') + '$').test(row.source)}
       case MAPPED_OPERATOR.PREFIX: { return url.startsWith(row.source) }
       case MAPPED_OPERATOR.SUFFIX: { return url.endsWith(row.source) }
     }  
   })
 
   if (_rule) {
     let _body = Object
     if (requestBody) {
       try {
          _body = JSON.parse((decodeURIComponent(String.fromCharCode.apply(null,new Uint8Array(requestBody.raw[0].bytes)))))
       } catch {
         return
       }
     }
     const responses = _rule.responses.filter(row => row.is_logic_enabled)
     for (const response of responses) {
         const { data, http_method, data_source_type, filters } = response;

         if (( http_method === 'al') || (method.toLowerCase() === MAPPED_HTTP_METHODS[http_method]) ) {
           const _filters = filters.filter(({ is_active }) => is_active)
           if (_filters.length > 0) {
             const matched = _filters.every(({ filter_by, key, value }) => {
               switch(filter_by) {
                 case MAPPED_FILTER_BY.NONE : return true
                 case MAPPED_FILTER_BY.BODY : return key
                  .split('.')
                  .reduce((accumulator, currentValue) => accumulator[currentValue], _body) === value
                 case MAPPED_FILTER_BY.HEADER: {
                   break
                 }
                 case MAPPED_FILTER_BY.QUERY: return urlParams.get(key) === value
                 default: return false
               }
             })
             if (matched){
               return { redirectUrl: data_source_type === 'd' ? generateDataUrl(data) : data}
            }
             else {
              continue
            }
           }
          return { redirectUrl: data_source_type === 'd' ? generateDataUrl(data) : data }
         }
     }
   }

}

async function init() {
  await background.storeInit();
  await background.updateStore();
  background.registerBrowserCalls();
}

init();
