function getPhoto(tag, handlerCallback) {
    asyncGet(requestTag(tag), function(photoList) {
        asyncGet(requestOneFrom(photoList), function(photoSizes) {
            handlerCallback(sizesToPhoto(photoSizes));
        });
    });
}

getPhoto('tokyo', drawOnScreen);