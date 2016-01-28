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