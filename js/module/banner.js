/**
 * Author: pauky
 * Date: 2016/2/29
 * Verson: 0.1
 */
// banner
require('mixin/mixin-banner.less');

class Banner {
  constructor() {
    this.init();
  }

  // 初始化
  init(container, options) {
    this.onEvents();
  }

  // 监听事件
  onEvents() {
  }

}

export default new Banner();