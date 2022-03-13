<?php
namespace Home\Model;
use Think\Model\RelationModel;

header("Access-Control-Allow-Origin: *");

class WkvideocoursesModel extends RelationModel {
	protected $_link = array(
		'Classfield' => array(
			'mapping_type' => self::BELONGS_TO, 
			'class_name' => 'Classfield', 
			'foreign_key' => 'kind', 
			'mapping_name' => 'topic', 
			'as_fields' => 'topic'
		), 
		'Lecturer' => array(
			'mapping_type' => self::BELONGS_TO, 
			'class_name' => 'Lecturer', 
			'foreign_key' => 'lecturer', 
			'mapping_name' => 'name,intro,avatar,part', 
			'as_fields' => 'name,intro,avatar,part'
		)
	);

	function getWkCourses($page){
		$map['field'] = 'jap';
        $map['first'] = 1;

		$from = $page * 15;

		$res = $this -> where($map) -> limit($from, '10') -> order('watched desc') -> relation(true) -> select();
		return $res;
	}

	function getCoursesImg(){

		$map['first'] = 1;

		$res = $this -> where($map) -> order('watched desc') -> field('folder') -> select();

		return $res;
	}
}