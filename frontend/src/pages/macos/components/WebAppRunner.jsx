import React from 'react';

export default function WebAppRunner({ appPackage }) {
  if (!appPackage) return null;

  return (
    <div className="w-full h-full bg-slate-950 overflow-hidden relative">
      <iframe
        title={appPackage.name}
        srcDoc={appPackage.entryCode || '<h1>Application Entry Point Not Found</h1>'}
        sandbox="allow-scripts allow-forms allow-modals allow-downloads"
        className="w-full h-full border-none"
      />
    </div>
  );
}
