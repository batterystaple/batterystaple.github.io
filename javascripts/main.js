var request = new XMLHttpRequest();
request.addEventListener("load", function() {
    words = JSON.parse(this.responseText);
    document.getElementById("wordCount").innerHTML = words.length;
    generate(4);
});
request.open("get", "words.json", true);
request.send();

function generate(passwordLength) {
    var chosenWords = [];
    if ("crypto" in window && "getRandomValues" in window.crypto) {
        var maxUint32 = Math.pow(2,32) - 1;
        var array = new Uint32Array(passwordLength);
        window.crypto.getRandomValues(array);

        for (var i = 0; i < array.length; i++) {
            // Rounding down means we never reach words.length, which is good because the highest array indexes is length-1.
            var index = Math.floor(array[i] / maxUint32 * words.length);
            chosenWords.push(words[index]);
        }
    } else {
        // TODO: fall back to Math.random()
        throw "Unsupported browser";
    }
    document.getElementById("generatedPassword").innerHTML = chosenWords.join(" ");
}
