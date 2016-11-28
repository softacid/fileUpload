var app = require('express')();
var multer  = require('multer');
var lwip = require('lwip');

app.use(multer({inMemory: true}).single('userPhoto'));

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo', function (req, res) {
    var fileBuffer = req.file.buffer;
    var imgName = req.file.fieldname + '-' + Date.now();
    if(req.file.originalname.split('.').pop() !== 'jpg'){
        res.send('incorrect extension!, you should use only jpg files');
    }

    lwip.open(fileBuffer, 'jpg', function(err, image) {
        if (err) return console.log(err);
        var ratio = 200 / image.width();
        image.scale(ratio, function(err, img){
            img.writeFile('uploads/' + imgName + '.jpg', function(err) {
                if (err) throw err;
                res.send('done');
            });
        });
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('LWIP app listening at http://%s:%s', host, port)
});