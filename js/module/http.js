/**
 * Author: pauky
 * Date: 2015/12/9
 * Verson: 0.1
 */
let $ = require('jquery');
let _blogRoot = "";
let _blogApi = "/api";
let _blogPart = "/partials";
class Http {

  /**
   * 搜索(异步)
   * @param keyword
   * @param pageNum
   * @param pageSize
   */
  partialsSearch(keyword, pageNum, pageSize) {
    var _data = {
      url :_blogPart + "/search",
      type: 'post',
      data: {
        keyword: keyword,
        pageNum: pageNum,
        pageSize: pageSize
      }
    };
    return $.ajax(_data);
  }

  /**
   * 标签文章数量统计
   * URL: `/api/countTagArticle`
   */
  apiCountTagArticle() {
    var _data = {
      url: _blogApi + '/countTagArticle',
      type: 'post'
    };
    return $.ajax(_data);
  }

  /**
   * 类型文章数量统计
   * URL: `/api/countTypeArticle`
   */
  apiCountTypeArticle() {
    var _data = {
      url: _blogApi + '/countTypeArticle',
      type: 'post'
    };
    return $.ajax(_data);
  }

  /**
   * 月份文章统计
   * URL: `/api/countMonthArticle`
   * @param year 年份
   */
  apiCountMonthArticle(year) {
    var _data = {
      url: _blogApi + '/countMonthArticle',
      type: 'post',
      data: {
        year: year
      }
    };
    return $.ajax(_data);
  }


}

export default new Http();