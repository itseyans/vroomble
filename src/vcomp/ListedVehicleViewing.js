import React from "react";

const vehicles = [
  {
    id: 1,
    name: "Car 1",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/BMW_330i_G20_IMG_0083.jpg/800px-BMW_330i_G20_IMG_0083.jpg",
  },
  {
    id: 2,
    name: "Car 2",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/2021_Mini_John_Cooper_Works_Countryman_front.jpg/800px-2021_Mini_John_Cooper_Works_Countryman_front.jpg",
  },
  {
    id: 3,
    name: "Car 3",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Peugeot_9X8_LMH_2022_Monza_front.jpg/800px-Peugeot_9X8_LMH_2022_Monza_front.jpg",
  },
  {
    id: 4,
    name: "Car 4",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/2020_Honda_Civic_Type_R_GT_Edition_front.jpg/800px-2020_Honda_Civic_Type_R_GT_Edition_front.jpg",
  },
];

const ListedVehicleViewing = () => {
  const handleClick = (vehicle) => {
    alert(`You clicked on ${vehicle.name}`);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Take full viewport height
          backgroundColor: "#f0f0f0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 300px)",
            gap: "20px",
            padding: "20px",
          }}
        >
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              style={{
                width: "300px",
                height: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                border: "1px solid black",
                backgroundColor: "white",
              }}
              onClick={() => handleClick(vehicle)}
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#222",
          height: "20px",
        }}
      ></div>
    </div>
  );
};

export default ListedVehicleViewing;