import { BackGroundSupport, extensionTabReload } from './support';

import { actions } from './models';

let background = {...BackGroundSupport}

browser.runtime.onMessage.addListener(async (request) => {
    if (request["action"]) {
      const _action = request["action"]
      switch (_action) {
        case actions.RELOAD : {
          if ( background ) {
            await background.dataLoader();
            await background.refresh()
          }
          break;
        }
        case actions.URL_RELOAD: {
          if(background) {
            await background.dataLoader();
            background.reattached()
            await background.refresh()
          }
          break
        }
        case actions.TYPES_UPDATE: {
          if(background) {
            await background.dataLoader();
            background.reattached()
            await background.refresh()
          }
          break
        }
        case actions.CONNECT: {
          background = {...BackGroundSupport};
          if(background && background.start) {
            background.start()
          }
          await background.refresh()
          break;
        }
        case actions.DISCONNECT: {
          if(background && background.stop) {
            background.stop();
          }
          background = {};
          extensionTabReload();
          break;
        }
        case actions.ENABLE_REFRESH: {
          if(background) {
            await background.updateSetting()
            await background.refresh()
          }
          break;
        }
        case actions.DISABLE_REFRESH: {
          if(background) {
            await background.updateSetting()
            await background.refresh()
          }
          break;
        }
        case actions.HARD_RELOAD: {
          await background.refresh()
        }
      }    
    }
  })
background.start();
