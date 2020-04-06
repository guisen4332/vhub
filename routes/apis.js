const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://localhost:5001');
var express = require('express');
var router = express.Router();

router.post('/survey/:id', async function(req, res) {
    if (JSON.stringify(req.body) === '{}') return res.sendStatus(400);
    survey_id = req.params.id;
    dir_path = '/' + survey_id;
    path =  dir_path + '/survey_' + survey_id + '.json';
    //处理相同survey id已存在的情况
    //存在则删除映射关系，实际文件不会被删除，可通过hash值查找
    try {
        var stat = await ipfs.files.stat(dir_path);
        await ipfs.files.rm(dir_path, { recursive: true });
    } catch (e) {
        console.log(e);
    }
    //处理全新survey
    try {
        await ipfs.files.mkdir(dir_path);
        await ipfs.files.write(path, Buffer.from(req.body.data), { create: true })
    } catch(e) {
        conlose.log(e)
        return res.status(500).send('faild to due with survey ' + survey_id);
    }
    var { cid } = await ipfs.files.stat(dir_path)
    await res.json({ survey_hash: cid.toString()});
});

router.post('/answer/:id', async function(req, res) {
    if (JSON.stringify(req.body) === '{}') return res.sendStatus(400);
    answer_id = req.params.id;
    survey_id = req.body.survey_id;
    dir_path = '/' + survey_id;
    path = dir_path + '/answer_' + answer_id + '.json';
    //处理相同answer id已存在的情况
    //存在则删除映射关系，实际文件不会被删除，可通过hash值查找
    try {
        var stat = await ipfs.files.stat(path);
        await ipfs.files.rm(path);
    } catch (e) {
        console.log(e);
    }
    //处理全新answer
    try {
        await ipfs.files.write(path, Buffer.from(req.body.data), { create: true });
    } catch(e) {
        console.log(e)
        return res.status(500).send('faild to due with survey ' + survey_id);
    }

    var { cid } = await ipfs.files.stat(dir_path);
    var survey_hash = cid.toString();

    var { cid } = await ipfs.files.stat(path);
    var answer_hash = cid.toString();
    await res.json({ survey_hash: survey_hash, answer_hash: answer_hash});
});

module.exports = router;
