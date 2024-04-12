import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Train.css';

const TrainPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const date = queryParams.get('date');
    const trainPathName = queryParams.get('trainPathName');

    const [trainData, setTrainData] = useState([]);

    useEffect(() => {
        const fetchTrainData = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:8083/api/timetable/filterTT',
                    {
                        filterDate: date,
                        filterPathName: trainPathName
                    }
                );
                const trains = response.data.map(record => record.trainId);
                const trainDataPromises = trains.map((trainId) =>
                    axios.get(`http://localhost:8081/api/train/${trainId}`)
                );

                const trainDataResponses = await Promise.all(trainDataPromises);
                const trainDataArray = trainDataResponses.map((response) => response.data);
                console.log(trainDataArray)
                setTrainData(trainDataArray);
            } catch (error) {
                console.error('Error fetching train data:', error);
            }
        };
        fetchTrainData();
    }, [date, trainPathName]);

    const handleTrainButtonClick = (trainId) => {
        window.location.href = `/reserve?date=${date}&trainPathName=${trainPathName}&trainId=${trainId}`;
    };

    return (
        <div className="train-page">
            <h1>Choose Your Train</h1>
            {trainData.map((train, index) => (
                <div key={index} className="train-card">
                    <img src={train.trainImage} alt={train.trainName} className="train-image" />
                    <div className="train-content">
                        <h2 className="train-name">{train.trainName}</h2>
                        <p className="train-type">Train Type: {train.trainType}</p>
                        <p className="train-fare">Fare: ${train.trainFare}</p>
                        <p className="train-capacity">Capacity: {train.trainCapacity}</p>
                    </div>
                    <button className="view-details-button" onClick={() => handleTrainButtonClick(train.trainId)}>Book Now</button>
                </div>
            ))}
        </div>
    );
};
export default TrainPage;
