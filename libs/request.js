var http = require( 'http' );
var qs = require( 'querystring' );
var host = require( '../config/host.config.json' );
var request = require('request');
var fs = require('fs');

// post请求
exports.post = function( req , path ,  success ) {
  var body = qs.stringify( req.body );
  var method = req.method;
  var path = path;
  var options = {
      hostname: host.host,
      port: host.port,  
      path: path,  
      method: 'post',
      headers: req.headers
  }
 //console.log( body )
  var req = http.request(options, function(res) {
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (d, err) {
                if( err ) {
                  console.error( '请求数据失败' );
                  return;
                }
              data += d;
            }).on('end' , function(){
              // console.log( res );
              data = JSON.parse( data );
             // console.log( data );
              success( res,data );
            });
        });

    req.on('error', function(e){
       console.log("auth_user error: " + e.message);
    });
    req.write( body );

    req.end();
}

// get
exports.get = function( req , path , success ) {

  var path = req._parsedOriginalUrl.pathname;
  if( req._parsedOriginalUrl.search ) {
    path += req._parsedOriginalUrl.search;
  }
  var options = {
      hostname: host.host,  
      port: host.port,  
      path: path,  
      method: 'get',  
      headers: req.headers
  };
  var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      var data = '';
      res.on('data', function (d, err) {
          if( err ) {
            console.error( '请求数据失败' );
            return;
          }
        data += d;
      }).on('end' , function(){
        // console.log( data );
        data = JSON.parse( data );
        //console.log( data );
        success( res,data );
        
      });
    });
    req.on('error', function(e){
       console.log("auth_user error: " + e.message);
    }); 
    
    req.end();
}

// post请求
exports.uploadSingleFile = function( req, success ) {

    var body = req.body;

    var file = '{"file0": {"name": "' + body.file + '","path":"' + body.file +  '"}}';
    var files = JSON.parse(file);
    var method = req.method;
    var path = req.route.path;
    var options = {
        hostname: host.host,
        port: host.port,
        path: path,
        method: 'post',
        headers: req.headers
    }
    //console.log( body )
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (d, err) {
            if( err ) {
                console.error( '请求数据失败' );
                return;
            }
            data += d;
        }).on('end' , function(){
            // console.log( res );
            data = JSON.parse( data );
            // console.log( data );
            success( res,data );
        });
    });

    req.on('error', function(e){
        console.log("auth_user error: " + e.message);
    });
    uploadFile(files, req, body);

}

/**
 * 上传文件
 * @param files     数组文件路径
 * @param req        httpRequest对象
 * @param postData    额外提交的数据
 */
function uploadFile(files, req, postData) {
    var boundaryKey = Math.random().toString(16);
    var endData = '\r\n----' + boundaryKey + '--';
    var filesLength = 0, content;

    // 初始数据，把post过来的数据都携带上去
    content = (function (obj) {
        var rslt = [];
        Object.keys(obj).forEach(function (key) {
            arr = ['\r\n----' + boundaryKey + '\r\n'];
            arr.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n');
            arr.push(obj[key]);
            rslt.push(arr.join(''));
        });
        return rslt.join('');
    })(postData);

    // 组装数据
    Object.keys(files).forEach(function (key) {
        if (!files.hasOwnProperty(key)) {
            delete files.key;
            return;
        }
        content += '\r\n----' + boundaryKey + '\r\n' +
            'Content-Type: application/octet-stream\r\n' +
            'Content-Disposition: form-data; name="' + key + '"; ' +
            'filename="' + files[key].name + '"; \r\n' +
            'Content-Transfer-Encoding: binary\r\n\r\n';
        files[key].contentBinary = new Buffer(content, 'utf-8');
        filesLength += files[key].contentBinary.length + fs.statSync(files[key].path).size;
    });

    req.setHeader('Content-Type', 'multipart/form-data; boundary=--' + boundaryKey);
    req.setHeader('Content-Length', filesLength + Buffer.byteLength(endData));

    // 执行上传
    var allFiles = Object.keys(files);
    var fileNum = allFiles.length;
    var uploadedCount = 0;
    allFiles.forEach(function (key) {
        req.write(files[key].contentBinary);
        var fileStream = fs.createReadStream(files[key].path, {bufferSize: 4 * 1024});
        fileStream.pipe(req, {end: false});
        fileStream.on('end', function () {
            // 上传成功一个文件之后，把临时文件删了
            fs.unlink(files[key].path);
            uploadedCount++;
            if (uploadedCount == fileNum) {
                // 如果已经是最后一个文件，那就正常结束
                req.end(endData);
            }
        });
    });
}
