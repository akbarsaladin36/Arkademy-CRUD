// use path,express,hbs,bodyparser middleware, dan mysql database.
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

//server listening
app.listen(8000, () => {
    console.log('Server is running at port 8000');
});

//konfigurasi koneksi
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'arkademy'
});

//melakukan koneksi ke database
conn.connect((err) => {
    if(err) throw err;
    console.log('Mysql connected.');
});

//set view files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//set view engine
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set folder public sebagai static folder untuk static file
app.use('/assets', express.static(__dirname + '/public'));

//route untuk homepage
app.get('/', (req, res) => {
    let sql = "SELECT * FROM produk";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.render('produk_view', {
            results: results
        });
    });
});

//route untuk insert data
app.post('/save', (req, res) => {
    let data = {nama_produk: req.body.nama_produk, keterangan: req.body.keterangan, harga: req.body.harga, jumlah: req.body.jumlah};
    let sql = "INSERT INTO produk SET ?";
    let query = conn.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//route untuk update data
app.post('/update', (req, res) => {
    let sql = "UPDATE produk SET nama_produk='"+req.body.nama_produk+"', keterangan='"+req.body.keterangan+"', harga='"+req.body.harga+"', jumlah='"+req.body.jumlah+"' WHERE id="+req.body.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//route untuk delete data
app.post('/delete', (req, res) => {
    let sql = "DELETE FROM produk WHERE id="+req.body.id+"";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});
