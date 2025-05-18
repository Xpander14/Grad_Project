document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const profile = document.getElementById("prof");
    const log = document.getElementById("log");
    const logout = document.getElementById("logout");
    const reg = document.getElementById("reg");

    // Check if user is logged in
    if (!token) {
        alert('Please login first to make a booking.');
        window.location.href = './login.html';
        return;
    } else {
        log.style.display = "none";
        reg.style.display = "none";
        logout.style.display = "block";
    }

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Add click event listeners to time slots
    const timeSlots = document.querySelectorAll('.time-slots button');
    timeSlots.forEach(button => {
        button.addEventListener('click', () => selectTime(button));
    });

    // Handle form submission
    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get selected time
        const selectedTimeBtn = document.querySelector('.time-slots button.active');
        if (!selectedTimeBtn) {
            alert('Please select a time slot.');
            return;
        }

        // Get selected services
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(cb => cb.value);
        if (selectedServices.length === 0) {
            alert('Please select at least one service.');
            return;
        }

        // Get user info from token
        try {
            const userResponse = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const userData = await userResponse.json();

            if (userData.status !== 'ok') {
                throw new Error('Failed to get user data');
            }

            // Create form data for booking
            const formData = {
                date: document.getElementById('date').value,
                time: selectedTimeBtn.dataset.time,
                address: document.getElementById('address').value,
                mobile: document.getElementById('mobile').value,
                services: selectedServices,
                name: userData.data.fullname,
                email: userData.data.email,
                status: 'pending'
            };

            // Send booking data directly to the server
            const bookingResponse = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!bookingResponse.ok) {
                throw new Error('Failed to save booking');
            }

            // Redirect to checkout with booking details
            const params = new URLSearchParams();
            params.append('date', formData.date);
            params.append('time', formData.time);
            params.append('name', userData.data.fullname);
            params.append('address', formData.address);
            params.append('mobile', formData.mobile);
            formData.services.forEach(service => params.append('services', service));
            window.location.href = `checkout.html?${params.toString()}`;
        } catch (error) {
            console.error('Error:', error);
            alert('Error processing booking. Please try again.');
        }
    });
});

function selectTime(button) {
    // Remove active class from all buttons
    document.querySelectorAll('.time-slots button').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('btn-success');
        btn.classList.add('btn-outline-success');
    });

    // Add active class to selected button
    button.classList.add('active');
    button.classList.remove('btn-outline-success');
    button.classList.add('btn-success');

    // Update hidden time input
    document.getElementById('time').value = button.dataset.time;
}

function logout1() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}




document.addEventListener("DOMContentLoaded", function () {
    let selectedService = localStorage.getItem("selectedService");
    if (selectedService) {
        let checkboxes = document.querySelectorAll('.services input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.value === selectedService) {
                checkbox.checked = true;
            }
        });
    }
});