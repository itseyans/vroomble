import React, { useState, useEffect } from "react";
import axios from "axios";

const MaintenancePage = () => {
    const [logs, setLogs] = useState([]);
    const [carModel, setCarModel] = useState("");
    const [part, setPart] = useState("");
    const [cost, setCost] = useState("");
    const [date, setDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/logs/")
            .then(response => setLogs(response.data))
            .catch(error => console.error("Error fetching logs:", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newLog = { car_model: carModel, part, cost: parseFloat(cost), date, image_url: imageUrl };
        try {
            await axios.post("http://localhost:8000/logs/", newLog);
            setLogs([...logs, newLog]);
        } catch (error) {
            console.error("Error adding log:", error);
        }
    };

    return (
        <div>
            <h1>Maintenance Logs</h1>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log.date} - {log.car_model} - {log.part} - ${log.cost}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Car Model" value={carModel} onChange={(e) => setCarModel(e.target.value)} required />
                <input type="text" placeholder="Part" value={part} onChange={(e) => setPart(e.target.value)} required />
                <input type="number" placeholder="Cost" value={cost} onChange={(e) => setCost(e.target.value)} required />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <input type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <button type="submit">Add Log</button>
            </form>
        </div>
    );
};

export default MaintenancePage;
