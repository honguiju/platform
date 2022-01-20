$(document).ready(function(){
$(function(){
    $('.suggestion').on("click",function(){    
        var style= $(this).attr("value")
    
        $.ajax({                            
            url : "/testindex/suggestion",       
            type : "post",                  
            dataType : "JSON",             
            data : {"style" : style}
        })
    
    
        .done(function (json){
            var addhtml ='<div class="interior_product">'
        for(i=1; i<5; i++){
            addhtml +='<div class="product_wrap">'
            addhtml +='<div class="product_details">'
            addhtml +='<a href='+json[i].link+'>'
            addhtml +='<img  class="product_Img" src='+json[i].imglink+'>'
            addhtml +='<div class="product_info">'
            addhtml +='<div class="info_brand">'+json[i].brand+'</div>'
            addhtml +='<div class="info_name">'+json[i].name+'</div>'
            addhtml +='<div class="info_price">'+json[i].price+'</div>'
            addhtml +='<div class="heart"></div>'
            addhtml +='</div>'
            addhtml +='</a>'
            addhtml +='</div>'
            addhtml +='</div>'
        }
                           
        $(".interior_product").replaceWith(addhtml)
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            });
        })
    
})
})