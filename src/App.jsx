import React, { useState, useEffect } from 'react';
import ExtensionList from './components/ExtensionList';

function App() {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    try {
      // First try loading from local public folder during development
      const response = await fetch('/extensions.json');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Fetched data:', data);
      setExtensions(data.extensions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching extensions:', error);
      try {
        // Fallback to loading from dist folder
        const response = await fetch(chrome.runtime.getURL('extensions.json'));
        console.log('Fallback response status:', response.status);
        const data = await response.json();
        console.log('Fallback data:', data);
        setExtensions(data.extensions);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] min-h-[500px] p-4 bg-white">
      <header className="text-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">Extension Store</h1>
      </header>
      {loading ? (
        <div className="text-center p-5 text-gray-600">Loading...</div>
      ) : (
        <ExtensionList extensions={extensions} />
      )}
    </div>
  );
}

export default App; 