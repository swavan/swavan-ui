import store from './store';
import { HTTP_METHODS, MAPPED_HTTP_METHODS, MAPPED_FILTER_BY, MAPPED_OPERATOR, BROWSERS, actions } from './models';

const background = {
  data: {
    activeRules : [],
    beforeRequestOptions: ['blocking', 'requestBody'],
    requestFilters: {
      urls: [`<all_urls>`],
      types: ["xmlhttprequest"] }
  },
  storeInit: async () => {
    store.commit('identifyBrowser') 
    await store.dispatch("loadHostUrl")
    await store.dispatch("loadRedirectRule")
  },
  updateStore: async () => {
    background.data.activeRules = store.getters.activeRules
    for (const rule of background.data.activeRules) {
      await store.dispatch("loadResponses", rule.id)
    }
    const _urls = store.getters.hostUrls.map(({url}) => url)
    if(_urls && _urls.length > 0) {
      background.data.requestFilters.urls = _urls
    }
  },
  registerBrowserCalls: () => {
    if (store.getters.browser === BROWSERS.CHROME) {
      background.data.beforeRequestOptions.push('extraHeaders');
    }
    browser.runtime.onMessage.addListener(messageHandler);
    browser.webRequest.onBeforeRequest.addListener(handleRequest, background.data.requestFilters, background.data.beforeRequestOptions);
  },
  reattached: () => {
    browser.webRequest.onBeforeRequest.removeListener(handleRequest);
    browser.webRequest.onBeforeRequest.addListener(handleRequest, background.data.requestFilters, background.data.beforeRequestOptions);
  }

}

const generateDataUrl = (dt) => {
  return `data://application/json,${JSON.stringify(dt)}`
}

const handleRequest = (req) => {
  const { requestBody, url, method } = req;
  if ( method.toLowerCase() === HTTP_METHODS.OPTION )
    return
   const urlParams = new URLSearchParams(`?${url.split(/\?(.+)/)[1]}`);

   const _rule = background.data.activeRules.find((row) => {
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

const messageHandler = async (request) => {
  if (request["action"]) {
    const _action = request["action"]
    switch (_action) {
      case actions.RELOAD : {
        await background.storeInit();
        await background.updateStore();
        break;
      }
      case actions.URL_RELOAD: {
        await background.storeInit();
        await background.updateStore();
        background.reattached()
        break
      }
    }
  }
}

async function init() {
  try {
    await background.storeInit();
    await background.updateStore();
    background.registerBrowserCalls();
  } catch {
    console.err("Something is wrong")
  }

}

init()
.then(row => console.log(row))
.catch(err => console.log(err));
