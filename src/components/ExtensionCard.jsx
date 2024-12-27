import React, { useState, useEffect } from 'react';

function ExtensionCard({ extension }) {
  const [iconUrl, setIconUrl] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    // Fetch actual URLs from GitHub API
    const fetchUrls = async () => {
      try {
        // Fetch icon URL
        const iconResponse = await fetch(extension.icon_url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const iconData = await iconResponse.json();
        setIconUrl(iconData.download_url);

        // Fetch download URL
        const downloadResponse = await fetch(extension.download_url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        const downloadData = await downloadResponse.json();
        setDownloadUrl(downloadData.download_url);
      } catch (error) {
        console.error('Error fetching URLs:', error);
      }
    };

    fetchUrls();
  }, [extension.icon_url, extension.download_url]);

  const handleDownload = () => {
    if (downloadUrl) {
      chrome.downloads.download({
        url: downloadUrl,
        filename: `${extension.name}-${extension.version}.crx`
      });
    }
  };

  return (
    <div className="flex p-3 border border-gray-200 rounded-lg gap-3 hover:shadow-md transition-shadow">
      <img 
        src={iconUrl || 'placeholder.png'} 
        alt={extension.name} 
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h2 className="text-base font-semibold text-gray-800">
            {extension.name}
          </h2>
          <span className="text-xs text-gray-500">v{extension.version}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">By {extension.author}</span>
          {extension.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2 mb-3">
          {extension.description}
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            disabled={!downloadUrl}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              downloadUrl 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Download
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