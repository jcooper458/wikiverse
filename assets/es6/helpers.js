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
