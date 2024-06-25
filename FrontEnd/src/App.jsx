import React, { useState, useEffect } from 'react';
import './App.css';
import soil from './icons/soil.png';
import motion from './icons/move-sensor.png';
import level from './icons/waterlevel.png';
import motor from './icons/motor.png';
import fencing from './icons/fencing.png';
import axios from 'axios';

function App() {
    const [fencingValue, setFencingValue] = useState(false);
    const [moisture, setMoisture] = useState("0");
    const [waterLevel, setWaterLevel] = useState("0");
    const [motionDetection, setMotionDetection] = useState(false);
    const [fieldMotorStatus, setFieldMotorStatus] = useState(false);
    const [waterTankMotorStatus, setWaterTankMotorStatus] = useState(false);
    const [fieldRotationAngle, setFieldRotationAngle] = useState(0);
    const [waterTankRotationAngle, setWaterTankRotationAngle] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch data from the API
    async function fetchData() {
        try {
            const response = await axios.post("https://backend-black-tau-90.vercel.app/datas");
            const data = response.data;
            setFencingValue(data.isFencing);
            setMoisture(data.Soil);
            setWaterLevel(data.Waterlevel);
            setMotionDetection(data.isMotion);
            setFieldMotorStatus(data.FieldMotor);
            setWaterTankMotorStatus(data.WaterTankMotor);
            setLoading(false);
        } catch (error) {
            setError("Error fetching data");
            setLoading(false);
        }
    }

    // Function to update data to the API
    async function updateData(updateFields = {}) {
        try {
            await axios.post("https://backend-black-tau-90.vercel.app/update", updateFields);
        } catch (error) {
            setError("Error updating data");
            throw error; // Rethrow error to handle in calling function
        }
    }

    // Function to toggle field motor status
    const toggleFieldMotor = async () => {
        const newFieldMotorStatus = !fieldMotorStatus; // Toggle status
        setFieldMotorStatus(newFieldMotorStatus); // Update state optimistically
        if (!newFieldMotorStatus) {
            setFieldRotationAngle(0); // Reset angle when motor is stopped
        }
        try {
            // Update data in the database
            await updateData({ FieldMotor: newFieldMotorStatus });
        } catch (error) {
            // Handle error and revert state if update fails
            setFieldMotorStatus(!newFieldMotorStatus);
            setError("Error updating data");
        }
    };
    const fencingbtn = async () => {
        const newFencingValue = !fencingValue; // Toggle fencing status
        setFencingValue(newFencingValue); // Update state optimistically
        try {
            // Update data in the database
            await updateData({ isFencing: newFencingValue });
        } catch (error) {
            // Handle error and revert state if update fails
            setFencingValue(!newFencingValue);
            setError("Error updating data");
        }
    };
    
    // Function to toggle water tank motor status
    const toggleWaterTankMotor = async () => {
        const newWaterTankMotorStatus = !waterTankMotorStatus; // Toggle status
        setWaterTankMotorStatus(newWaterTankMotorStatus); // Update state optimistically
        if (!newWaterTankMotorStatus) {
            setWaterTankRotationAngle(0); // Reset angle when motor is stopped
        }
        try {
            // Update data in the database
            await updateData({ WaterTankMotor: newWaterTankMotorStatus });
        } catch (error) {
            // Handle error and revert state if update fails
            setWaterTankMotorStatus(!newWaterTankMotorStatus);
            setError("Error updating data");
        }
    };

    // Effect to handle rotation animation for field motor
    useEffect(() => {
        let intervalId;
        if (fieldMotorStatus) {
            intervalId = setInterval(() => {
                setFieldRotationAngle(prevAngle => (prevAngle + 5) % 360);
            }, 40);
        } else {
            setFieldRotationAngle(0);
            clearInterval(intervalId); // Stop rotation when motor is off
        }
        // toggleFieldMotor();
        return () => clearInterval(intervalId);
    }, [fieldMotorStatus]);

    // Effect to handle rotation animation for water tank motor
    useEffect(() => {
        let intervalId;
        if (waterTankMotorStatus) {
            intervalId = setInterval(() => {
                setWaterTankRotationAngle(prevAngle => (prevAngle + 5) % 360);
            }, 40);
        } else {
            clearInterval(intervalId); // Stop rotation when motor is off
        }
        return () => clearInterval(intervalId);
    }, [waterTankMotorStatus]);

    useEffect(() => {
        fetchData(); // Fetch initial data when component mounts
        const interval = setInterval(fetchData, 1000); // Periodically fetch data
        // toggleFieldMotor(); // Cleanup interval
        // updateData();
        return () => clearInterval(interval);
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <p className='headers'>Agriculture IoT</p>
            <section>
                <div className='buttons'>
                    <p>Motion detection</p>
                    <img src={motion} alt="" />
                    <p>Motion : {motionDetection ? "Detected" : "Not Detected"}</p>
                </div>
                <div className='buttons'>
                    <p>Fencing</p>
                    <img src={fencing} alt="" />
                    {/* <p>Status : {fencingValue ? "ON" : "OFF"}</p> */}
                    <button onClick={fencingbtn}>{fencingValue ? "Turn OFF" : "Turn ON"}</button>
                </div>
                <div className='buttons'>
                    <p>Soil Moisture</p>
                    <img src={soil} alt="" />
                    <p>Value : {moisture}</p>
                </div>
                <div className='buttons'>
                    <p>Field Motor</p>
                    <img src={motor} alt="" style={{ transform: `rotate(${fieldRotationAngle}deg)` }} />
                    <button className='status' onClick={toggleFieldMotor}>{fieldMotorStatus ? "Stop" : "Start"}</button>
                </div>
                <div className='buttons'>
                    <p>Water Level</p>
                    <img src={level} alt="" />
                    <p>Level : {waterLevel}</p>
                </div>
                <div className='buttons'>
                    <p>Water Tank Motor</p>
                    <img src={motor} alt="" style={{ transform: `rotate(${waterTankRotationAngle}deg)` }} />
                    <button onClick={toggleWaterTankMotor}>{waterTankMotorStatus ? "Stop" : "Start"}</button>
                </div>
            </section>
        </div>
    );
}

export default App;
