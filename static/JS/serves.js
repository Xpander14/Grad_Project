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