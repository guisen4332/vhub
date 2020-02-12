var express = require('express');
var router = express.Router();


const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://localhost:5001');

router.post('/survey/:id', function(req, res) {
    if (!req.body) return res.sendStatus(400);
    survey_id = req.params.id;
    dir_path = '/' + survey_id;
    path =  dir_path + '/survey_' + survey_id + '.json';
    //处理相同survey id已存在的情况
    // return res.sendStatus(400);
    //处理全新survey
    try {
        ipfs.files.mkdir(survey_id);
        ipfs.files.write(path, Buffer.from(JSON.stringify(req.body)), { create: true })
    } catch(e) {
        res.status(500).send('faild to due with survey' + survey_id);
    }

    var { hash } = ipfs.files.stat(dir_path)
    var reg = /CID\(\'(.*)\'\)/;
    hash = reg.exec(hash)[1].trim();
    res.json({ survey_hash: hash});
});

router.post('/answer/:id', function(req, res) {
    if (!req.body) return res.sendStatus(400);
    answer_id = req.params.id;
    survey_id = req.body.survey_id;
    dir_path = '/' + survey_id;
    path = dir_path + '/answer' + answer_id + '.json';
    //处理相同survey id已存在的情况
    // return res.sendStatus(400);

    //处理全新answer
    try {
        ipfs.files.write(path, Buffer.from(JSON.stringify(req.body.answer)), { create: true })
    } catch(e) {
        res.status(500).send('faild to due with survey' + survey_id);
    }

    var { hash } = ipfs.files.stat(dir_path, { hash: true})
    var reg = /CID\(\'(.*)\'\)/;
    survey_hash = reg.exec(hash)[1].trim();

    var { hash } = ipfs.files.stat(path, { hash: true})
    answer_hash = reg.exec(hash)[1].trim();
    res.json({ survey_hash: survey_hash, answer_hash: answer_hash});
});

module.exports = router;
