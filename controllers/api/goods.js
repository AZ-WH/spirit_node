var express		= require('express');
var router		= express.Router();
var host		= require( '../../config/host.config.json' );
var request		= require( 'request' );

router.get('/', function(req, res, next) {
	res.data = {};
	request({
		method: 'GET',
		url:host.host + '/api/goods/defaultList' , 
		form:req.body,
		useQuerystring:true
	} , function(error , response , data){
		if(error == null){
			data = JSON.parse(data);
			console.log(data.data);
			if(data.code == '0000'){
				res.data.goods	= data.data.goodsList;
				res.data.page	= data.data.page;
				res.render( 'weixin/www/index.html', res.data );
			}
		}
	});
	
});

module.exports = router;
