var express		= require('express');
var router		= express.Router();
var host		= require( '../../config/host.config.json' );
var request		= require( 'request' );

router.get('/', function(req, res, next) {
	res.data = {
		menuactive	: 'dpgl',
		title		: '店铺列表'
	};
	request({
		method: 'GET',
		url:host.host + '/admin/shops' , 
		form:req.body,
		useQuerystring:true,
	} , function(error , response , data){
		console.log(data);
		if(error == null){
			data = JSON.parse(data);
			if(data.code == '0000'){
				res.data.shops	= data.data.shops;
				res.render( 'admin/shop/list', res.data );
			}
		}
	});
	
});


router.get('/add', function(req, res, next) {
	res.data = {
		menuactive	: 'dpgl',
		title		: '店铺列表'
	};

	res.render( 'admin/shop/add', res.data );
	
});

router.get('/user', function(req, res, next) {
	res.data = {
		menuactive	: 'dygl',
		title		: '店员列表'
	};
	request({
		method: 'GET',
		url:host.host + '/admin/shop/user/1' , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		if(error == null){
			data = JSON.parse(data);
			if(data.code == '0000'){
				res.data.user	= data.data.user;
				res.render( 'admin/shop/user_list', res.data );
			}
		}
	});
	
});

router.get('/add-user', function(req, res, next) {
	res.data = {
		menuactive	: 'dygl',
		title		: '店员列表'
	};

	res.render( 'admin/shop/user_add' ,  res.data );
	
});

router.post('/add-user', function(req, res, next) {
	res.data = {
		menuactive	: 'dygl',
		title		: '分类列表'
	};

	request({
		method: 'POST',
		url:host.host + '/admin/shop/add-user' , 
		form:req.body,
		useQuerystring:false
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/shop/add-user');
		}
	});
	
});

router.get('/del-user/:uid', function(req, res, next) {
	res.data = {
		menuactive	: 'dygl',
		title		: '分类列表'
	};

	request({
		method: 'GET',
		url:host.host + '/admin/del-category/'+req.params.cid , 
		useQuerystring:true
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/category');
		}
	});
	
});

module.exports = router;
