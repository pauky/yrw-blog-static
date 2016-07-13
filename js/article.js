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
require('semantic-ui/dist/components/label.css');
//require('semantic-ui/dist/components/comment.css');
//require('semantic-ui/dist/semantic.min.css');
//require('editor.md/lib/codemirror/codemirror.min.css'); // markdown编辑器编辑部分的样式
require('editor.md/css/editormd.css');
require('page/article.less');

require('common/common');
let $ = require('jquery');
require('jquery-lazyload/jquery.lazyload');

// 图片懒加载
$('img[data-lazy="true"]').lazyload({
  effect : "fadeIn"
});