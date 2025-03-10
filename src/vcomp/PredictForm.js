import React, { useState, useEffect } from "react";
import axios from "axios";

const usePredict = () => {
  const [makers, setMakers] = useState([]);
  const [models, setModels] = useState([]);
  const [modificationTypes, setModificationTypes] = useState([]);
  const [carParts, setCarParts] = useState([]);

  const [selectedMaker, setSelectedMaker] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modificationType, setModificationType] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [months, setMonths] = useState(12);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/car-makers")
      .then(res => setMakers(res.data.makers));
  }, []);

  useEffect(() => {
    if (selectedMaker) {
      axios.get(`http://127.0.0.1:8000/car-models?make=${selectedMaker}`)
        .then(res => setModels(res.data.models));
    }
  }, [selectedMaker]);

  useEffect(() => {
    if (selectedModel) {
      axios.get(`http://127.0.0.1:8000/modification-types?model=${selectedModel}`)
        .then(res => setModificationTypes(res.data.modification_types));

      axios.get(`http://127.0.0.1:8000/car-parts?model=${selectedModel}`)
        .then(res => setCarParts(res.data.parts));
    }
  }, [selectedModel]);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict-price", {
        make: selectedMaker,
        model_name: selectedModel,
        modification_type: modificationType,
        selected_parts: selectedParts,
        months: parseInt(months, 10),
      });

      setPrediction(response.data);
    } catch (error) {
      alert(`Error: ${error.response.data.detail}`);
      console.error(error);
    }
    setLoading(false);
  };

  return {
    makers,
    models,
    modificationTypes,
    carParts,
    selectedMaker,
    setSelectedMaker,
    selectedModel,
    setSelectedModel,
    modificationType,
    setModificationType,
    selectedParts,
    setSelectedParts,
    months,
    setMonths,
    fetchPrediction,
    prediction,
    loading,
  };
};

export default PredictForm;
