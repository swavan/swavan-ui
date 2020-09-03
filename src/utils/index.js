import { BROWSERS } from '../models'
export const Browser = {};
const vendor = (navigator && navigator.vendor || '').toLowerCase();
const userAgent = (navigator && navigator.userAgent || '').toLowerCase();

Browser.getBrowserName = () => {
  console.log("vendor: ", vendor)
  console.log("userAgent: ", userAgent)
  if(isOpera()) return BROWSERS.OPERA; // Opera
  else if(isChrome()) return BROWSERS.CHROME; // Chrome
  else if(isFirefox()) return BROWSERS.FIREFOX; // Firefox
  else if(isSafari()) return BROWSERS.SAFARI; // Safari
  else if(isInternetExplorer()) return BROWSERS.INTERNET_EXPLORE; // Internet Explorer
}


// Start Detecting browser helpers functions
function isOpera() {
  const isOpera = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
  return isOpera !== null;
}

function isChrome() {
  const isChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
  return isChrome !== null;
}

function isFirefox() {
  const isFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
  return isFirefox !== null;
}

function isSafari() {
  const isSafari = userAgent.match(/version\/(\d+).+?safari/);
  return isSafari !== null;
}

function isInternetExplorer() {
  const isInternetExplorer = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
  return isInternetExplorer !== null;
}
// End Detecting browser helpers functions

// export default { Browser }