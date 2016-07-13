// 数据可视化视图页面

// 样式
require('semantic-ui/dist/components/reset.css');
require('semantic-ui/dist/components/site.css');
require('semantic-ui/dist/components/icon.css');
require('semantic-ui/dist/components/input.css');
require('semantic-ui/dist/components/menu.css');
require('page/data-view.less');

// 脚本
require('common/common');
let $ = require('jquery');
let _ = require('underscore');
require('d3/d3.js');
let d3pie = require('d3pie/d3pie/d3pie.js');
let http = require('module/http.js');
let mobile = require('module/mobile.js');

let tagPieInstance  = null;
let color = d3.scale.category10(); // color 是一个颜色比例尺，它能根据传入的索引号获取相应的颜色值

// 初始化标签文章数据
let initTagArticleData = function (jData) {
  let tagPieData = null;
  http.apiCountTagArticle()
    .then(function (res) {
      if (res.error) {
        return false;
      }
      tagPieData = res.result;
      tagPieData = _.map(tagPieData, function (item, i) {
        item.color = color(i);
        return item;
      });
      if (_.isFunction(jData.cb)) {
        jData.data = tagPieData;
        jData.cb(jData);
      }
    });
};

// 构建标签饼图
let createTagPie = function (jData) {
  tagPieInstance = new d3pie("tagPie", {
    "header": {
      "title": {
        "text": "标签文章数统计",
        "fontSize": 24,
        "font": "open sans",
        "color": "#333333"
      },
      "subtitle": {
        "text": "",
        "color": "#999999",
        "fontSize": 12,
        "font": "open sans"
      },
      "titleSubtitlePadding": 9
    },
    "footer": {
      "color": "#999999",
      "fontSize": 10,
      "font": "open sans",
      "location": "bottom-left"
    },
    "size": {
      "canvasWidth": jData.width || 400,
      "canvasHeight": jData.height || 400,
      "pieOuterRadius": "90%"
    },
    "data": {
      "sortOrder": "value-desc",
      "content": jData.data
    },
    "labels": {
      "outer": {
        "pieDistance": 32
      },
      "inner": {
        "hideWhenLessThanPercentage": 3
      },
      "mainLabel": {
        "fontSize": 11
      },
      "percentage": {
        "color": "#ffffff",
        "decimalPlaces": 0
      },
      "value": {
        "color": "#adadad",
        "fontSize": 11
      },
      "lines": {
        "enabled": true
      },
      "truncation": {
        "enabled": true
      }
    },
    "effects": {
      "pullOutSegmentOnClick": {
        "effect": "linear",
        "speed": 400,
        "size": 8
      }
    },
    "misc": {
      "gradient": {
        "enabled": true,
        "percentage": 100
      }
    }
  });
};

// 获取类型文章数据
let getTypeArticleData = function (jData) {
  http.apiCountTypeArticle()
    .then(function (res) {
      if (res.error) {
        return false;
      }
      if (_.isFunction(jData.cb)) {
        jData.width = jData.width ? jData.width*0.6 : jData.width;
        jData.height = jData.height ? jData.height*0.6 : jData.height;
        jData.data = res.result;
        jData.cb(jData);
      }
    });
};

// 获取类型文章饼图
let createTypeArticlePie = function (jData) {

  var width = jData.width || 400;
  var height = jData.height || 400;
  var data = jData.data;
  var dataset = _.map(data, function (item) {
    return item.value;
  });
  var svgContainer = d3.select("#typeArticlePie");
  var totalSize = _.reduce(dataset, function(memo, num){ return memo + num; }, 0);
  var svg, pie, piedata, arc, pieChartElement, arcs;
  var color = d3.scale.category10(); // 颜色分配器

  // 添加标题
  var addTitle = function () {
    svgContainer
      .append("p")
      .text('类型文章数量统计')
      .attr('class', 'title');
  };

  // 创建svg
  var createSvg = function () {
    svg = svgContainer
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  };

  // 初始化数据
  var initData = function () {
    pie = d3.layout.pie();
    piedata = pie(dataset);
    var outerRadius = width/2;	//外半径
    var innerRadius = 0;	//内半径，为0则中间没有空白

    arc = d3.svg.arc()	//弧生成器
      .innerRadius(innerRadius)	//设置内半径
      .outerRadius(outerRadius) //设置外半径
      .startAngle(0)
      .endAngle(function(d) {
        return (d.value / totalSize) * 2 * Math.PI;
      });
  };

  // 创建饼图
  var createPie = function () {
    pieChartElement = svg
      .append('g')
      .attr("transform", "translate("+ (width/2) +","+ (width/2) +")")
      .attr("class", "pieChart");
    arcs = pieChartElement.selectAll(".pie-item")
      .data(piedata)
      .enter()
      .append("g")
      .attr('class', 'pie-item')
      .attr("transform",
      function(d, i) {
        var angle = 0;
        if (i > 0) {
          angle = (dataset[i-1]/totalSize)*360;
        }
        return "rotate(" + angle + ")";
      });
  };

  // 渲染(添加颜色与动画)
  var render = function () {
    arcs.append("path")
      .attr("fill",function(d,i){
        return color(i);
      })
      .transition()
      .ease("cubic-in-out")
      .duration(1000)
      .attrTween("d", function(b) {
        var i = d3.interpolate({ value: 0}, b);
        return function(t) {
          return arc(i(t));
        };
      });
  };

  // 添加备注
  var addText = function () {
    arcs.append("text")
      .attr("transform",function(d, i){
        var angle = 0;
        if (i > 0) {
          angle = 360 - (dataset[i-1]/totalSize)*360;
        }
        return "translate(" + arc.centroid(d) + "), rotate(" + angle + ")";
      })
      .attr("text-anchor","middle")
      .text(function(d, i){
        return (data[i].label === 'tech' ? '技术' : '生活杂记') + '：' + d.data;
      })
      .style("font-size", (width > 320 ? 14 : 12) + "px")
      .attr("fill", function(d) { return '#fff'; });
  };

  // 程序入口
  var main = function () {
    addTitle();
    createSvg();
    initData();
    createPie();
    render();
    addText();
  };

  main();

};

