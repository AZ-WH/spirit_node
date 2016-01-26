var express		= require('express');
var router		= express.Router();
var host		= require( '../../config/host.config.json' );
var request		= require( 'request' );

router.get('/', function(req, res, next) {
	res.render('admin/index/index', res.data);
	
});


module.exports = router;
