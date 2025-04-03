const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.post('/calculate-shipping', async (req, res) => {
    try {
        const { origin, destination } = req.body;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`);
        
        const distanceInMeters = response.data.rows[0].elements[0].distance.value;
        const distanceInKm = distanceInMeters / 1000;
        
        let cost = 49;
        if (distanceInKm <= 5) {
            cost += distanceInKm * 6;
        } else {
            cost += (5 * 6) + ((distanceInKm - 5) * 5);
        }

        res.json({ distance: distanceInKm.toFixed(2), cost: cost.toFixed(2) });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating shipping cost' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
