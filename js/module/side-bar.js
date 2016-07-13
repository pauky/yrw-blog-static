/**
 * Author: pauky
 * Date: 2016/2/29
 * Verson: 0.1
 */
// 侧栏模块
let $ = require('jquery');
require('semantic-ui/dist/components/sidebar.js');
require('semantic-ui/dist/components/sidebar.css');

class SideBar {
  constructor() {
    this.init();
  }

  // 初始化
  init(container, options) {
    this.onEvents();
  }

  // 监听事件
  onEvents() {
    let _self = this;
    $('.mixin-top-bar')
      // 监听菜单按钮
      .on('click', '.menu-icon', function () {
        $('body').find('.ui.sidebar').sidebar('toggle');
      })
  }

}

export default new SideBar();