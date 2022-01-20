$('.brand_menu li').click(function(){
    $('.brand_menu li').css('color','black');
    $(this).css('color','#fc5ea0');
    var brand_name=$(this).text();  //브랜드 코드를 저장한다
    $.ajax({                            
        url : "/pick",   
        type : "post",                  
        dataType : "JSON",             
        data : {"brand_name" :  brand_name }
    })

    .done(function (json){
        var changeListHtml ='';
        changeListHtml +='<div class="interior_product">';
        for(var i =0; i<json.length;i++){
            changeListHtml +='<div class="product_wrap" > ';
            changeListHtml +='<div class="popular_details">';
            changeListHtml +='<a class="info_link" href="/detail?id='+json[i].product_id +'"><img class="product_Img" src='+json[i].imglink+'></a>';
            changeListHtml +='<div class="product_info">';
            changeListHtml +='<div class="info_brand" ><a href="/detail?id='+json[i].product_id +'">'+json[i].brand+'</a></div>';
            changeListHtml +='<div class="info_name" name='+json[i].product_id+'><a href="/detail?id='+json[i].product_id +'">'+json[i].name+'</a></div>';
            changeListHtml +='<div class="info_price"><a href="/detail?id='+json[i].product_id +'">'+json[i].price+'</a></div>';
            changeListHtml +=json[i].heart;
            changeListHtml +='</div>';
            changeListHtml +='</div>';
            changeListHtml +='</div>';
        }
        changeListHtml +='</div>'

        $('.interior_product').replaceWith(changeListHtml);
    })
    .fail(function (xhr, status, errorThrown){  
        console.log(errorThrown) 
        alert("Ajax failed")
        });
})

//  })
// $(document).on('click','.sub_categori', (e) => { 
//     var categori_code=e.target.data-categori-code;  //상품 종류 코드를 저장한다
//     var categori_num =e.target.data-sub-num; // 해당 태그의 글자 색을 변경하기 위해 저장한다
//     var url ="/views/store/categori?categori="+categori_code;
//     $.ajax({                            
//         url : url,       
//         type : "post",                  
//         dataType : "JSON",             
//         data : {"check" :"check_msg"}
//     })
//     .done(function (){
//         $('.sub_categori').css('color','black')
//         $('.sub_categori').eq(categori_num).css('color','red')
//         for (var i =0; i<15; i++){
//             $('.product_wrap').eq(i).replaceWith('<div class="product_wrap" name='+store_data[i].product_id)
//             $('.info_link').eq(i).replaceWith('<a class="info_link" href='+store_data[i].link +">"+'<img class="product_Img" src='+store_data[i].imglink+'></a>')
//             $('.info_brand').eq(i).replaceWith('<div class="info_brand"><a href='+store_data[i].link+">"+store_data[i].brand+'</a></div>')
//             $('.info_name').eq(i).replaceWith('<div class="info_name"><a href='+store_data[i].link+'>'+store_data[i].name+'</a></div>')
//             $('.info_price').eq(i).replaceWith('div class="info_price"><a href='+store_data[i].link+'>'+store_data[i].price+'</a></div>')
//             if (login_satus.status == 'ok'){
//                 if (store_data[i].heart == 'ok'){
//                     $('.wishlist_btn').eq(i).replaceWith('<button class="wishlist_btn" name="del"><img src="../img/heart.svg" name='+i+'></button>')
//                 } else {
//                     $('.wishlist_btn').eq(i).replaceWith('<button class="wishlist_btn" name="add"><img src="../img/empty_heart.svg" name='+i+'></button>')
//                 }
//             }
//         }
//     })
//     .fail(function (xhr, status, errorThrown){  
//         console.log(errorThrown) 
//         alert("Ajax failed")
//         });
//})
