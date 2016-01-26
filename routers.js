var adminIndex		= require('./controllers/admin/index'),
	adminGoods		= require('./controllers/admin/goods'),
	adminCategory	= require('./controllers/admin/category'),
	adminShop		= require('./controllers/admin/shop');

var apiGoods		= require('./controllers/api/goods');

module.exports = function(app){
	app.all('/admin/*' , function(req , res , next){
		res.data = {
			menuactive	: 'gk',
			title		: '菜单列表'
		};
		next();
	});

    app.use('/admin', adminIndex);
    app.use('/admin/goods', adminGoods);
    app.use('/admin/category', adminCategory);
    app.use('/admin/shop', adminShop);


	/*******************************************
	 *
	 *				api
	 *	
	 *******************************************/


    app.use('/api/goods', apiGoods);



}
