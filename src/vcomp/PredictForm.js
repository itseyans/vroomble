import { useState, useEffect } from "react";

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
    fetch("http://127.0.0.1:8000/car-makers")
      .then((res) => res.json())
      .then((data) => setMakers(data.makers))
      .catch((err) => console.error("Error fetching car makers:", err));
  }, []);

  useEffect(() => {
    if (selectedMaker) {
      fetch(`http://127.0.0.1:8000/car-models?make=${selectedMaker}`)
        .then((res) => res.json())
        .then((data) => setModels(data.models))
        .catch((err) => console.error("Error fetching car models:", err));
    }
  }, [selectedMaker]);

  useEffect(() => {
    if (selectedModel) {
      fetch(`http://127.0.0.1:8000/modification-types?model=${selectedModel}`)
        .then((res) => res.json())
        .then((data) => setModificationTypes(data.modification_types))
        .catch((err) => console.error("Error fetching modification types:", err));

      fetch(`http://127.0.0.1:8000/car-parts?model=${selectedModel}`)
        .then((res) => res.json())
        .then((data) => setCarParts(data.parts))
        .catch((err) => console.error("Error fetching car parts:", err));
    }
  }, [selectedModel]);

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
  };
};

export default usePredict;
