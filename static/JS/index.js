
    // Form validation
    let contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let message = document.getElementById("message").value.trim();

            if (name === "" || email === "" || message === "") {
                alert("Please fill in all fields.");
                event.preventDefault();
            }
        });
    }

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