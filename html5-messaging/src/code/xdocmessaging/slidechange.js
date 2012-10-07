var activeDemo = '';
Reveal.addEventListener('slidechanged', function(evt) {
    // find the active slide
    var demo = $('section.present').data('demo');
    
    if (demo && activeDemo !== demo && window.opener) {
        window.opener.postMessage('demo.' + demo, '*');
    }
});