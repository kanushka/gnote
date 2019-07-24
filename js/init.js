(function ($) {
  $(function () {

    M.AutoInit();
    $('input#input_text, textarea#textarea2').characterCounter();
    $('.tooltipped').tooltip();
    $('select').formSelect();
    setLoadingScreen();

    // scroll to top
    $('html, body').animate({
      scrollTop: 0
    }, 500);

    // load serviceWorker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function () {
          console.log('Service Worker Registered');
        });
    }

  }); // end of document ready


  function setLoadingScreen() {
    let screenSize = $(window).width();
    if (screenSize < 600) {
      // mobile device
      // show preloader
      $('#logoPreloader').show();
      // hide logo preloader
      setTimeout(function () {
        $('#logoPreloader').fadeOut();
        $('#mainActionBtn').removeClass('scale-out');
        $('#mainActionBtn').addClass('scale-in');
      }, 1000);

    } else {
      $('#logoPreloader').fadeOut('slow');
      $('#mainActionBtn').removeClass('scale-out');
      $('#mainActionBtn').addClass('scale-in');
    }
  }

})(jQuery); // end of jQuery name space


let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

async function install() {
  console.log('install btn clicked');

  if (deferredPrompt) {
    deferredPrompt.prompt();
    console.log(deferredPrompt)
    deferredPrompt.userChoice.then(function (choiceResult) {

      if (choiceResult.outcome === 'accepted') {
        console.log('Your PWA has been installed');
      } else {
        console.log('User chose to not install your PWA');
      }
      deferredPrompt = null;
    });
  }
}