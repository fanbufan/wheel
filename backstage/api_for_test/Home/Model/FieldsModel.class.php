<?php
namespace Home\Model;
use Think\Model;

class FieldsModel extends Model {
  function getField(){
  	$res = $this -> order('id') -> select();
  	return $res;
  }
}