import NavBar from "./YellowNavBar";

const YellowNavBarContent = () => {
  const users = 100;
  const vehicles = 50;
  const registeredCars = 200;
  const sellers = 20;

  return (
    <div>
      <NavBar
        users={users}
        vehicles={vehicles}
        registeredCars={registeredCars}
        sellers={sellers}
      />
      {/* ... other content ... */}
    </div>
  );
};

export default YellowNavBarContent;