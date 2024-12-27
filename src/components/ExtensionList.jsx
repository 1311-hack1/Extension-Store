import React from 'react';
import ExtensionCard from './ExtensionCard';

function ExtensionList({ extensions }) {
  return (
    <div className="flex flex-col space-y-4">
      {extensions.map((extension) => (
        <ExtensionCard key={extension.id} extension={extension} />
      ))}
    </div>
  );
}

export default ExtensionList; 