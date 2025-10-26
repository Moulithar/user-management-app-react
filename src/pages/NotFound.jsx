import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#1890ff' }}>404</h1>
      <h2 style={{ marginBottom: '2rem', color: '#333' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button 
        type="primary" 
        size="large"
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </div>
  );
};

export default NotFound;
