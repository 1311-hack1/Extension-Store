import React from 'react';

function ExtensionCard({ extension }) {
  const handleDownload = () => {
    chrome.downloads.download({
      url: extension.download_url,
      filename: `${extension.name}-${extension.version}.crx`
    });
  };

  return (
    <div className="flex p-3 border border-gray-200 rounded-lg gap-3 hover:shadow-md transition-shadow">
      <img 
        src={extension.icon} 
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
            className="bg-green-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Download
          </button>
          <a 
            href={extension.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded text-sm font-medium border border-gray-200 hover:border-gray-300 transition-colors"
          >
            View Source
          </a>
        </div>
      </div>
    </div>
  );
}

export default ExtensionCard; 