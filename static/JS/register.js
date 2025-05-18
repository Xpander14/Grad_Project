
    const form = document.getElementById("reg-form");

        form.addEventListener('submit', regUser);

        

    async function regUser(event) {
        event.preventDefault();
        const fullname = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const modal = document.getElementById('myModal');
        const closeModal = document.getElementById('closeModal');

        modal.style.display = 'flex'; // Show the modal
        form.reset(); // Optional: reset form fields

        closeModal.addEventListener('click', function() {
            modal.style.display = 'none'; // Hide the modal when clicking close
          });

          window.addEventListener('click', function(event) {
            if (event.target === modal) {
              modal.style.display = 'none';
            }
          });

        if (password.length < 5) {
            alert("Password too small. Should be atleast 6 characters")
        }
        
        
        if (password !== confirmPassword) {
            alert("Password does not match")
        }

        else {

        const result = await fetch('/api/register',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullname,email,password
            })
        }) .then((res) => res.json())
        }
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

        

        
    

