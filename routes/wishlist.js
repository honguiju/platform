var express =require('express');
var route = express.Router();

module.exports = function(client){
    route.post('/add',function(req,res){
        var product_info = {
                        "product_id" : req.body.product_id,
                        "name" : req.body.name,
                        "price" : req.body.price,
                        "imglink" : req.body.imglink,
                        "brand" : req.body.brand,
                        "login_id" : req.user.login_id
                        };

        console.log(product_info);
        var sql = 'INSERT INTO wishlist (product_id, login_id, name, price, imglink, brand) values(?, ?, ?, ?, ?, ?)'
        var resdata = {}

        client.query(sql,[product_info.product_id,product_info.login_id,product_info.name, product_info.price, product_info.imglink, product_info.brand],function(err,result){
            resdata.meg = 'add'
            console.log(resdata)
            console.log(result);
            res.json(resdata)
        })
    })

    route.post('/del',function(req,res){
        var product_id = req.body.product_id;
        var login_id = req.user.login_id;
        
        var sql = 'DELETE FROM wishlist WHERE product_id = ? and login_id = ?'
        var resdata = {}

        client.query(sql,[product_id,login_id],function(err,result){
            resdata.meg = 'del'
            console.log(resdata)
            console.log(result)
            res.json(resdata)
        })
    })
    return route;
}