var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var textract = require('textract');
var { PythonShell } = require('python-shell');
var fs = require('fs');

router.get('/:fileId', function(req, res, next) {
  var fileId = req.params.fileId;
  
  res.sendFile(process.cwd() + '/outputs/' + fileId + '.png', null, (err) => {
    if(err) {
      console.log(err);
      return;
    }

    fs.unlinkSync(process.cwd() + '/outputs/' + fileId + '.png');
  });
});

/* POST upload document. */
router.post('/', function(req, res, next) {
  var form = formidable({ multiples: true });
  
  form.parse(req, (err, fields, files) => {
    if(err) {
      console.log(err, err.stack);
      return res.send({ msg: 'failed to process form' });
    }
    
    const { stopwords } = fields;
    
    textract.fromFileWithMimeAndPath(files.wordCloudFile.type, files.wordCloudFile.path, (err, text) => {
      if(err) {
        console.log(err, err.stack);
        return res.send({ msg: 'failed to extract text' });
      }
      
      var name = Date.now();
      
      // Create WordCloud using Python
      let options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        args: [text, name, stopwords]
      };
      
      PythonShell.run(process.cwd() + '/tools/word-cloud.py', options, (err, results) => {
        if(err) {
          console.log(err, err.stack);
          return res.send({ msg: 'Failed to generate word cloud' });
        }
        
        fs.unlinkSync(files.wordCloudFile.path);
        
        return res.send({ success: true, id: name });
      });
      
    });
  });
});

/* POST upload document. */
router.post('/process-text', function(req, res, next) {
  var form = formidable({ multiples: true });
  
  form.parse(req, (err, fields, files) => {
    if(err) {
      console.log(err, err.stack);
      return res.send({ msg: 'failed to process form' });
    }
    
    const { stopwords } = fields;
    
    const { wordCloudFile } = files;
    
    if(!stopwords) {
      return res.status(500).send('Please provide stopwords');
    }
    else if(!wordCloudFile) {
      return res.status(500).send('Please provide a wordCloudFile');
    }
    
    textract.fromFileWithMimeAndPath(files.wordCloudFile.type, files.wordCloudFile.path, (err, text) => {
      if(err) {
        console.log(err, err.stack);
        return res.send({ msg: 'failed to extract text' });
      }
      
      // Create WordCloud using Python
      let options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        args: [text, stopwords]
      };
      
      PythonShell.run(process.cwd() + '/tools/process-text.py', options, (err, results) => {
        if(err) {
          console.log(err, err.stack);
          return res.send({ msg: 'Failed to generate word cloud' });
        }
        
        fs.unlinkSync(files.wordCloudFile.path);
        
        return res.send({ success: true, wordcloud_dict: results });
      });
    });
  });
});

module.exports = router;
