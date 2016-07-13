/**
 * Author: glowry
 * Date: 2015/12/9
 * Verson: 0.1
 */
var
  $ = require('jquery'),
  _ = require('underscore'),
  http = require('module/http');

var Paging = function (container, options) {
  this.init(container, options);
};

Paging.prototype.init = function (container, options) {
  var _self = this;
  _self.container = container || '.mixin-paging';
  _self.options = $.extend(true, {
    total: 0, // 案例数
    limit: 20, // 每页显示10条
    totalPageNum: 0, // 页码总数
    currentPage: 1, // 当前页数
    pageArr: [], // 页码容器
    selectedPage: 1, // 默认选中的页码
    selectedClass: 'selected', // 页码选中时的样式
    disabledClass: 'disabled-action', // 翻页禁用时的样式
    pagingAction: function () {
      // 分页回调
    }
  }, options);
  console.log(_self.options);
  _self.$dom = $(_self.container);
  _self.onEvents();
  return this;
};

Paging.prototype.updatePage = function (options) {
  var _self = this;
  _self.options = $.extend(true, _self.options, options);
  if (parseInt(_self.options.total, 10) === 0) {
    return _self.$dom.addClass('hidden');
  } else {
    _self.$dom.removeClass('hidden');
  }
  _self.options.totalPageNum = Math.ceil(_self.options.total / _self.options.limit); // 计算总页数
  _self.options.pageArr = [];
  for (var i = 0; i < _self.options.totalPageNum; i += 1) {
    // 生成包含所有页码的数组
    _self.options.pageArr.push(i+1);
  }

  var disabledClass = _self.options.disabledClass;
  var selectedClass = _self.options.selectedClass;
  var notUpdatePage = _self.options.totalPageNum <= 7; // 如果页数小于等于7，则切换页码时不用计算页码

  _self.options.updatePage = function (selectedPage) {
    // 生成或更新分页
    var selectPageIndex = _.find(_self.options.pageArr, function (item) { return item === selectedPage; }); // 选中页码在pageArr中对应的索引
    var newPages = [];
    var html = '';
    if (notUpdatePage) {
      newPages = _self.options.pageArr
    } else {
      if (selectPageIndex > 4) {
        if ((_self.options.totalPageNum-selectPageIndex) < 3) {
          // 选中的页码接下去的页数小于3
          newPages = _self.options.pageArr.slice(selectedPage+(_self.options.totalPageNum-selectPageIndex)-7, selectedPage+(_self.options.totalPageNum-selectPageIndex));
        } else {
          // 选中的页码前后页数都大于等于3页
          newPages = _self.options.pageArr.slice(selectedPage-4, selectedPage+3);
        }
      } else {
        newPages = _self.options.pageArr.slice(0, 7);
      }
    }

    html += '<span class="ui icon button pre-page"><i class="left chevron icon"></i></span>';
    _.each(newPages, function (item) {
      if (item === selectedPage) {
        // 增加选中样式
        html += '<span class="ui icon button page '+selectedClass+'">'+item+'</span>';
      } else {
        html += '<span class="ui icon button page">'+item+'</span>';
      }
    });
    html += '<span class="ui icon button next-page"><i class="right chevron icon"></i></span>';
    _self.$dom.find('.paging').html(html);

    // 更新上下页按钮状态
    if (_self.options.totalPageNum === 1) {
      _self.$dom.find('.pre-page').addClass(disabledClass);
      _self.$dom.find('.next-page').addClass(disabledClass);
    } else {
      if (_self.options.currentPage === _self.options.totalPageNum) {
        // 最后一页
        _self.$dom.find('.pre-page').removeClass(disabledClass);
        _self.$dom.find('.next-page').addClass(disabledClass);
      } else if (_self.options.currentPage == 1) {
        // 第一页
        _self.$dom.find('.pre-page').addClass(disabledClass);
        _self.$dom.find('.next-page').removeClass(disabledClass);
      } else {
        _self.$dom.find('.pre-page').removeClass(disabledClass);
        _self.$dom.find('.next-page').removeClass(disabledClass);
      }
    }

  };

  // 初始化分页
  _self.options.updatePage(_self.options.selectedPage);

  return this;
};

Paging.prototype.onEvents = function () {
  var _self = this;
  _self.$dom
    .on('click', '.page', function () {
      // 选中页码
      $(this).closest(_self.container).find('.page').removeClass(_self.options.selectedClass);
      $(this).addClass(_self.options.selectedClass);
      _self.options.currentPage = parseInt($(this).text(), 10);
      _self.options.pagingAction(_self.options);
      _self.options.updatePage(_self.options.currentPage);
    })
    .on('click', '.next-page', function () {
      // 下一页
      if (_self.options.currentPage === _self.options.totalPageNum || $(this).hasClass(_self.options.disabledClass)) {
        return false;
      }
      $(this).closest(_self.container).find('.page').removeClass(_self.options.selectedClass).eq(_self.options.currentPage).addClass(_self.options.selectedClass);
      _self.options.currentPage += 1;
      _self.options.pagingAction(_self.options);
      _self.options.updatePage(_self.options.currentPage);
    })
    .on('click', '.pre-page', function () {
      // 上一页
      if (_self.options.currentPage === 1 || $(this).hasClass(_self.options.disabledClass)) {
        return false;
      }
      _self.options.currentPage -= 1;
      $(this).closest(_self.container).find('.page').removeClass(_self.options.selectedClass).eq(_self.options.currentPage - 1).addClass(_self.options.selectedClass);
      _self.options.pagingAction(_self.options);
      _self.options.updatePage(_self.options.currentPage);
    })
    // 默认选中的页数
    .find('.page').eq(_self.options.selectedPage-1).addClass(_self.options.selectedClass);
};

export default Paging;