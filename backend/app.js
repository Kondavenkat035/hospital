const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const FILE = "data.json";

// Helper function to read data safely
function readData() {
    try {
        const data = fs.readFileSync(FILE);
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write data
function writeData(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ✅ Health check (for Load Balancer)
app.get('/', (req, res) => {
    res.send("Backend running");
});

// ✅ Get all appointments
app.get('/appointments', (req, res) => {
    const data = readData();
    res.json(data);
});

// ✅ Add appointment
app.post('/appointments', (req, res) => {
    const { name, doctor, date } = req.body;

    if (!name || !doctor || !date) {
        return res.status(400).json({ message: "All fields required" });
    }

    const data = readData();

    const newAppointment = {
        id: Date.now(),
        name,
        doctor,
        date
    };

    data.push(newAppointment);
    writeData(data);

    res.json({ message: "Appointment booked successfully" });
});

// ✅ Delete appointment (optional upgrade)
app.delete('/appointments/:id', (req, res) => {
    let data = readData();

    data = data.filter(a => a.id != req.params.id);
    writeData(data);

    res.json({ message: "Deleted successfully" });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
