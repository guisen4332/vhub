### 部署启动
`$node bin/www`

默认3000

使用**npm start**会导致报错 和异步模块内容相关

### api说明
文件路径 routes/apis.js

post /survey/:id

功能：传入问卷id和数据，建立对应id的文件夹和问卷文件的映射关系。若有相同问卷id，会完全清除旧数据的映射关系；

传入json数据格式
```
{
	"data"：问卷保存在数据库的json数据(json字符串格式)
}
```

返回json数据
```
{
	"survey_hash": "data"
}
```

post /answer/:id

功能：传入用户id和数据，在相应问卷id的文件夹下建立答卷文件的映射关系。若有相同用户id，会清除旧问卷（旧用户）的映射关系

传入json数据格式
```
{
	"survey_id": "id",
	"data": "答卷保存在数据库的json字符串格式"
}
```

返回json数据
```
{
	"survey_hash": "survey_hash",
	"answer_hash": "answer_hash"
}
```
### 备注
项目内server.js为过去测试js-ipfs-clint使用的nodejs独立代码，功能思路相对vhub这个会多一点，后续增加可以看这个来增加功能
