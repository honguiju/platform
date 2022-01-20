$(document).on('click','.wishlist_btn', (e) => { 
        var product_order=e.target.name;
        var btn_name = $('.wishlist_btn').eq(product_order).attr('name');
        if (btn_name == 'add' ){
            $.ajax({                            
                url : "/wishlist/add",       
                type : "post",                  
                dataType : "JSON",             
                data : { "product_id" :$('.info_name').eq(product_order).attr('name'),
                        "name" : $('.info_name').eq(product_order).text(),
                        "price" :  $('.info_price').eq(product_order).text(),
                        "imglink" : $('.product_Img').eq(product_order).attr('src'),
                        "brand" : $('.info_brand').eq(product_order).text() 
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
                data : { "product_id" :$('.info_name').eq(product_order).attr('name')}       
            })
        
        
            .done(function (json){
                // eq = 같은 이름의 클래스 속성중 몇번째 것을 선택할지 정함. 아직  pic하고 더보기 상품은 버튼이 없기때문에 수정필요. (+4가 된 값이기때문임.)
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