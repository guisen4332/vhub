const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://localhost:5001');
var express = require('express');
var router = express.Router();

router.post('/survey/:id', function(req, res) {
    if (JSON.stringify(req.body) === '{}') return res.sendStatus(400);
    survey_id = req.params.id;
    dir_path = '/' + survey_id;
    path =  dir_path + '/survey_' + survey_id + '.json';
    //处理相同survey id已存在的情况
    // return res.sendStatus(400);
    //处理全新survey
    async function new_survey() {
        try {
            await ipfs.files.mkdir(survey_id);
            await ipfs.files.write(path, Buffer.from(JSON.stringify(req.body)), { create: true })
        } catch(e) {
            return res.status(500).send('faild to due with survey ' + survey_id);
        }
        var { cid } = await ipfs.files.stat(dir_path)
        // var reg = /CID\(\'(.*)\'\)/;
        // hash = reg.exec(hash)[1].trim();
        return cid.toString();
    }
    var hash = new_survey();
    res.json({ survey_hash: hash});
});

router.post('/answer/:id', function(req, res) {
    if (JSON.stringify(req.body) === '{}') return res.sendStatus(400);
    answer_id = req.params.id;
    survey_id = req.body.survey_id;
    dir_path = '/' + survey_id;
    path = dir_path + '/answer' + answer_id + '.json';
    //处理相同survey id已存在的情况
    // return res.sendStatus(400);

    //处理全新answer
    async function new_answer() {
        try {
            await ipfs.files.write(path, Buffer.from(JSON.stringify(req.body.answer)), { create: true });
        } catch(e) {
            return res.status(500).send('faild to due with survey ' + survey_id);
        }

        var { cid } = await ipfs.files.stat(dir_path);
        var survey_hash = cid.toString();
        //var reg = /CID\(\'(.*)\'\)/;
        //survey_hash = reg.exec(hash)[1].trim();

        var { cid } = await ipfs.files.stat(path);
        var answer_hash = cid.toString();
        return { "survey": survey_hash, "answer": answer_hash};
    }
    var ans = new_answer();
    res.json(ans);
});

module.exports = router;
