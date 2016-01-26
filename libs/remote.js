var request		= require( 'request' );
var config		= require( '../config/host.config.json' );
var Q			= require('q');

function remote(req , res ,  params , callback ){
	
	request.debug = true;

	var options = [];
	var requestData = [];

	if( typeof params == 'object' && typeof params != null ){
		
		var proxyHeaders = {};
		var proxyDomain = ['seashell' , 'clientIp' , 'referer' , 'cookie' , 'user-agent' ];
		proxyHeaders.requrl = req.url;
		for(var i=0,j = proxyDomain.length ; i < j ;i++ ){
			if (req.headers.hasOwnProperty(proxyDomain[i]) ) {
				proxyHeaders[proxyDomain[i]] = req.headers[proxyDomain[i]]
			}
		}

		var host = config.host + ':' + config.port;
		var baseoptions = {
			baseUrl: 'http://'+ host,
			headers: proxyHeaders
		};

		var baseRequest = request.defaults(baseoptions);

		var remoteData  = [];

		for( key in params ){
			options = [];
			requestData = [];
			for( requestParams in params[key] ) {
				if(requestParams.toLowerCase() == 'url'){
					options['url'] = 'http://' + host + params[key][requestParams];	
				}
				if(requestParams.toLowerCase() == 'method'){
					options['method'] = params[key][requestParams].toUpperCase();	
				}
				if(requestParams.toLowerCase() == 'data'){
					requestData = params[key][requestParams];	
				}
				
				if( options['url'] == undefined ){
					deferred.reject('error');
				}
				if( options['method'] == undefined ){
					options['method'] = 'GET';
				}

				if( options['method'] == 'GET'){
					options['useQuerystring'] = true;
					if( requestData ) {
						options['qs'] = requestData;
					}
				}

				Request = request.defaults(options)
				Request({},function(error , response , data){
					console.log(data);
					remoteData[key] = data;
				})

			}
		}

		console.log(111111111);
		console.log(remoteData);
		callback(remoteData);
	}	

}


module.exports = remote;
