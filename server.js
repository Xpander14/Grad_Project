const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const Booking = require('./model/booking')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect("mongodb+srv://ahmed:ahmed123@project.3g8ge.mongodb.net/?retryWrites=true&w=majority&appName=Project").then(() =>{
    console.log("connected to DB")
    }).catch((error) => {
        console.log("Error connecting DB",error)
    })


const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

// Middleware for token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(401).json({ status: 'error', error: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ status: 'error', error: 'Invalid token' });
    }
};

app.post('/bookings', verifyToken, async (req, res) => {
    try {
        console.log('Creating booking with data:', req.body);
        const booking = new Booking({
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            mobile: req.body.mobile,
            services: req.body.services,
            date: req.body.date,
            time: req.body.time,
            status: 'pending'
        });
        const savedBooking = await booking.save();
        console.log('Booking saved successfully:', savedBooking);
        res.status(201).send({ status: 'ok', message: 'Booking saved successfully' });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(400).send({ status: 'error', message: 'Failed to save booking', error: error.message });
    }
});

app.get('/api/user-reservations', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user) {
            console.log('User not found for ID:', req.user.id);
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        console.log('Fetching reservations for email:', user.email);
        const reservations = await Booking.find({ email: user.email }).sort({ date: -1 }).lean();
        console.log('Found reservations:', reservations);
        
        res.json({
            status: 'ok',
            data: {
                name: user.fullname,
                email: user.email,
                reservations: reservations.map(res => ({
                    services: res.services,
                    date: res.date,
                    time: res.time,
                    address: res.address,
                    mobile: res.mobile,
                    status: res.status || 'pending'
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ status: 'error', message: 'Error fetching reservations', error: error.message });
    }
});

app.post('/api/change-password', async (req, res) => {
	const { token, newpassword: plainTextPassword } = req.body

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(plainTextPassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { email, password } = req.body
	const user = await User.findOne({ email }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid email/password' })
})

app.post('/api/register', async (req, res) => {
	const { fullname, email, password: plainTextPassword } = req.body

	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!fullname || typeof fullname !== 'string') {
		return res.json({ status: 'error', error: 'Invalid Name' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			email,
			password,
			fullname,
			isAdmin: false // Default to non-admin
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			return res.json({ status: 'error', error: 'email already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})

// Route to get user profile info
app.get('/api/profile', verifyToken, async (req, res) => {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
        return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    res.json({ status: 'ok', data: { fullname: user.fullname, email: user.email } });
});

// Dummy bookings data (you can later connect real DB)
const dummyBookings = [
    { userId: 'someuserid', service: 'Cleaning', date: '2025-04-30' },
    { userId: 'someuserid', service: 'Gardening', date: '2025-05-02' },
];

// Route to get user bookings
app.get('/api/bookings', verifyToken, async (req, res) => {
    // Example: filter bookings by user ID
    const userBookings = dummyBookings.filter(b => b.userId === req.user.id);

    res.json({ status: 'ok', data: userBookings });
});

// Admin middleware
const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.isAdmin) {
            return res.status(403).json({ status: 'error', error: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
};

// Check if user is admin
app.get('/api/check-admin', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        res.json({ isAdmin: user?.isAdmin || false });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

// Admin routes
app.get('/api/admin/bookings', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const total = await Booking.countDocuments();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const total = await User.countDocuments();
        res.json({ total });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

app.get('/api/admin/recent-bookings', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .sort({ date: -1 })
            .limit(10)
            .lean();
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

app.put('/api/admin/booking-status/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await Booking.findByIdAndUpdate(id, { status });
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

// Route to get all users for admin
app.get('/api/admin/users/all', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().lean();
        console.log('Found users:', users); // Debug log
        const formattedUsers = users.map(user => ({
            fullname: user.fullname,
            email: user.email,
            role: user.isAdmin ? 'admin' : 'user'
        }));
        console.log('Formatted users:', formattedUsers); // Debug log
        res.json({ users: formattedUsers });
    } catch (err) {
        console.error('Error fetching users:', err); // Debug log
        res.status(500).json({ status: 'error', error: 'Server error' });
    }
});

app.post('/api/create-admin', async (req, res) => {
    const { fullname, email, password: plainTextPassword } = req.body;

    if (!email || !fullname || !plainTextPassword) {
        return res.json({ status: 'error', error: 'All fields are required' });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
        const response = await User.create({
            email,
            password,
            fullname,
            isAdmin: true
        });
        console.log('Admin user created successfully: ', response);
        res.json({ status: 'ok', message: 'Admin user created successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Email already in use' });
        }
        res.json({ status: 'error', error: 'Failed to create admin user' });
    }
});

app.listen(3000, () => {
	console.log('Server up at 3000')
})