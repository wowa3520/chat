var http = require("http");
var fs = require("fs");
var chat = require("./chat");

http.createServer(function(req, res){

	switch(req.url){

	 	case "/":
	 		sendFile("index.html", res);
	 		break;

	 	case "/subscribe":
	 		chat.subscribe(req, res);
	 		break;

	 	case "/publish":
	 		var body = "";
	 		req
	 			.on("readable", function(){   // Получение пакеов
	 				body += req.read();
	 				if (body.length > 1e4) {
	 					res.statusCode = 413;
	 					res.end("Very long message for my little chat :(");
	 				}
	 			})
	 			.on("end", function(){		// После того как сообщение полученно, разбираем его.
	 				try{
	 					body = JSON.parse(body);
	 				}catch(e){
	 					res.statusCode = 400;
	 					res.end("Bad request");
	 					return;
	 				}
	 				chat.publish(body.message);
	 			res.end("ok!");
	 			})

	 			
	 		break;

	 	default:
	 		res.statusCode = 404;
	 		res.end("Not Found");
	 		break;
	 } 

}).listen(8080);

function sendFile(fileName, res) {
	var fileStream = fs.createReadStream(fileName);

	fileStream
		.on("error", function(){
			res.statusCode = 500;
			res.end("Server error");
			console.log(err); 
		})
		.pipe(res)
		.on("close", function(){
			fileStream.destroy();
		})
};