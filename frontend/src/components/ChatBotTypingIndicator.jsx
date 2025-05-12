'use client';

import React from 'react';

const ChatBotTypingIndicator = () => {
  return (
    <div className="flex space-x-1 items-center px-1">
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default ChatBotTypingIndicator;
