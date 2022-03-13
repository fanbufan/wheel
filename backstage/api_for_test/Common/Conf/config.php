<?php
return array(
	//'配置项'=>'配置值'
	'DB_TYPE'   => 'mysql', // 数据库类型
	'DB_HOST'   => 'localhost', // 服务器地址
	'DB_NAME'   => 'study', // 数据库名
	'DB_USER'   => 'root', // 用户名
	//'DB_PWD'    => 'lf2013class', // 密码
	'DB_PWD'    => '',
	'DB_PORT'   => 3306, // 端口
	'DB_PREFIX' => 'js_', // 数据库表前缀 
	'DB_CHARSET'=> 'utf8', // 字符集
	'DB_DEBUG'  =>  TRUE, // 数据库调试模式 开启后可以记录SQL日志 3.2.3新增
    
	
	'SHOW_PAGE_TRACE' =>false,
	
	'MODULE_ALLOW_LIST' => array('Home'),
    'DEFAULT_MODULE' => 'Home',
    'URL_ROUTER_ON'   => true, 
    'URL_CASE_INSENSITIVE' => true,
    'URL_MODEL' => 2,
    'VAR_URL_PARAMS' => '',
    'URL_PATHINFO_ORDER' => '/'
);