import React from 'react';

const LeftPanel = () => {
  return (
    <div style={{ 
      width: '300px', // Adjust width as needed
      padding: '20px',
      border: '1px solid #ccc', // Optional border
      borderRadius: '8px',
      backgroundColor: '#f0f0f0', // Optional background color
      marginRight: '20px', // Spacing from middle panel
    }}>
      <h2 style={{ textAlign: 'center' }}>Additional Information</h2>

      <div style={{ marginTop: '20px' }}>
        <button style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px', 
          borderRadius: '5px',
          border: '1px solid #ddd', 
          backgroundColor: 'white',
          textAlign: 'left' 
        }}>
          Accident History: None
        </button>

        <button style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px', 
          borderRadius: '5px',
          border: '1px solid #ddd', 
          backgroundColor: 'white',
          textAlign: 'left' 
        }}>
          Performance Mods: None
        </button>

        <button style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px', 
          borderRadius: '5px',
          border: '1px solid #ddd', 
          backgroundColor: 'white',
          textAlign: 'left' 
        }}>
          Registered: Yes
        </button>

        <button style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px', 
          borderRadius: '5px',
          border: '1px solid #ddd', 
          backgroundColor: 'white',
          textAlign: 'left' 
        }}>
          Color: Bayside Blue
        </button>

        <button style={{ 
          width: '100%', 
          padding: '10px', 
          borderRadius: '5px',
          border: 'none', 
          backgroundColor: '#4CAF50', // Green color
          color: 'white',
          textAlign: 'left' 
        }}>
          Condition: Like New
        </button>
      </div>
    </div>
  );
};

export default LeftPanel;