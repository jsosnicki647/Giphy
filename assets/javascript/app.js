
var food = ["pizza","fried chicken","sandwich","bbq ribs","ice cream","cereal","hamburger","hot dog","egg roll","steak"]
var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M5uE8mhUUUwubG4tLZfbkiAk6igcSkg8&limit=10"

function ajax(searchItem){
    $.ajax({
        url: queryURL + "&q=" + searchItem,
        method: "GET"
    }).then(function(response){

        console.log(response)
    })
}

$(document).ready(function(){
    for(i=0; i<food.length; i++){
        var button = $("<button>")
        button.text(food[i])
        button.attr("data-food" , food[i])
        $("#buttons").append(button)
    }
    $("button").on("click", function(){
        var foodItem = $(this).data("food")
        ajax(foodItem)
    })
})

































