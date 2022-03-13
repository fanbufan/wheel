<?php
namespace Home\Model;
use Think\Model\RelationModel;

class CommentModel extends RelationModel {
	protected $_link = array(
    'user' => array(
      'mapping_type' => self::BELONGS_TO, 
      'class_name' => 'user', 
      'foreign_key' => 'user_id', 
      'mapping_name' => 'nickname,avatar', 
      'as_fields' => 'nickname,avatar'
    )
  );

  function submitComment($userId, $starNum, $comment){
  	$map['user_id'] = $userId;
    $map['reply_id'] = 0;

  	$count = $this -> where($map) -> count();

  	if($count >= 2){
  		return [
        'error_code' => '10010',
        'error_msg' => 'This user\'s comment has been exist in database.'
  		];
  	}

    if($count == 1){
      $data['is_add_comment'] = 1;
    }

  	$data['user_id'] = $userId;
  	$data['star_num'] = $starNum;
  	$data['comment'] = $comment;
    $data['uptime'] = strtotime(date('Y-m-d H:i:s')); 

  	$id = $this -> data($data) -> filter('strip_tags') -> add();

  	if($id){
  		$condition['id'] = $id;
  		$res = $this -> where($condition) -> relation(true) -> find();

      $map_s['status'] = 1;
      $map_s['is_add_comment'] = 0;
      $map_s['is_reply'] = 0;

      $count_0 = $this -> where($map_s) -> count();
      
      for($i = 1; $i <= 5; $i++){
        if($i == 1){
          $map_s['star_num'] = 1;
          $count_3 = $this -> where($map_s) -> count();
        }else if($i <= 4 && $i >= 2){
          $map_s['star_num'] = array(array('ELT', 4), array('EGT', 2), 'and');
          $count_2 = $this -> where($map_s) -> count();
        }else if($i == 5){
          $map_s['star_num'] = 5;
          $count_1 = $this -> where($map_s) -> count();
        }
      }
      
  		return [
        'res' => $res,
        'num' => [$count_0, $count_1, $count_2, $count_3]
      ];
  	}
  }

  function getComments($page, $field){
    $map['status'] = 1;
    $map['is_add_comment'] = 0;
    $map['is_reply'] = 0;

    $map_s['status'] = 1;
    $map_s['is_add_comment'] = 0;
    $map_s['is_reply'] = 0;

    $count_0 = $this -> where($map_s) -> count();
    
    for($i = 1; $i <= 5; $i++){
      if($i == 1){
        $map_s['star_num'] = 1;
        $count_3 = $this -> where($map_s) -> count();
      }else if($i <= 4 && $i >= 2){
        $map_s['star_num'] = array(array('ELT', 4), array('EGT', 2), 'and');
        $count_2 = $this -> where($map_s) -> count();
      }else if($i == 5){
        $map_s['star_num'] = 5;
        $count_1 = $this -> where($map_s) -> count();
      }
    }

    switch($field){
      case '0':
        break;
      case '1':
        $map['star_num'] = 5;
        break;
      case '2':
        $map['star_num'] = array(array('ELT', 4), array('EGT', 2), 'and'); 
        break;
      case '3':
        $map['star_num'] = 1;
        break;
      default:
        $map['star_num'] = 5;   
    }

    $count = $this -> where($map) -> count();
    $itemNum = 10;
    $pages = ceil($count / $itemNum);
    $from = $page * $itemNum;
    $res = $this -> where($map) -> relation(true) -> limit($from, $itemNum) -> order('id desc') -> select();
    return [
      'res' => $res,
      'pages' => $pages,
      'num' => [$count_0, $count_1, $count_2, $count_3]
    ];
  }
}