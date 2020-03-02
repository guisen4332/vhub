const express = require('express');
const ipfsClient = require('ipfs-http-client')
var fs = require("fs");
var request = require('request');
var bodyParser = require('body-parser');

const app = express();
const ipfs = ipfsClient('http://localhost:5001')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/api/survey_ipfs/:survey_id', function (req, res){
	console.log(req.body)
	var survey_id = req.params.survey_id
	var data = JSON.stringify(req.body)
	var dir_path = '/survey_'+survey_id
	
	fs.writeFile('./'+survey_id+'.json',data,function(err){
            if(err){
                console.error(err);
            }
            console.log('----------create survey file successfully-------------');
        })
	
	async function new_dir() {
	  try {
		await ipfs.files.rm(dir_path, { recursive: true })
	  }
	  catch (err) {
		console.error(err)
	  }
	  try {
		  // await ipfs.files.mkdir(dir_path)
		  const files = [
			  {
				path: dir_path+'/'+survey_id+'.json',
				content:  fs.readFileSync('./'+survey_id+'.json', 'utf-8')
			  }
			]
			const results = await ipfs.add(files)
	  }
	  catch (err) {
		console.error(err)
	  }
	}
	new_dir()
	res.end(JSON.stringify(results))
})
//************************results format***********************
// [
  // {
    // "path": "tmp",
    // "hash": "QmWXdjNC362aPDtwHPUE9o2VMqPeNeCQuTBTv1NsKtwypg",
    // "size": 67
  // },
  // {
    // "path": "/tmp/myfile.txt",
    // "hash": "QmNz1UBzpdd4HfZ3qir3aPiRdX5a93XwTuDNyXRc6PKhWW",
    // "size": 11
  // }
// ]
app.get('/api/answer_ipfs/:survey_id', function (req, res){
	console.log(req.body)
	
	var user_id = req.query.user
	var survey_id = req.params.survey_id
	var dir_path = '/survey_'+survey_id
	var data = JSON.stringify(req.body)
	
	fs.writeFile('./'+user_id+'_answer_'+survey_id+'.json',data,function(err){
            if(err){
                console.error(err);
            }
            console.log('----------create answer file successfully-------------');
        })
		
	async function new_answer() {
	  try {
		  const files = [
			  {
				path: dir_path+'/'+user_id+'_answer_'+survey_id+'.json',
				content:  fs.readFileSync('./'+user_id+'_answer_'+survey_id+'.json', 'utf-8')
			  }
			]
			const results = await ipfs.add(files)
	  }
	  catch (err) {
		console.error(err)
	  }
	}
	new_answer()
	res.end(JSON.stringify(results))
})

//添加的新用户数据
var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.get('/addUser', function (req, res) {
   // 读取已存在的数据
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       data["user4"] = user["user4"];
       console.log( data );
       res.end(JSON.stringify(data));
   });
})

app.get('/:id', function (req, res) {
   // 首先我们读取已存在的用户
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       var user = data["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
   });
})

app.get('/deleteUser/:id', function (req, res) {

   // First read existing users.
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + req.params.id];
       
       console.log( data );
       res.end( JSON.stringify(data));
   });
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
