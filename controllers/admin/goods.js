var express		= require('express');
var router		= express.Router();
var host		= require( '../../config/host.config.json' );
var request		= require( 'request' );

router.get('/', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};
	request({
		method: 'GET',
		url:host.host + '/admin/goods' , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		if(error == null){
			data = JSON.parse(data);
			if(data.code == '0000'){
				res.data.goods	= data.data.goods;
				res.data.page	= data.data.page;
				res.render( 'admin/goods/list', res.data );
			}
		}
	});
	
});

router.get('/add', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};
	request({
		method: 'GET',
		url:host.host + '/admin/shop/category/' + 1 , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		if(error == null){
			data = JSON.parse(data);
			if(data.code == '0000'){
				res.data.category	= data.data;
				res.render( 'admin/goods/add', res.data );
			}
		}
	});
	
});

router.post('/add', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	if(req.body.is_show == 'on'){
		req.body.is_show = 1;
	}else{
		req.body.is_show = 0;
	}

	request({
		method: 'POST',
		url:host.host + '/admin/add-goods' , 
		form:req.body,
		useQuerystring:false
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/goods/add');
		}
	});
	
});

router.get('/del/:gid', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	request({
		method: 'GET',
		url:host.host + '/admin/del-goods/'+req.params.gid , 
		useQuerystring:true
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/goods');
		}
	});
	
});

router.get('/edit/:gid', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	var i = 0;

	request({
		method: 'GET',
		url:host.host + '/admin/info-goods/'+req.params.gid , 
		useQuerystring:true
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.data.goods = data.data.goods;
			i++;
			render(i);
		}
	});

	
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
				i++;
				render(i);
			}
		}
	});

	var render = function(i){
		if(i == 2){
			res.render( 'admin/goods/edit', res.data );
		}
	}
	
});

router.post('/edit', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	if(req.body.is_show == 'on'){
		req.body.is_show = 1;
	}else{
		req.body.is_show = 0;
	}

	request({
		method: 'POST',
		url:host.host + '/admin/edit-goods' , 
		form:req.body,
		useQuerystring:false
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect( '/goods/edit/' + req.body.gid );
		}
	});

	
});

router.get('/category/:sid', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	var i = 0;
	request({
		method: 'GET',
		url:host.host + '/admin/category' , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		console.log(data);
		if(error == null){
			data = JSON.parse(data);
			if(data.code == '0000'){
				res.data.category	= data.data.category;
				i++;
				render(i);
			}
		}
	});
	request({
		method: 'GET',
		url:host.host + '/admin/shop/category/' + req.params.sid , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		if(error == null){
			data = JSON.parse(data);
			res.data.shop_category	= data.data;
			i++;
			render(i);
		}else{
			res.end();
		}
	});

	var render = function(i){
		if(i == 2){
			res.render( 'admin/goods/category', res.data );
		}
	}
	
});

router.get('/add-category/:cid', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	var data = {
		'cid' : req.params.cid,
		'sid' : 1	
	}

	request({
		method: 'POST',
		url:host.host + '/admin/shop/add-category' , 
		form: data,
		useQuerystring:false
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/goods/category/' + 1);
		}
	});
	
});

router.get('/del-category/:cid', function(req, res, next) {
	res.data = {
		menuactive	: 'cdgl',
		title		: '菜单列表'
	};

	request({
		method: 'GET',
		url:host.host + '/admin/shop/del-category/'+req.params.cid + '/' + 1 , 
		useQuerystring:true
	} , function(error , response , data){
		data = JSON.parse(data);
		if(data.code == '0000'){
			res.redirect('/goods/category/' + 1);
		}
	});
	
});

module.exports = router;
