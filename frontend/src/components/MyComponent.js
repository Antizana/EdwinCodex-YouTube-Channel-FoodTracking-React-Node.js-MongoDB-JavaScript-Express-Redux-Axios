import React, { useState, useEffect } from "react";

const MyComponent = () => {
  const [name, setName] = useState();

  useEffect(() => {
    console.info(`A Mount "${name}"`);
    setName("Peter");
    return () => console.info(`B Unmount "${name}"`);
  }, []);

  useEffect(() => {
    console.info(`C Name Update "${name}"`);
    return () => console.info(`D name Update or Unmount "${name}"`);
  }, [name]);

  function handleButtonClick() {
    const newName = name === "Peter" ? "Alice" : "Peter";
    setName(newName);
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Hi {name}, please click here!</button>
    </div>
  );
};

export default MyComponent;
