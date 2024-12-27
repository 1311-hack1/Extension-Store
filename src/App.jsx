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
      const response = await fetch('https://api.github.com/repos/1311-hack1/Extension-Store/contents/extensions.json', {
        headers: {
          'Accept': 'application/vnd.github.v3.raw+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
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
    <div className="w-full min-h-screen bg-white">
      <header className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">Extension Store</h1>
      </header>
      <main className="p-4">
        {loading ? (
          <div className="text-center p-5 text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center p-5 text-red-600">
            Error: {error}
            <button 
              onClick={fetchExtensions}
              className="block w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : extensions.length === 0 ? (
          <div className="text-center p-5 text-gray-600">No extensions found</div>
        ) : (
          <ExtensionList extensions={extensions} />
        )}
      </main>
    </div>
  );
}

export default App; 