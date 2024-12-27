import React, { useState, useEffect } from 'react';
import ExtensionList from './components/ExtensionList';

function App() {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    try {
      // Using GitHub API to fetch the file content
      const response = await fetch('https://api.github.com/repos/1311-hack1/Extension-Store/contents/extensions.json', {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fileData = await response.json();
      // GitHub API returns base64 encoded content
      const content = atob(fileData.content);
      const data = JSON.parse(content);
      
      console.log('Fetched data:', data);
      
      if (!data || !data.extensions) {
        throw new Error('Invalid data format');
      }
      
      setExtensions(data.extensions);
      setError(null);
    } catch (error) {
      console.error('Error fetching extensions:', error);
      setError(error.message);
      setExtensions([]);
    } finally {
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
      ) : error ? (
        <div className="text-center p-5 text-red-600">
          Error: {error}
          <button 
            onClick={fetchExtensions}
            className="block mx-auto mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : extensions.length === 0 ? (
        <div className="text-center p-5 text-gray-600">No extensions found</div>
      ) : (
        <ExtensionList extensions={extensions} />
      )}
    </div>
  );
}

export default App; 