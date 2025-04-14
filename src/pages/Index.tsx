
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the presentation editor
    navigate('/presentation');
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-background text-foreground">
      <p>Redirecting to presentation editor...</p>
    </div>
  );
};

export default Index;
