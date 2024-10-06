document.addEventListener("DOMContentLoaded", function () {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("js/overlay-widget.js");
    script.onload = function () {
        kofiWidgetOverlay.draw('areezvisram', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Donate',
            'floating-chat.donateButton.background-color': '#ffffff',
            'floating-chat.donateButton.text-color': '#323842',
            'floating-chat.donateButton.font-size': '1120px', // Adjust width as needed
            'floating-chat.donateButton.height': '40px'  // Adjust height as needed
        });
    };
    document.head.appendChild(script);

});
