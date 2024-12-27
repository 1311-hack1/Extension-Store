import React, { useState, useEffect } from 'react';

// Base64 placeholder icon (gray square with rounded corners)
const placeholderIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALESURBVHic7d29bhNBFIbh9x87JCmCREFBRU1FSUGXa+Ay6LgWboBLSIGQkBAFBUJCQhQ4yf7M7O7ZmfO9z1NIopxk/M7ZmbXXa1kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAr2h7/4dPz8MHo/0fz6+f3X6H0AAADgf7Ef+eRvx8/Dc4L3N1/C9/R0ePz9Ofw5h8NTuKbG/mYTrrnb7cM1LXI9Z7QmQqsA1PjyI7UC0uL5S5/z8ebzxb97uv0Rrjk+3oVrIuF7CiLYQo0AHJJfZPSXHK2v9eVHawCUBKDkOVs8/1kYgNKdKglAi+cvDUCkRc2oANT48mv9AlsEoEQYgNLnrPH8JQEoec5WAaj15df6BbYIQIkwAKXP2eP5LQJQEoBaX36tX2DtAJQKA1D6nL2e3yIAJQGo9eXX+gXWDkCpMACtz3+tAFgEoNaXX+sXWDsApcIAtD7/tQJgEYBaX36tX2DtAJQKA9D6/NcKgEUAan35tX6BtQNQKgxA6/NfKwAWAaj15df6BdYOQKkwAK3Pf60AWASg1pdf6xdYOwClwgC0Pv+1AmARgFpffq1fYO0AlAoD0Pr81wqARQBqffm1foG1A1AqDEDr818rABYBqPXl1/oF1g5AqTAA0fkvDUBJjSwCYBGAWl9+rV9g7QCUCgMQnf/SAJTUyCIAFgGo9eXX+gXWDkCpMADR+S8NQEmNLAJgEYBaX36tX2DtAJQKAxCd/9IAlNTIIgAWAaj15df6BdYOQKkwANH5Lw1ASY0sAmARgFpffq1fYO0AlAoDEJ3/0gCU1MgiABYBqPXl1/oF1g5AqTAA0fkvDUBJjSwCYBGAWl9+rV9g7QCUCgMQnf/SAJTUyCIAFgGo9eXX+gXWDkCpMAAWNQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwCn8AJ1KNwXKo7FEAAAAASUVORK5CYII=";

function ExtensionCard({ extension }) {
  const [iconUrl, setIconUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fetch actual URLs from GitHub API
    const fetchUrls = async () => {
      try {
        console.log('Fetching icon from:', extension.icon_url);
        // Fetch icon URL
        const iconResponse = await fetch(extension.icon_url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!iconResponse.ok) {
          throw new Error(`Icon fetch failed: ${iconResponse.status}`);
        }
        const iconData = await iconResponse.json();
        console.log('Icon data:', iconData);
        setIconUrl(iconData.download_url);

        // Fetch download URL
        const downloadResponse = await fetch(extension.download_url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!downloadResponse.ok) {
          throw new Error(`Download URL fetch failed: ${downloadResponse.status}`);
        }
        const downloadData = await downloadResponse.json();
        setDownloadUrl(downloadData.download_url);
      } catch (error) {
        console.error('Error fetching URLs:', error);
        setImageError(true);
      }
    };

    fetchUrls();
  }, [extension.icon_url, extension.download_url]);

  const handleImageError = () => {
    console.log('Image failed to load, using placeholder');
    setImageError(true);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      chrome.downloads.download({
        url: downloadUrl,
        filename: `${extension.name}-${extension.version}.crx`
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row p-3 border border-gray-200 rounded-lg gap-3 hover:shadow-md transition-shadow w-full">
      <div className="w-12 h-12 flex-shrink-0 relative">
        <img 
          src={!imageError ? (iconUrl || placeholderIcon) : placeholderIcon}
          alt={extension.name} 
          className="w-full h-full object-cover rounded"
          onError={handleImageError}
        />
        {!iconUrl && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
            <div className="animate-spin h-4 w-4 border-2 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-base font-semibold text-gray-800 truncate">
            {extension.name}
          </h2>
          <span className="text-xs text-gray-500 flex-shrink-0">v{extension.version}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">By {extension.author}</span>
          {extension.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2 mb-3 break-words">
          {extension.description}
        </p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleDownload}
            disabled={!downloadUrl}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              downloadUrl 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!downloadUrl ? 'Loading...' : 'Download'}
          </button>
          <button
            onClick={() => window.open(extension.github_url, '_blank')}
            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors"
          >
            View Source
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExtensionCard; 