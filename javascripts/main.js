var passwordLengthSelect = document.getElementById("passwordLengthSelect");

var passwordLength = 4;
if ("passwordLength" in localStorage) {
    passwordLength = parseInt(localStorage.passwordLength);
    passwordLengthSelect.value = passwordLength;
}

passwordLengthSelect.addEventListener("change", function(event) {
    passwordLength = parseInt(this.value);
    localStorage.passwordLength = passwordLength;
});

var request = new XMLHttpRequest();
request.addEventListener("load", function() {
    words = JSON.parse(this.responseText);
    document.getElementById("wordCount").innerHTML = words.length;
    generate();
});
request.open("get", "words.json", true);
request.send();

function generate() {
    var chosenWords = [];
    if ("crypto" in window && "getRandomValues" in window.crypto) {
        var numbers = new Uint32Array(passwordLength);
        window.crypto.getRandomValues(numbers);

        var maxUint32 = Math.pow(2,32) - 1;
        for (var i = 0; i < numbers.length; i++) {
            // Rounding down means we never reach words.length, which is good because the highest array index is length-1.
            var index = Math.floor(numbers[i] / maxUint32 * words.length);
            chosenWords.push(words[index]);
        }
    } else {
        // TODO: fall back to Math.random()
        throw "Unsupported browser";
    }
    document.getElementById("generatedPassword").innerHTML = chosenWords.join(" ");
}
