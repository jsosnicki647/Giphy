var food = ["favorites","pizza","fried chicken","sandwich","bbq ribs","ice cream","cereal","hamburger","hot dog","egg roll","steak"]
var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M5uE8mhUUUwubG4tLZfbkiAk6igcSkg8&limit=10"
var keyStrokes = 0
var moreGifsLimit = 20
var curGifIndex
var responseIndex = 0
var likes = []

function ajax(searchItem){
    $.ajax({
        url: queryURL + "&q=" + searchItem,
        method: "GET"
    }).then(function(response){
        
        for(i=responseIndex; i<responseIndex+10; i++){
            var div = $("<div>")
            var img = $("<img>")
            var rating = $("<p>")
            var title = $("<p>")
            var titleText = response.data[i].title.split("GIF")[0].trim()
	    
            img.attr("still-image", response.data[i].images.fixed_height_still.url)
            img.attr("animated-image", response.data[i].images.fixed_height.url)
            img.attr("src", img.attr("still-image"))
            img.attr("state", "still")
            img.attr("rating", response.data[i].rating.toUpperCase())
            

            if(titleText == ""){
                title.html("untitled" + "<button class='like' title='untitled' rating=" + response.data[i].rating.toUpperCase() + " still-image=" + response.data[i].images.fixed_height_still.url + " animated-image=" + response.data[i].images.fixed_height.url + " state='still'>x</button>")
                img.attr("title", "untitled")
            }
            else{
                title.html(titleText + "<button class='like' title='" + titleText + "' rating=" + response.data[i].rating.toUpperCase() + " still-image=" + response.data[i].images.fixed_height_still.url + " animated-image=" + response.data[i].images.fixed_height.url + " state='still'>x</button>")
                img.attr("title", titleText)
            }
            console.log(titleText)
            title.addClass("title")
            rating.text("Rating: " + response.data[i].rating.toUpperCase())
	    
            div.append(title)
            div.append(img)
            div.append(rating)
            $("#gifs").prepend(div)
        }

        imgClickEvent()
	
        $(".like").on("click", function(){
            var likeImages = []

            if(likes.indexOf($(this).attr("still-image")) == -1){
                likeImages[0] = $(this).attr("still-image")
                likeImages[1] = $(this).attr("animated-image")
                likeImages[2] = $(this).attr("title")
                likeImages[3] = $(this).attr("rating")
                likes.push(likeImages)
            }
        })
   })
}

function renderButtons(){
    $("#buttons").empty()
    
    for(i=0; i<food.length; i++){
        var button = $("<button>")
	if(i==0){
		button.attr("id", "favorites")
		button.addClass("btn btn-secondary")
	}
	else{
		button.addClass("button btn btn-secondary")
	}
        button.text(food[i])
        button.attr("data-food", food[i])
        
        $("#buttons").append(button)
    }

    $(".button").on("click", function(){
	    moreGifsLimit = 20
	    responseIndex = 0
        $(".button").css("background", "#939290")
        $(this).css("background", "#DAAD38")
        $("#gifs").empty()
        $("#more-gifs-button").removeClass("btn-light").addClass("btn-success")
        var foodItem = $(this).data("food")
        curGifIndex = food.indexOf($(this).data("food"))
        ajax(foodItem)
    })

    $("#add-item").on("click", function(){
        $("#add-item").attr("placeholder", "")
    })
	
    $("#favorites").on("click", function(){
        $("#gifs").empty()
        
        for(i=0; i<likes.length; i++){
            console.log(likes)
            var img = $("<img>")
            var div = $("<div>")
            var title = $("<p class='title'>")
            var rating = $("<p>")
            img.attr("src", likes[i][0])
            img.attr("still-image", likes[i][0])
            img.attr("animated-image", likes[i][1])
            title.html(likes[i][2] + "<button class='unlike'>x</button>")
            rating.text(likes[i][3])
            img.attr("state", "still")
            div.append(title)
            div.append(img)
            div.append(rating)
            $("#gifs").append(div)
        }
        imgClickEvent()
        $(".unlike").on("click",function(){
            $(this).parent().parent().fadeOut(200)
        })
    })
}      



function imgClickEvent(){
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
