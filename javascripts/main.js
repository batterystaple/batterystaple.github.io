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

var useSpacesCheckbox = document.getElementById("useSpacesCheckbox");
var useSpaces = false;
if ("useSpaces" in localStorage) {
    useSpaces = (localStorage.useSpaces == "true");
    useSpacesCheckbox.checked = useSpaces;
}

useSpacesCheckbox.addEventListener("change", function(event) {
    useSpaces = useSpacesCheckbox.checked;
    localStorage.useSpaces = useSpaces;
});

var request = new XMLHttpRequest();
request.addEventListener("load", function() {
    words = this.responseText.split(/\n/);
    document.getElementById("wordCount").textContent = words.length;
    generate();
});
request.open("get", "words.txt", true);
request.send();

function generate() {
    if ("crypto" in window && "getRandomValues" in window.crypto) {
        var numbers = new Uint32Array(passwordLength);
        window.crypto.getRandomValues(numbers);

        var generatedPassword = document.getElementById("generatedPassword");
        var maxUint32 = Math.pow(2,32) - 1;
        for (var i = 0; i < numbers.length; i++) {
            // Rounding down means we never reach words.length, which is good because the highest array index is length-1.
            var index = Math.floor(numbers[i] / maxUint32 * words.length);

            var text = words[index];
            if (useSpaces && i < numbers.length - 1) {
                text += " ";
            }

            var span = document.createElement("span");
            span.appendChild(document.createTextNode(text));
            generatedPassword.appendChild(span);
        }
    } else {
        showError("Your browser does not support the required feature 'window.crypto'. Try upgrading.");
    }
}

function showError(message) {
    var content = document.getElementById("main-content");
    var error = document.createElement("p");
    error.setAttribute("id", "error");
    error.appendChild(document.createTextNode(message));
    content.insertBefore(error, content.firstChild);
}