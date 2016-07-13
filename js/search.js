// 测试页面
require('semantic-ui/dist/components/reset.css');
require('semantic-ui/dist/components/site.css');
require('semantic-ui/dist/components/icon.css');
require('semantic-ui/dist/components/button.css');
require('semantic-ui/dist/components/grid.css');
require('semantic-ui/dist/components/input.css');
//require('semantic-ui/dist/components/form.css');
//require('semantic-ui/dist/components/segment.css');
require('semantic-ui/dist/components/menu.css');
require('semantic-ui/dist/components/search.css');
require('mixin/mixin-loading.less'); // 加载中
require('page/search.less');

require('common/common');
let $ = require('jquery');
let http = require('module/http');
let Paging = require('module/paging'); // 异步分页
let $searchRes = $('.search-res');
let $articleList = $searchRes.find('.article-list');
let paging = new Paging('', {
  selectedClass: 'blue',
  selectedPage: window.params.pageNum
});

// 显示加载搜索结果动画
let showLoading = function () {
  $searchRes.addClass('show-loading');
};
// 限期加载搜索结果动画
let hideLoading = function () {
  $searchRes.removeClass('show-loading');
}
// 获取搜索结果
let getSearchRes = function () {
  showLoading();
  http.partialsSearch(window.params.keyword, window.params.pageNum, window.params.pageSize)
    .then(function (res) {
      hideLoading();
      if (res.error) {
        alert('获取失败，请重试');
        return console.log(res);
      }
      $articleList.html(res);
    });
};

// 更新分页
paging.updatePage({
  total       : parseInt(window.params.total, 10),
  limit       : window.params.pageSize,
  pagingAction:function( options ){
    // 分页动作回调
    window.params.pageNum = options.currentPage;
    getSearchRes();
  }
});

$('.search-options')
  // 回车搜索
  .on('keyup', '.search-input input', function (e) {
    window.params.keyword = $(this).val();
    if (e.keyCode === 13) {
      getSearchRes();
    }
  })
  // 点击搜索
  .on('click', '.search-icon', function () {
    getSearchRes();
  })
