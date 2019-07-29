var food = ["pizza","fried chicken","sandwich","bbq ribs","ice cream","cereal","hamburger","hot dog","egg roll","steak"]
var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M5uE8mhUUUwubG4tLZfbkiAk6igcSkg8&limit=10"
var keyStrokes = 0
var moreGifsLimit = 20
var curGifIndex
var responseIndex = 0

function ajax(searchItem){
    $.ajax({
        url: queryURL + "&q=" + searchItem,
        method: "GET"
    }).then(function(response){
        console.log(response)
        for(i=responseIndex; i<responseIndex+10; i++){
            var div = $("<div>")
            var img = $("<img>")
            var rating = $("<p>")
            var title = $("<p>")
            img.attr("still-image", response.data[i].images.fixed_height_still.url)
            img.attr("animated-image", response.data[i].images.fixed_height.url)
            img.attr("src", img.attr("still-image"))
            img.attr("state", "still")
            title.text(response.data[i].title.split("GIF")[0])
            title.addClass("title")
            rating.text("Rating: " + response.data[i].rating.toUpperCase())
            div.append(title)
            div.append(img)
            div.append(rating)
            $("#gifs").prepend(div)
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

function renderButtons(){
    $("#buttons").empty()
    
    for(i=0; i<food.length; i++){
        var button = $("<button>")
        button.text(food[i])
        button.attr("data-food", food[i])
        button.addClass("button btn btn-secondary")
        $("#buttons").append(button)
    }

    $(".button").on("click", function(){
        $("#gifs").empty()
        $("#more-gifs-button").removeClass("btn-light").addClass("btn-success")
        var foodItem = $(this).data("food")
        curGifIndex = food.indexOf($(this).data("food"))
        console.log(curGifIndex)
        ajax(foodItem)
    })

    $("#add-item").on("click", function(){
        $("#add-item").attr("placeholder", "")
    })
}

$(document).ready(function(){
    renderButtons()

    $("#add-button").on("click", function(e){
        e.preventDefault()
        keyStrokes = 0
        $("#char-remaining").text("Characters: 12")

        if($("#add-item").val() == ""){
            alert("Search box is empty!")
            $("#add-item").focus()
            $("#add-item").attr("placeholder", "")
        }
        else{
            food.push($("#add-item").val())
            $("#add-item").val("")
            renderButtons()
        }
    })

    $("#add-item").focusout(function() {
        $("#add-item").attr("placeholder", "add new item")
    })

    $("#add-item").on("keyup", function(e){

        if(e.which == 8){
            if(keyStrokes != 0){
                keyStrokes--
            }
        }
        else{
            if(keyStrokes != 12){
                keyStrokes++
            }
            else{
                console.log($("#add-item").val().length - 1)
                $("#add-item").val($("#add-item").val().substring(0, $("#add-item").val().length - 1))
                alert("12 characters max!")
            }
        }
            
        $("#char-remaining").text("Characters: " + (12 - keyStrokes))
    })

    $("#more-gifs-button").on("click", function(){

        if($(this).attr("class") != "btn btn-light"){
            queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M5uE8mhUUUwubG4tLZfbkiAk6igcSkg8&limit=" + moreGifsLimit
            moreGifsLimit += 10
            responseIndex += 10
            console.log(moreGifsLimit)
            ajax(food[curGifIndex])
        }
    })
})

