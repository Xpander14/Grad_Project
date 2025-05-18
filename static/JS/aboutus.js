document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'service-item'
    const serviceItems = document.querySelectorAll('.service-item');

    // Add a click event listener to each service item
    serviceItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Retrieve the service name from the data attribute
            const serviceName = this.getAttribute('data-service');
            // Encode the service name to ensure it's URL-safe
            const encodedServiceName = encodeURIComponent(serviceName);
            // Redirect to the booking page with the service name as a query parameter
            window.location.href = `booking.html?service=${encodedServiceName}`;
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