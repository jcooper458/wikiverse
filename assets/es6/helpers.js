//strip html from given text
export const strip = dirtyString => {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = dirtyString;
    return tmp.textContent || tmp.innerText || "";
}

//check weather image is in portrait mode or not
export const isPortrait = (imgElement) => {

    if (imgElement.width() < imgElement.height()) {
        return true;
    } else {
        return false;
    }
}

//find URLs in tweets/wikis,etc and replace them with clickable link
export const urlify = (text) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
            return '<a class="externalLink" target="_blank" href="' + url + '">' + url + '</a>';
        })
        // or alternatively
        // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

//function used within validate coordinates
export const inrange = (min, number, max) => {
    if (!isNaN(number) && (number >= min) && (number <= max)) {
        return true;
    } else {
        return false;
    }
}

//validate if it is a coordinate
export const valid_coords = (number_lat, number_lng) => {
    if (inrange(-90, number_lat, 90) && inrange(-180, number_lng, 180)) {
        $("#btnSaveResort").removeAttr("disabled");
        return true;
    } else {
        $("#btnSaveResort").attr("disabled", "disabled");
        return false;
    }
}