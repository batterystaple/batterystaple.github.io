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
    words = this.responseText.split(/\n/);
    display("wordCount", words.length);
    generate();
});
request.open("get", "words.txt", true);
request.send();

function generate() {
    if ("crypto" in window && "getRandomValues" in window.crypto) {
        var numbers = new Uint32Array(passwordLength);
        window.crypto.getRandomValues(numbers);

        var chosenWords = [];
        var maxUint32 = Math.pow(2,32) - 1;
        for (var i = 0; i < numbers.length; i++) {
            // Rounding down means we never reach words.length, which is good because the highest array index is length-1.
            var index = Math.floor(numbers[i] / maxUint32 * words.length);
            chosenWords.push(words[index]);
        }
        display("generatedPassword", chosenWords.join(" "));
    } else {
        showError("Your browser does not support the required feature 'window.crypto'. Try upgrading.");
    }
}

function display(id, content) {
    document.getElementById(id).textContent = content;
}

function showError(message) {
    var content = document.getElementById("main-content");
    var error = document.createElement("p");
    error.setAttribute("id", "error");
    error.appendChild(document.createTextNode(message));
    content.insertBefore(error, content.firstChild);
}