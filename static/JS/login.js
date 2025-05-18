
const form = document.getElementById("loginForm");

form.addEventListener('submit', regUser);



async function regUser(event) {
event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'ok') {
                // login successful
                localStorage.setItem('token', result.data);
                // Redirect to  homepage
                window.location.href = './index.html'; 
            } else {
                alert(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to connect to server. Please check your connection and try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    };

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
