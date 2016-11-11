$(document).on("gif:loaded", function() {
  $(".loading-container").toggleClass("loading");
  $(".main-container").toggleClass("loading");
  $(".nav-container").toggleClass("loading");
  var audio = $("#music")[0];
  audio.play();
})


$(document).ready(function() {

  var BASE_URL = "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=happy+dance&rating=pg-13"

  var randomButton = $("#random-button");
  var randomImg = $("#random-img");
  var imageContainer = $(".gif-container");

  var imagesArray = [];
  var imagesBlobsPromises = [];
  var currentIndex = 0;
  var giphyImages = [];

  for (var i = 0; i < 5; i++) {
    imagePromise = generateGIF();
    giphyImages.push(imagePromise);
  }

  Promise.all(giphyImages).then(function(images) {
    console.log("GIPHY ALL: ", images);

    images.forEach(function(image) {
      createImageFromUrl(image.image_url);
    })

    showImage(0);
  })
  randomButton.on('click', function(events) {
    pushedToImages();
    console.log("IMAGES ARRAY: ", imagesArray);
    console.log("currentIndex: ", currentIndex);
  });

  function createImageFromUrl(url) {
    var imageToBeLoaded = imgLoad(url);
    imagesBlobsPromises.push(imageToBeLoaded);
  }

  function pushedToImages() {
    var imagePromise = generateGIF();
    var imagePromise1 = generateGIF();
    giphyImages.push(imagePromise);
    giphyImages.push(imagePromise1);

    imagePromise.then(function(data) {
      createImageFromUrl(data.image_url);
    })
    imagePromise1.then(function(data) {
      createImageFromUrl(data.image_url);
    })

    currentIndex++;
    showImage(currentIndex);
  }

  function buttonLoading() {
    $('#random-button').addClass('btn-loading');

    console.log("[IMAGE ARRAY] =>", imagesArray);
    console.log("[IMAGE Promises] =>", imagesBlobsPromises);
  }

  function endButtonLoading() {
    $('#random-button').removeClass('btn-loading');
  }

  function showImage(currentIndex) {
    var image = new Image();
    image.className = "random-img";

    var imageToBeLoaded = imagesBlobsPromises[currentIndex];

    buttonLoading();


    imageToBeLoaded.then(function(response) {
      var imageURL = window.URL.createObjectURL(response);
      image.src = imageURL;
      imagesArray.push(image);

      imageContainer.empty();
      imageContainer.append(image);

      endButtonLoading();
      if (currentIndex == 0) {
        $(document).trigger("gif:loaded");
      }


    }, function(Error) {
      console.log(Error);
    });

  }

  function generateGIF() {
    var imagePromise = new Promise(
      function(resolve, reject) {
        $.ajax(BASE_URL).success(function(res) {
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

      // var promise = this;

      // request.onreadystatechange = function() {
      //   promise.prototype.1readyState = request.readyState;
      // }

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


$("#mute-btn").on('click', function(event) {
  var audio = $("#music")[0];
  if (audio.duration > 0 && !audio.paused) {
    audio.pause();
    $("#music").data('muted', true); //Store elements muted by the button.
  } else {
    audio.play();
  }

})
