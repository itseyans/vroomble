"use client"; // ✅ Ensure client-side rendering

import { useState, useEffect } from "react";
import axios from "axios";

const usePredict = () => {
  const [carMakers, setCarMakers] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carParts, setCarParts] = useState([]);
  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [months, setMonths] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hydration, setHydration] = useState(false); // ✅ Prevent SSR hydration issues

  /** Prevent hydration errors */
  useEffect(() => {
    setHydration(true);
  }, []);

  /** Fetch car makers */
  useEffect(() => {
    if (hydration) {
      axios
        .get("http://127.0.0.1:8000/car-makers")
        .then((response) => setCarMakers(response.data.makers || []))
        .catch((error) => console.error("Error fetching car makers:", error));
    }
  }, [hydration]);

  /** Fetch car models */
  useEffect(() => {
    if (selectedMaker && hydration) {
      axios
        .get(http://127.0.0.1:8000/car-models?make=${selectedMaker})
        .then((response) => setCarModels(response.data.models || []))
        .catch((error) => console.error("Error fetching car models:", error));
    }
  }, [selectedMaker, hydration]);

  /** Fetch car parts */
  useEffect(() => {
    if (selectedModel && hydration) {
      axios
        .get(http://127.0.0.1:8000/car-parts?model=${selectedModel})
        .then((response) => setCarParts(response.data.parts || []))
        .catch((error) => console.error("Error fetching car parts:", error));
    }
  }, [selectedModel, hydration]);

  /** Fetch price prediction */
  const fetchPrediction = async () => {
    if (!selectedModel || selectedParts.length === 0 || !months) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict-price", {
        car_maker: selectedMaker,
        car_model: selectedModel,
        selected_parts: selectedParts,
        months: parseInt(months),
      });

      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Error fetching prediction");
    }
    setLoading(false);
  };

  return {
    carMakers,
    carModels,
    carParts,
    selectedMaker,
    setSelectedMaker,
    selectedModel,
    setSelectedModel,
    selectedParts,
    setSelectedParts,
    months,
    setMonths,
    prediction,
    fetchPrediction,
    loading,
    hydration,
  };
};

export default usePredict; // ✅ Export the hook (fix this why are you giving me new code) 