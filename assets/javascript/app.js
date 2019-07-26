
var food = ["pizza","fried chicken","sandwich","bbq ribs","ice cream","cereal","hamburger","hot dog","egg roll","steak"]
var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M5uE8mhUUUwubG4tLZfbkiAk6igcSkg8&limit=10"

function ajax(searchItem){
    $.ajax({
        url: queryURL + "&q=" + searchItem,
        method: "GET"
    }).then(function(response){

        for(i=0; i<10; i++){
            var div = $("<div>")
            var img = $("<img>")
            img.attr("still-image", response.data[i].images.fixed_height_still.url)
            img.attr("animated-image", response.data[i].images.fixed_height.url)
            img.attr("src", img.attr("still-image"))
            img.attr("state", "still")
            div.append(img)
            $("#gifs").append(div)
        }

        $("img").on("click", function(){

            if($(this).attr("state") == "still"){
                $(this).attr("src", $(this).attr("animated-image"))
                $(this).attr("state", "animated")
            }
            else{
                $(this).attr("src", $(this).attr("still-image"))
                $(this).attr("state", "still")
            }
        })
    })
}

$(document).ready(function(){
    for(i=0; i<food.length; i++){
        var button = $("<button>")
        button.text(food[i])
        button.attr("data-food", food[i])
        $("#buttons").append(button)
    }
    $("button").on("click", function(){
        $("#gifs").empty()
        var foodItem = $(this).data("food")
        ajax(foodItem)
    })
    
})


    






























