(function ($) {
    // var owl = $('.owl-carousel');
    // owl.owlCarousel();
    // // Listen to owl events:
    // owl.on('onDragged', function (event) {
    //     console.log(event.target)
    // })

    $('#owl-screen').owlCarousel({
        onDragged: callback
    });
    function callback(event) {
        console.log(event.target)
    }
})