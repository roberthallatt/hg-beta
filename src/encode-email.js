function protectEmail(email) {
    var encoded = "";
    for (var i = 0; i < email.length; i++) {
        encoded += "&#" + email.charCodeAt(i) + ";";
    }
    return encoded;
}

function decodeEmail(encodedEmail) {
    return encodedEmail.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}

function setupEmailProtection() {
    var emailElements = document.querySelectorAll('.protected-email');
    emailElements.forEach(function(element) {
        var encodedEmail = element.getAttribute('data-email');
        var decodedEmail = decodeEmail(encodedEmail);
        
        element.innerHTML = '<a href="#" class="email-link">' + encodedEmail + '</a>';
        
        element.querySelector('.email-link').addEventListener('click', function(e) {
            e.preventDefault();
            this.innerHTML = decodedEmail;
            this.href = 'mailto:' + decodedEmail;
        });
    });
}

// document.addEventListener('DOMContentLoaded', setupEmailProtection);

var email = "HealthyGenerations@cps.ca";
var encoded = protectEmail(email);
console.log(encoded);