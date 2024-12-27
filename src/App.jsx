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
      // Fetch from GitHub repository
      const response = await fetch('https://raw.githubusercontent.com/1311-hack1/Extension-Store/main/extensions.json');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to fetch extensions');
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      setExtensions(data.extensions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching extensions:', error);
      // Fallback to empty array if fetch fails
      setExtensions([]);
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
      ) : extensions.length === 0 ? (
        <div className="text-center p-5 text-gray-600">No extensions found</div>
      ) : (
        <ExtensionList extensions={extensions} />
      )}
    </div>
  );
}

export default App; 