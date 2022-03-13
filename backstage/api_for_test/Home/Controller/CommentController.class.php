<?php
namespace Home\Controller;
use Think\Controller;

class CommentController extends Controller {
	public function submitComment(){
		$userId = I('post.userId');
		$starNum = I('post.starNum');
		$comment = I('post.comment');

		$commentDB = D('Comment');

		$this -> ajaxReturn($commentDB -> submitComment($userId, $starNum, $comment));
	}

	public function getComments(){
		$page = I('post.page');
		$field = I('post.field');

		$commentDB = D('Comment');

		$this -> ajaxReturn($commentDB -> getComments($page, $field));
	}
}