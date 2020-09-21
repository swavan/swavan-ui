import store from '../store';
import { HTTP_METHODS, MAPPED_HTTP_METHODS, MAPPED_FILTER_BY, MAPPED_OPERATOR, BROWSERS } from '../models';

const generateDataUrl = (dt) => {
  return `data://application/json,${JSON.stringify(dt)}`
}

export const BackGroundSupport = {
  data: {
    beforeRequestOptions: ['blocking', 'requestBody'],
    requestFilters: {
     urls: [`<all_urls>`],
     types: [""]
    },
    isReloadActive: store.getters.isReloadActive()
  },
  storeInit: async () => {
    store.commit('identifyBrowser') 
    await store.dispatch("loadSetting")
    await store.dispatch("loadHostUrl")
    await store.dispatch("getRules")
    await store.dispatch("loadRequestFilterTypes")
  },
  updateStore: async () => {
    const _urls = store.getters.hostUrls.map(({url}) => url)
    if(_urls && _urls.length > 0) {
      BackGroundSupport.data.requestFilters.urls = _urls
    } else {
      BackGroundSupport.data.requestFilters.urls =  [`<all_urls>`];
    }
    const { types } = store.getters.requestTypes;
    if ( types && types.length > 0 ) {
      BackGroundSupport.data.requestFilters['types'] = [ ...types];
    } else {
      delete BackGroundSupport.data.requestFilters['types']
    }
  },
  registerBrowserCalls: () => {
    if (store.getters.browser === BROWSERS.CHROME) {
      BackGroundSupport.data.beforeRequestOptions.push('extraHeaders');
    }
    BackGroundSupport.addListener()
  },
  handleRequest: (req) => {
    const { requestBody, url, method } = req;
    if ( method.toLowerCase() === HTTP_METHODS.OPTION )
      return
     const urlParams = new URLSearchParams(`?${url.split(/\?(.+)/)[1]}`);
  
     const _rule = store.getters.activeRules.find((row) => {
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
           
           const { data, http_method, data_source_type, filters, cloud_store_permission } = response;
           
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
                  return { redirectUrl: data_source_type === 'd' && cloud_store_permission !== 'a' ? generateDataUrl(data.content) : data.link}
              }
               else {
                continue
              }
             }
            return { redirectUrl: data_source_type === 'd' && cloud_store_permission !== 'a' ? generateDataUrl(data.content) : data.link }
           }
       }
     }
  },
  deleteListeners: () => {
    browser.webRequest.onBeforeRequest.removeListener(BackGroundSupport.handleRequest);
  },
  addListener: () => {
    browser.webRequest.onBeforeRequest.addListener(BackGroundSupport.handleRequest, BackGroundSupport.data.requestFilters, BackGroundSupport.data.beforeRequestOptions);
  },
  reattached: () => {
    BackGroundSupport.deleteListeners();
    BackGroundSupport.addListener();
  },
  dataLoader: async() => {
    await BackGroundSupport.storeInit();
    await BackGroundSupport.updateStore();
  },
  start: async() => {
    await BackGroundSupport.dataLoader();
    BackGroundSupport.registerBrowserCalls();
    BackGroundSupport.activeIcon();
  },
  stop: () => {
    BackGroundSupport.deleteListeners();
    BackGroundSupport.inactiveIcon()
  },
  activeIcon: () => {
    browser.browserAction.setIcon({
      path: {
        16: "../icons/SwaVan16.png",
        32: "../icons/SwaVan32.png",
        48: "../icons/SwaVan48.png",
        64: "../icons/SwaVan64.png",
        96: "../icons/SwaVan96.png",
        128: "../icons/SwaVan128.png",
      },
    })
  },
  inactiveIcon: () => {
    browser.browserAction.setIcon({
      path: {
        16: "../icons/SwaVanDisable16.png",
        32: "../icons/SwaVanDisable32.png",
        48: "../icons/SwaVanDisable48.png",
        64: "../icons/SwaVanDisable64.png",
        96: "../icons/SwaVanDisable96.png",
        128: "../icons/SwaVanDisable128.png",
      },
    })
  },
  updateSetting: async() => {
    await store.dispatch("loadSetting");
    this.data.isReloadActive = store.getters.isReloadActive()
  },
  isReloadActive: () => store.getters.isReloadActive(),
  refresh: async () => {
    extensionTabReload();
    if(BackGroundSupport.isReloadActive() ) {
      const _tabs = await browser.tabs.query({currentWindow: true, active: true});
      if(_tabs && _tabs.length > 0) {
        const _current_tab = _tabs[0];
        if(_current_tab.url) {
          browser.tabs.reload()
          return
        }
      }
    }
  }
}

export const extensionTabReload = () => {
  const searchURL = '/swavan-rules'
  const url = browser.runtime.getURL(searchURL);
  const extension = browser.extension;
  const _filter = (_tab) => _tab.location.origin === url.replace(searchURL,"");

  const _pops = extension.getViews({type: "popup"}).filter(_filter)
  
  if (_pops && _pops.length > 0) {
    const _tabs = extension.getViews({type: "tab"}).filter(_filter)
    if (_tabs && _tabs.length > 0) {
      _tabs[0].location.reload();
      return
    }
  }
}
