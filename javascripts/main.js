if (!("passwordLength" in localStorage)) {
    localStorage.passwordLength = "4";
}
var passwordLengthSelect = document.getElementById("passwordLengthSelect");
passwordLengthSelect.value = localStorage.passwordLength;
passwordLengthSelect.addEventListener("change", function(event) {
    localStorage.passwordLength = this.value;
});

if (!("useSpaces" in localStorage)) {
    localStorage.useSpaces = false;
}
var useSpacesCheckbox = document.getElementById("useSpacesCheckbox");
useSpacesCheckbox.checked = localStorage.useSpaces == "true";
useSpacesCheckbox.addEventListener("change", function(event) {
    localStorage.useSpaces = this.checked;
});

var request = new XMLHttpRequest();
request.addEventListener("load", function() {
    words = this.responseText.split(/\n/);
    document.getElementById("wordCount").textContent = words.length;
    generate();
});
request.open("get", "words.txt", true);
request.send();

var passwordText;

function generate() {
    if ("crypto" in window && "getRandomValues" in window.crypto) {
        var numbers = new Uint32Array(parseInt(localStorage.passwordLength));
        window.crypto.getRandomValues(numbers);

        var generatedPassword = document.getElementById("generatedPassword");
        generatedPassword.innerHTML = "";
        passwordText = "";

        var maxUint32 = Math.pow(2,32) - 1;
        for (var i = 0; i < numbers.length; i++) {
            // Rounding down means we never reach words.length, which is good because the highest array index is length-1.
            var index = Math.floor(numbers[i] / maxUint32 * words.length);

            var text = words[index];
            if (localStorage.useSpaces == "true" && i < numbers.length - 1) {
                text += " ";
            }

            var span = document.createElement("span");
            span.appendChild(document.createTextNode(text));
            generatedPassword.appendChild(span);

            passwordText += text;
        }
    } else {
        showError("Your browser does not support the required feature 'window.crypto'. Try upgrading.");
    }
}
document.getElementById("new").addEventListener("click", generate);

function passwordToClipboard() {
    copyToClipboard(passwordText);
}
document.getElementById("copy").addEventListener("click", passwordToClipboard);

function clearClipboard() {
    copyToClipboard("");
}
document.getElementById("clear").addEventListener("click", clearClipboard);

function copyToClipboard(text) {
    var toClipboard = document.getElementById("toClipboard");
    toClipboard.appendChild(document.createTextNode(text));

    var range = document.createRange();
    range.selectNode(toClipboard);
    window.getSelection().addRange(range);

    var successful;
    try {
        successful = document.execCommand('copy');
    } catch (error) {
        successful = false;
    }
    if (!successful) {
        showError("Could not copy to clipboard.")
    }

    window.getSelection().removeAllRanges();
    toClipboard.innerHTML = "";
}

function showError(message) {
    var content = document.getElementById("main-content");
    var error = document.createElement("p");
    error.setAttribute("id", "error");
    error.appendChild(document.createTextNode(message));
    content.insertBefore(error, content.firstChild);
}