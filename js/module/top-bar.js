/**
 * Author: pauky
 * Date: 2015/12/10
 * Verson: 0.1
 */
// 页面头部模块
let $ = require('jquery');

class TopBar {
  constructor(container, options) {
    this.init(container, options);
  }

  // 初始化
  init(container, options) {
    this.container = container || '.mixin-top-bar';
    this.options = $.extend(true, {}, options);
    this.$container = $(this.container);
    this.keyword = '';
    this.pageNum = 1;
    this.pageSize = 20;
    this.onEvents();
  }

  // 跳转到搜索页
  jumpToSearch(keyword, pageNum, pageSize) {
    let href = window.portalUrl + '/search';
    if (this.keyword) {
      href += '/' + this.keyword;
    }
    if (this.pageNum) {
      href += '/' + this.pageNum;
      if (this.pageSize) {
        href += '-' + this.pageSize;
      }
    }
    window.location.href = href;
  }

  // 监听事件
  onEvents() {
    let _self = this;
    this.$container
      // 监听搜索框
      .on('keyup', '.search-input', function (e) {
        _self.keyword = $(this).val();
        if (e.keyCode === 13 && _self.keyword) {
          _self.jumpToSearch();
        }
      })
      // 监听搜索按钮
      .on('click', '.search-icon', function () {
        if (!_self.keyword) {
          return false;
        }
        _self.jumpToSearch();
      })
      // 监听菜单按钮
      .on('click', '.menu-icon', function () {
        $('body').find('.ui.sidebar').sidebar('toggle');
      })
  }

}

export default new TopBar();