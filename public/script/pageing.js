var startNum= 8; 
var product_repeat= 0;
var btn_num=12
$(document).ready(function(){
    $(".more_product").on("click", function(){
        $.ajax({                            
            url : "/more_product",       
            type : "POST",                  
            dataType : "JSON",             
            data : {"startNum" : startNum,"btn_num" : btn_num}        
        })
        .done(function (json){
            var addListHtml ="";


            for(var i=0; i<json.length;i++) {
                addListHtml +='<div class="product_wrap" > '
                addListHtml +='<div class="popular_details">'
                addListHtml +='<a class="info_link" href="/detail?id='+json[i].product_id+'"><img class="product_Img" src='+json[i].imglink+'></a>'
                addListHtml +='<div class="product_info">'
                addListHtml +='<div class="info_brand" ><a href="/detail?id='+json[i].product_id+'">'+json[i].brand+'</a></div>'
                addListHtml +='<div class="info_name" name='+json[i].product_id+'><a href="/detail?id='+json[i].product_id+'">'+json[i].name+'</a></div>'
                addListHtml +='<div class="info_price"><a href="/detail?id='+json[i].product_id+'">'+json[i].price+'</a></div>'
                addListHtml +=json[i].heart;
                addListHtml +='</div>'
                addListHtml +='</div>'
                addListHtml +='</div>'
                btn_num+=1
            }
            
            startNum += 8;
            product_repeat += 2;
            $(".plus_product").css('grid-template-rows','repeat('+product_repeat+',440px)')
                
            $(".plus_product").append(addListHtml);
                
        })
        .fail(function (xhr, status, errorThrown){  
            console.log(errorThrown) 
            alert("Ajax failed")
            })
    })
  })
  

