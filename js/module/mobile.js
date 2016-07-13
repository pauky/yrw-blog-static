/**
 * Author: pauky
 * Date: 2015/12/16
 * Verson: 0.1
 */
let $ = require('jquery');
let $body = $('body');
class Mobile {
  constructor() {
    this.isMobile = this.judgeMobile();
  }
  judgeMobile() {
    let navigatorUserAgent = navigator.userAgent;
    let isMobile = !!navigatorUserAgent.match(/AppleWebKit.*Mobile.*/) || navigatorUserAgent.indexOf('Android') > -1 || navigatorUserAgent.indexOf('Linux') > -1 || navigatorUserAgent.indexOf('iPhone') > -1;
    return $body.width() < 960 || isMobile;
  }
}

export default new Mobile();