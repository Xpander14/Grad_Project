document.addEventListener("DOMContentLoaded", function () {
    // Video Play Button Functionality
    const videoThumbnail = document.querySelector(".video-thumbnail");
    if (videoThumbnail) {
        videoThumbnail.addEventListener("click", function () {
            alert("Video player functionality not implemented. Replace this with a video modal.");
            // You can replace the alert with a modal that loads a YouTube or local video
        });
    }

    // Email Subscription Form Validation
    const subscribeForm = document.querySelector("form");
    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const emailInput = subscribeForm.querySelector("input[type='email']");
            if (emailInput && validateEmail(emailInput.value)) {
                alert("Thank you for subscribing!");
                emailInput.value = ""; // Clear input after submission
            } else {
                alert("Please enter a valid email address.");
            }
        });
    }

    // Email Validation Function
    function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".book-service").forEach(button => {
        button.addEventListener("click", function () {
            let serviceName = this.getAttribute("data-service");
            localStorage.setItem("selectedService", serviceName);
            window.location.href = "booking.html";
        });
    });
});
//hide profile

const token = localStorage.getItem('token');
const profile = document.getElementById("prof")
const log = document.getElementById("log")
const logout = document.getElementById("logout")
const reg = document.getElementById("reg")

if (!token) {
    profile.style.display = "none";
    log.style.display = "block";
    reg.style.display = "block";
    
} else {
    log.style.display = "none";
    reg.style.display = "none";
    logout.style.display = "block";
}

function logout1() {
    localStorage.removeItem('token');

// Optional: Redirect to login page
window.location.href = '/login.html'; // or wherever your login page is
}



