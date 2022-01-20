$(document).on('click','.wishlist_btn', (e) => { 
    var product_order=e.target.name;
    var btn_name = $('.wishlist_btn').eq(product_order).attr('name');
    if (btn_name == 'add' ){
        $.ajax({                            
            url : "/wishlist/add",       
            type : "post",                  
            dataType : "JSON",             
            data : { "product_id" :$('.similar_info_name').eq(product_order).attr('name'),
                    "name" : $('.similar_info_name').eq(product_order).text(),
                    "price" :  $('.similar_info_price').eq(product_order).text(),
                    "imglink" : $('.similar_product_Img').eq(product_order).attr('src'),
                    "brand" : $('.similar_info_brand').eq(product_order).text() 
                    }
        })
        .done(function (json){
            $(".wishlist_btn").eq(product_order).replaceWith('<button class="wishlist_btn" name="del" ><img src="../img/heart.svg" name='+product_order+'></button>');
            
            
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            });
    
    } else if (btn_name == 'del'){
        $.ajax({                            
            url : "/wishlist/del",       
            type : "post",                  
            dataType : "JSON",             
            data : { "product_id" :$('.similar_info_name').eq(product_order).attr('name')}       
        })
    
    
        .done(function (json){
            $(".wishlist_btn").eq(product_order).replaceWith('<button class="wishlist_btn" name="add" ><img src="../img/empty_heart.svg" name='+product_order+'></button>');
            
           
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            });
    
    } else if (btn_name == 'heart'){
        alert('로그인 후 사용 가능합니다.')
    }
})

$(document).on('click','.detail_wishlist_btn', (e) => { 
    var product_order=e.target.name;
    var btn_name = $('.detail_wishlist_btn').eq(product_order).attr('name');
    if (btn_name == 'add' ){
        $.ajax({                            
            url : "/wishlist/add",       
            type : "post",                  
            dataType : "JSON",             
            data : { "product_id" :$('.detail_info_name').eq(product_order).attr('name'),
                    "name" : $('.detail_info_name').eq(product_order).text(),
                    "price" :  $('.detail_info_price').eq(product_order).text(),
                    "imglink" : $('.detail_product_Img').eq(product_order).attr('src'),
                    "brand" : $('.detail_info_brand').eq(product_order).text() 
                    }
        })
        .done(function (json){
            $(".detail_wishlist_btn").eq(product_order).replaceWith('<button class="detail_wishlist_btn" name="del" ><img src="../img/detail_heart.svg" name='+product_order+'></button>');
            
            
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            });
    
    } else if (btn_name == 'del'){
        $.ajax({                            
            url : "/wishlist/del",       
            type : "post",                  
            dataType : "JSON",             
            data : { "product_id" :$('.detail_info_name').eq(product_order).attr('name')}       
        })
    
    
        .done(function (json){
            $(".detail_wishlist_btn").eq(product_order).replaceWith('<button class="detail_wishlist_btn" name="add" ><img src="../img/detail_empty_heart.svg" name='+product_order+'></button>');
            
           
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            });
    
    } else if (btn_name == 'heart'){
        alert('로그인 후 사용 가능합니다.')
    }
})
