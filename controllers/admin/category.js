var express		= require('express');
var router		= express.Router();
var host		= require( '../../config/host.config.json' );
var request		= require( 'request' );

router.get('/', function(req, res, next) {
	res.data = {
		menuactive	: 'flgl',
		title		: '分类管理'
	};
	request({
		method: 'GET',
		url:host.host + '/admin/category' , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		if(error == null){
			data = JSON.parse(data);
			if(data.code == '0000'){
				res.data.category	= data.data.category;
				res.render( 'admin/category/list', res.data );
			}
		}
	});
	
});

router.get('/add', function(req, res, next) {
	res.data = {
		menuactive	: 'flgl',
		title		: '添加分类'
	};

	res.render( 'admin/category/add', res.data );
	
});

router.post('/add', function(req, res, next) {
	res.data = {
		menuactive	: 'flgl',
		title		: '分类列表'
	};

	request({
		method: 'POST',
		url:host.host + '/admin/add-category' , 
		form:req.body,
		useQuerystring:false
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/category/add');
		}
	});
	
});

router.get('/del/:cid', function(req, res, next) {
	res.data = {
		menuactive	: 'flgl',
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

router.get('/edit/:cid', function(req, res, next) {
	res.data = {
		menuactive	: 'flgl',
		title		: '分类列表'
	};

	request({
		method: 'GET',
		url:host.host + '/admin/info-category/'+req.params.cid , 
		useQuerystring:true
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.data.category = data.data.category;
			res.render( 'admin/category/edit', res.data );
		}
	});

});

router.post('/edit', function(req, res, next) {
	res.data = {
		menuactive	: 'flgl',
		title		: '菜单列表'
	};

	request({
		method: 'POST',
		url:host.host + '/admin/edit-category' , 
		form:req.body,
		useQuerystring:false
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect( '/category/edit/' + req.body.cid );
		}
	});

	
});

module.exports = router;
