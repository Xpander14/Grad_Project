document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const paymentMethod = document.getElementById("payment-method");
    const paymentDetails = document.getElementById("payment-details");

    // Payment method selection handling
    paymentMethod.addEventListener("change", function () {
        paymentDetails.innerHTML = ""; // Clear previous input fields
        
        if (this.value === "visa") {
            paymentDetails.innerHTML = `
                <div class="mb-3">
                    <label for="card-number" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="card-number" placeholder="Enter card number" required>
                </div>
                <div class="mb-3">
                    <label for="expiry-date" class="form-label">Expiry Date</label>
                    <input type="text" class="form-control" id="expiry-date" placeholder="MM/YY" required>
                </div>
                <div class="mb-3">
                    <label for="cvv" class="form-label">CVV</label>
                    <input type="text" class="form-control" id="cvv" placeholder="CVV" required>
                </div>
            `;
        } else if (this.value === "instapay" || this.value === "fawry") {
            paymentDetails.innerHTML = `
                <div class="mb-3">
                    <label for="mobile-number" class="form-label">Mobile Number</label>
                    <input type="text" class="form-control" id="mobile-number" placeholder="Enter mobile number" required>
                </div>
            `;
        }
    });

    // Form validation and submission
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const address = document.getElementById("adress");
        const phone = document.getElementById("adress2");
        const country = document.getElementById("country");
        const city = document.getElementById("city");
        const postcode = document.getElementById("postcode");

        if (!address.value.trim() || !phone.value.trim() || country.value === "Choose..." || city.value === "Choose..." || postcode.value === "Choose...") {
            alert("Please fill in all required fields correctly.");
            return;
        }

        // Get the pending booking data
        const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking'));
        console.log('Pending booking data:', pendingBooking);
        
        if (!pendingBooking) {
            alert('Booking data not found. Please try booking again.');
            window.location.href = 'booking.html';
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            // Save booking data to server
            console.log('Sending booking data to server:', pendingBooking);
            const bookingResponse = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(pendingBooking)
            });

            if (!bookingResponse.ok) {
                const errorData = await bookingResponse.json();
                throw new Error(errorData.message || 'Failed to save booking');
            }

            // Clear the pending booking data
            localStorage.removeItem('pendingBooking');

            // Show success message and redirect
            alert('Booking confirmed! Thank you for your payment.');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing payment and booking. Please try again.');
        }
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
