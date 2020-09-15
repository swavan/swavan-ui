
import { BackGroundSupport } from './support';
import { actions } from './models';

let background = {...BackGroundSupport}

browser.runtime.onMessage.addListener(async (request) => {

  if (request["action"]) {
    const _action = request["action"]
    switch (_action) {
      case actions.RELOAD : {
        if ( background ) {
          await background.storeInit();
          await background.updateStore();
          if(background.isReloadActive()) {
            background.refresh()
          }
        }
        break;
      }
      case actions.URL_RELOAD: {
        if(background) {
          await background.storeInit();
          await background.updateStore();
          background.reattached()
          if(background.isReloadActive()) {
            background.refresh()
          }
        }
        break
      }
      case actions.CONNECT: {
        background = {...BackGroundSupport};
        if(background && background.isReloadActive()) {
          background.refresh()
        }
        break;
      }
      case actions.DISCONNECT: {

        if(background && background.isReloadActive()) {
          background.stop();
        }
        background = null; 
        break;
      }
      case actions.ENABLE_REFRESH || actions.DISABLE_REFRESH: {
        if(background) {
          await background.updateSetting()
          if(background.isReloadActive()) {
            background.refresh()
          }
        }
        break;
      }
      case actions.FULL_SCREEN_MODE: {
        //TODO
        break;
      }
    }    
  }
})


background.start()
.catch(err => console.log(err));
