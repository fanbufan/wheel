<?php
namespace Home\Controller;
use Think\Controller;

header("Access-Control-Allow-Origin: *");

class IndexController extends Controller {
  public function index(){

    $this -> assign('data', '[
          {
            "title": "HTML/CSS基础+进阶+实战",
            "img": "img/html_css.png",
            "content": "HTML是网页内容的载体。内容就是网页制作者放在页面上想要让用户浏览的信息，可以包含文字、图片、视频等；CSS样式是表现。就像网页的外衣。比如，标题字体、颜色变化，或为标题加入背景图片、边框等。所有这些用来改变内容外观的东西称之为表现。"
          },
          {
            "title": "JavaScript基础+进阶+高级应用",
            "img": "img/js.png",
            "content": "JavaScript是用来实现网页上的特效效果。如：鼠标滑过弹出下拉菜单。或鼠标滑过表格的背景颜色改变。还有焦点新闻（新闻图片）的轮换。可以这么理解，有动画的，有交互的一般都是用JavaScript来实现的。"
          },
          {
            "title": "HTML5技术",
            "img": "img/html5.png",
            "content": "HTML5是最新一代的HTML标准，它不仅拥有HTML中所有的特性，而且增加了许多实用的特性，如视频、音频、画布（canvas）等。2012年12月17日，万维网联盟（W3C）正式宣布凝结了大量网络工作者心血的HTML5规范已经正式定稿。”"
          },
          {
            "title": "VueJS基础+进阶+去哪儿网项目",
            "img": "img/vue.png",
            "content": "Vue是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue也完全能够为复杂的单页应用提供驱动。"
          },
          {
            "title": "一些列补充技术",
            "img": "img/buchong.png",
            "content": "Sass/Less完全兼容所有版本的CSS。我们对此严格把控，所以你可以无缝地使用任何可用的CSS库。Bootstrap是简洁、直观、强悍的前端开发框架，让web开发更迅速、简单。Git是一个开源的分布式版本控制系统，用于敏捷高效地处理任何或小或大的项目。"
          }
        ]');

    $this -> assign('config', '{
      "color": "danger",
      "tabs": ["HTML/CSS","JavaScript","HTML5技术","VueJS","补充技术"]
    }');

    $this -> display();
  }

  public function getCourses(){
  	//$page = I('get.page');
    $page = I('post.page');

    $course = D('Courses');
    
    $this -> ajaxReturn($course -> getCourses($page));
  }

  public function getCourse(){
    $courses = D('Courses');
    $fields = D('Fields');

    $courseDatas = $courses -> getCourse();
    $courseFields = $fields -> getField();

    $_arr = [
      course_data => $courseDatas,
      course_field => $courseFields
    ];

    $this -> ajaxReturn($_arr);
  }

  public function removeCourse(){
    $id = I('post.id');
    $page = I('post.page');
    $searchStatus = I('post.searchStatus');
    $keyword = I('post.keyword');

    $course = D('Course');

    $this -> ajaxReturn($course -> removeCourse($id, $page, $searchStatus, $keyword));
  }

  public function changeCourseName(){
    $id = I('post.id');
    $courseName = I('post.value');

    $course = D('Course');

    $this -> ajaxReturn($course -> changeCourseName($id, $courseName));
  }

  public function searchCourses(){
    $keyword = I('post.keyword');
    $page = I('post.page');

    $course = D('Course');

    $this -> ajaxReturn($course -> searchCourses($keyword, $page));
  }
}