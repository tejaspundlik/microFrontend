import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import './Reservation.css';

const ReservationPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');
    const trainPathName = queryParams.get('trainPathName');
    const trainId = queryParams.get('trainId');
    const timetableId = queryParams.get('timetableId');
    console.log(date, trainPathName, trainId);

    const [originOptions, setOriginOptions] = useState([]);
    const [destinationOptions, setDestinationOptions] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [passengers, setPassengers] = useState(['']); // Initialize with one empty cell
    const [fare, setFare] = useState(null); // Track whether fare has been displayed

    useEffect(() => {
        axios.get(`http://localhost:8084/api/location/${trainPathName}`)
            .then(response => {
                const stations = response.data.stationList;
                setOriginOptions(stations);
                setDestinationOptions(stations);
            })
            .catch(error => {
                console.error('Error fetching station data:', error);
            });
    }, [trainPathName]);

    const handleAddPassenger = () => {
        setPassengers([...passengers, '']);
    };

    const handlePassengerNameChange = (index, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index] = value;
        setPassengers(updatedPassengers);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const reservationData = {
            trainId,
            trainPathName,
            timetableId,
            origin,
            destination,
            passengerName: passengers,
        };
        try {
            const res = await axios.post('http://localhost:8082/api/reservation/getTotalFare', reservationData);
            console.log(res);
            setFare(res.data)
            alert("Your Fare Is " + res.data)
        } catch (error) {
            console.error('Error submitting reservation:', error);
        }
    };

    const handlePayWithCash = async () => {
        const reservationData = {
            trainId,
            trainPathName,
            timetableId,
            origin,
            destination,
            totalFare: fare,
            passengerName: passengers,
        };
        try {
            const res = await axios.post('http://localhost:8082/api/reservation/checkAvailabilityAndReserve', reservationData);
            console.log(res);
            alert("Your Ticket Id Is " + res.data.key)
        } catch (error) {
            console.error('Error submitting reservation:', error);
        }
    };

    // Filter destination options based on selected origin
    useEffect(() => {
        if (origin && origin !== '') {
            setDestinationOptions(originOptions.filter(station => station !== origin));
        } else {
            setDestinationOptions(originOptions);
        }
    }, [origin, originOptions]);

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <div className="station-fields">
                    <TextField
                        select
                        label="Origin Station"
                        variant="outlined"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    >
                        {originOptions.map((station, index) => (
                            <MenuItem key={index} value={station}>
                                {station}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label="Destination Station"
                        variant="outlined"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    >
                        {destinationOptions.map((station, index) => (
                            <MenuItem key={index} value={station}>
                                {station}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                {passengers.map((passenger, index) => (
                    <TextField
                        key={index}
                        label={`Passenger ${index + 1}`}
                        variant="outlined"
                        value={passenger}
                        onChange={(e) => handlePassengerNameChange(index, e.target.value)}
                    />
                ))}
                <Button onClick={handleAddPassenger}>Add Passenger</Button>
                {fare !== null ? ( // Display the fare and Pay with Cash button if fare is available
                    <>
                        <Button onClick={handlePayWithCash} variant="contained" color="primary" className="button">
                            Pay with Cash
                        </Button>
                    </>
                ) : ( // Display the Reserve button if fare is not available
                    <Button type="submit" variant="contained" color="primary" className="button">
                        Reserve
                    </Button>
                )}
            </form>
        </div>
    );
};

export default ReservationPage;
