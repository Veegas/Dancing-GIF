$(window).load(function () {
  $(".loading-container").toggleClass("loading");
  $(".main-container").toggleClass("loading");
})


$(document).ready(function () {

  var BASE_URL = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=happy+dance&rating=pg-13"

  var randomButton = $("#random-button");
  var randomImg = $("#random-img");
  var imageContainer = $(".gif-container");

  var imagesArray = [];
  var currentIndex = 0;
  var giphyImages = [];
  for (var i = 0; i < 5; i++) {
    imagePromise = generateGIF();
    giphyImages.push(imagePromise);
  }

    Promise.all(giphyImages).then(function (images) {
        console.log("GIPHY ALL: ", images);

        images.forEach(function (image) {
            createImageFromUrl(image.image_url);
        })

    })

  randomButton.on('click', function(events) {
      pushedToImages(imagesArray);
      console.log("IMAGES ARRAY: ", imagesArray);
      console.log("currentIndex: ", currentIndex);
  });

  function createImageFromUrl(url) {
    var image = new Image();
    // image.style.width="100%";
    image.className="random-img";

    imgLoad(url).then(function(response) {
      var imageURL = window.URL.createObjectURL(response);
      image.src = imageURL;

      imagesArray.push(image);
      if (imagesArray.length == 1) {
        showImage(0);
      }
      console.log("IMAGES ARRAY: ", imagesArray);
      console.log("currentIndex: ", currentIndex);

    }, function(Error) {
      console.log(Error);
    });

    return imgLoad;
  }

  function pushedToImages(images) {
    var imagePromise = generateGIF();

    if (images.length <= 1 ) {
        currentIndex = 0;
    } else if (currentIndex < images.length - 1){
        currentIndex++;
    }
    // randomImg.attr('src', images[currentIndex]);
    showImage(currentIndex);
    imagePromise.then(function (data) {
      createImageFromUrl(data.image_url);
    })

  }

  function showImage(currentIndex) {
      imageContainer.empty();
      imageContainer.append(imagesArray[currentIndex]);
  }

  function generateGIF() {
    var imagePromise = new Promise(
      function(resolve, reject) {
        $.ajax(BASE_URL).success(function (res) {
          resolve(res.data);
        })
      }
    );
    return imagePromise;
  }


  function imgLoad(url) {
    return new Promise(function(resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url);
      request.responseType = 'blob';
      request.onload = function() {
        if (request.status === 200) {
          resolve(request.response);
        } else {
          reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
        }
      };
      request.onerror = function() {
          reject(Error('There was a network error.'));
      };
      request.send();
    });
  }

})