let getMonthArticle = function (jData) {
  http.apiCountMonthArticle(2015)
    .then(function (res) {
      if (res.error) {
        return false;
      }
      //jData.nums = _.pluck(res.result.monthArticles, 'num');
      jData.res = res.result;
      if (_.isFunction(jData.cb)) {
        jData.cb(jData);
        //createCluster({data: res.result.clusterJson});
      }
    });
};

let createMonthArticleHistogram = function (jData) {
  //画布大小
  var width = 400;
  var height = 400;
  var svgContainer = d3.select("#monthArticleHistogram");

  // 添加标题
  var addTitle = function () {
    svgContainer
      .insert("p")
      .text('2015文章数量统计')
      .attr('class', 'title');
  };
  addTitle();

  //在 body 里添加一个 SVG 画布
  var svg = svgContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //画布周边的空白
  var padding = {left:30, right:30, top:20, bottom:20};

  //定义一个数组
  var dataset = _.pluck(jData.res.monthArticles, 'num');

  //x轴的比例尺
  var xScale = d3.scale.ordinal()
    .domain(d3.range(1, dataset.length+1))
    .rangeRoundBands([0, width - padding.left - padding.right]);

  //y轴的比例尺
  var yScale = d3.scale.linear()
    .domain([0,d3.max(dataset)])
    .range([height - padding.top - padding.bottom, 0]);

  //定义x轴
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  //定义y轴
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  //矩形之间的空白
  var rectPadding = 4;

  //添加矩形元素
  var rects = svg.selectAll(".MyRect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class","MyRect")
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function(d,i){
      return xScale(i+1) + rectPadding/2;
    })
    .attr("width", xScale.rangeBand() - rectPadding)
    .attr("y",function(d){
      var min = yScale.domain()[0];
      return yScale(min);
    })
    .attr("height", function(d){
      return 0;
    })
    .on('click', function (d, i) {
      createCluster({data: jData.res.monthArticles[i].clusterJson});
    })
    .transition()
    //.delay(function(d, i){
    //  return i * 200;
    //})
    .duration(2000)
    .ease("bounce")
    .attr("y",function(d){
      return yScale(d);
    })
    .attr("height", function(d){
      return height - padding.top - padding.bottom - yScale(d);
    });

  //添加文字元素
  var texts = svg.selectAll(".MyText")
    .data(dataset)
    .enter()
    .append("text")
    .attr("class","MyText")
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function(d,i){
      return xScale(i+1) + rectPadding/2;
    } )
    .attr("dx",function(){
      return (xScale.rangeBand() - rectPadding)/2;
    })
    .attr("dy",function(d){
      return 20;
    })
    .text(function(d){
      return d;
    })
    .attr("y",function(d){
      var min = yScale.domain()[0];
      return yScale(min);
    })
    .transition()
    //.delay(function(d,i){
    //  return i * 200;
    //})
    .duration(2000)
    .ease("bounce")
    .attr("y",function(d){
      return yScale(d);
    });

  //添加x轴
  svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis);

  //添加y轴
  svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis);
};

// 构建集群图
let createCluster = function (jData) {
  var svgContainer = d3.select('#clusterDiagram');
  var width = 500,
    height = 500;

  svgContainer.select('.cluster').remove();

  var cluster = d3.layout.cluster()
    .size([width, height - 200]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var svg = svgContainer.append("svg")
    .attr('class', 'cluster')
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");

    var nodes = cluster.nodes(jData.data);
    var links = cluster.links(nodes);

    var link = svg.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", diagonal);

    var node = svg.selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    node.append("circle")
      .attr("r", 4.5);

    node.append("text")
      .attr("dx", function(d) { return d.children ? -4 : 8; })
      .attr("dy", 3)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });
};

// 程序入口
let main = function (width, height) {
  initTagArticleData({cb: createTagPie, width: width, height: height});
  getTypeArticleData({cb: createTypeArticlePie, width: width, height: height});
  getMonthArticle({cb: createMonthArticleHistogram});
};

$(function () {
  let
    width,
    height,
    $body = $('body');
  if (mobile.isMobile) {
    width = $body.width() - 10;
    width && (height = width);
  }
  main(width, height);
});