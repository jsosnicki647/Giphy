var food = ["favorites","pizza","fried chicken","sandwich","bbq ribs","ice cream","cereal","hamburger","hot dog","egg roll","steak"]
var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=M5uE8mhUUUwubG4tLZfbkiAk6igcSkg8&limit=10"
var keyStrokes = 0
var moreGifsLimit = 20
var curGifIndex
var responseIndex = 0
var likes = []
var likeCount

function ajax(searchItem){
    $.ajax({
        url: queryURL + "&q=" + searchItem,
        method: "GET"
    }).then(function(response){
        for(i=responseIndex; i<responseIndex+10; i++){
            var divTitleButton = $("<div>")
            var divImgRating = $("<div>")
            var img = $("<img>")
            var rating = $("<p>")
            var title = $("<p>")
            var titleText = response.data[i].title.split("GIF")[0].trim()
            var stillURL = response.data[i].images.fixed_height_still.url
            var animatedURL = response.data[i].images.fixed_height.url
            var ratingText = response.data[i].rating.toUpperCase()
            img.attr("still-image", stillURL)
            img.attr("animated-image", animatedURL)
            img.attr("src", img.attr("still-image"))
            img.attr("state", "still")
            img.attr("rating", ratingText)

            if(titleText == ""){
                titleText="untitled"
            }
            
            img.attr("title", titleText)
            title.html(titleText)
            var button = $("<button class='like' title='" + titleText + "' rating=" + ratingText + " still-image=" + stillURL + " animated-image=" + animatedURL + " state='still'>&#10084</button>")

            for(j=0; j<likes.length; j++){
                if(likes[j][0] == button.attr("still-image")){
                    button.css("background", "#007BFF")
                }
            }

            title.addClass("title")
            rating.text("Rating: " + ratingText)
            divTitleButton.append(title)
            divTitleButton.append(button)
            divImgRating.append(img)
            divImgRating.append(rating)
            divTitleButton.append(divImgRating)
            $("#gifs").prepend(divTitleButton)
        }

        imgClickEvent()
	
        $(".like").on("click", function(){
            $(this).css("background", "#007BFF")
            var likeImages = []
            var img = $(this).attr("still-image")
            
            if(!likesArrayIndexChecker(likes, img)){
                likeImages[0] = $(this).attr("still-image")
                likeImages[1] = $(this).attr("animated-image")
                likeImages[2] = $(this).attr("title")
                likeImages[3] = $(this).attr("rating")
                likes.push(likeImages)
                localStorage.setItem("still-image" + likeCount, likeImages[0])
                localStorage.setItem("animated-image" + likeCount, likeImages[1])
                localStorage.setItem("title" + likeCount, likeImages[2])
                localStorage.setItem("rating" + likeCount, likeImages[3])
                likeCount++
                localStorage.setItem("likeCount", likeCount)
            }
        })
   })
}

function likesArrayIndexChecker(array, element){
    for(i=0; i<array.length; i++){
        for(j=0; j<4; j++){
            if(array[i][j] == element){
                return true
                break
            }
        }
    }
    return false
}

function renderButtons(){
    $("#buttons").empty()
    
    for(i=0; i<food.length; i++){
        var button = $("<button>")

        if(i==0){
            button.attr("id", "favorites")
            button.addClass("btn btn-success")
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
        $("#favorites").css("background", "#28A745")
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
        $(this).css("background", "#DAAD38")
        $(".button").css("background", "#939290")
        
        for(i=0; i<likes.length; i++){
            var img = $("<img>")
            var divTitleButton = $("<div>")
            var divImgRating = $("<div>")
            var title = $("<p class='title'>")
            var rating = $("<p>")
            img.attr("src", likes[i][0])
            img.attr("still-image", likes[i][0])
            img.attr("animated-image", likes[i][1])
            title.html(likes[i][2])
            var button = $("<button id=" + i + " class='unlike'>X</button>")
            button.addClass("btn btn-danger")
            rating.text("Rating: " + likes[i][3])
            img.attr("state", "still")
            divTitleButton.append(title)
            divTitleButton.append(button)
            divImgRating.append(img)
            divImgRating.append(rating)
            divTitleButton.append(divImgRating)
            $("#gifs").append(divTitleButton)
        }

        imgClickEvent()

        $(".unlike").on("click",function(){
            var index = parseInt($(this).attr("id"))
            $(this).parent().fadeOut(200)
            likes.splice(index,1)
            console.log(likes)
            console.log(index+1)
            console.log(likeCount)
            for(i=index+1; i<likeCount+1; i++){
                console.log("here")
                localStorage.setItem("still-image" + (i-1), localStorage.getItem("still-image" + i))
                localStorage.setItem("animated-image" + (i-1), localStorage.getItem("animated-image" + i))
                localStorage.setItem("title" + (i-1), localStorage.getItem("title" + i))
                localStorage.setItem("rating" + (i-1), localStorage.getItem("rating" + i))
            }

            localStorage.removeItem("still-image" + likeCount)
            localStorage.removeItem("animated-image" + likeCount)
            localStorage.removeItem("title" + likeCount)
            localStorage.removeItem("rating" + likeCount)

            likeCount--
            localStorage.setItem("likeCount", likeCount)


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
    likeCount = localStorage.getItem("likeCount")
    // localStorage.clear()
    if(likeCount != null){
        for(i=0; i<likeCount; i++){
            var likeImages = []
            likeImages[0] = localStorage.getItem("still-image" + i)
            likeImages[1] = localStorage.getItem("animated-image" + i)
            likeImages[2] = localStorage.getItem("title" + i)
            likeImages[3] = localStorage.getItem("rating" + i)
            likes.push(likeImages)
        }
    }
    else{
        likeCount = 0
    }

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
            ajax(food[curGifIndex])
        }
    })
})
