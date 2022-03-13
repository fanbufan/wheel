<?php
namespace Home\Model;
use Think\Model;

class CoursesModel extends Model {
	function getCourse(){
      $map['status'] = 1;

      $res = $this -> order('id') -> where($map) -> select();
      return $res;
	}


	function getCourses($page){
    $map['status'] = 1;

    $count = $this -> where($map) -> count();

    $pages = ceil($count / 6);

		$from = $page * 6;

		$res = $this -> where($map) -> limit($from, '6') -> select();
		return [
      'res' => $res,
      'pages' => $pages
		];
	}

	function removeCourse($id, $page, $searchStatus, $keyword){
		$map['id'] = $id;
		$data['status'] = 0;

		$action = $this -> where($map) -> data($data) -> filter('strip_tags') -> save();

		if($action){
			if($searchStatus){
				$condition['course'] = array('like', '%' . $keyword . '%');
			}
			$condition['status'] = 1;
			$count = $this -> where($condition) -> count();
      $pages = ceil($count / 6);
      $from = $page * 6;
      $res = $this -> where($condition) -> limit($from, '6') -> select();
			return [
	      'res' => $res,
	      'pages' => $pages
			];
		}
	}

	function changeCourseName($id, $courseName){
		$map['id'] = $id;
		$data['course'] = $courseName;

		$action = $this -> where($map) -> data($data) -> filter('strip_tags') -> save();

		$res = $this -> where($map) -> getField('course');
		return $res;
	}

	function searchCourses($keyword, $page){
		$map['course'] = array('like', '%' . $keyword . '%');
		$map['status'] = 1;

		$count = $this -> where($map) -> count();

		$pages = ceil($count / 6);

		$from = $page * 6;

		$res = $this -> where($map) -> order('id') -> limit($from, '6') -> select();

		return [
      'res' => $res,
      'pages' => $pages
		];
	}
}