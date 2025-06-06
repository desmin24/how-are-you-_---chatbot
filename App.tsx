
import React, { useState, useEffect, useRef } from 'react';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { sendMessageToGemini, initializeChat } from './services/geminiService';
import { ChatMessage, MessageSender } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat on component mount
  useEffect(() => {
    try {
      initializeChat();
      // Optionally, add an initial greeting message from the bot
      setMessages([
        {
          id: 'initial-greeting',
          text: '你好呀！我是「今天好嗎？」，很高興認識你。有什麼想跟我聊聊的嗎？😊',
          sender: MessageSender.BOT,
          timestamp: new Date(),
        }
      ]);
    } catch (err) {
      if (err instanceof Error) {
        setError(`初始化聊天失敗：${err.message} 請檢查 API Key 是否已設定。`);
      } else {
        setError('初始化聊天失敗，發生未知錯誤。');
      }
      console.error("Initialization error:", err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (text: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      text,
      sender: MessageSender.USER,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    setError(null);

    const botMessageId = Date.now().toString() + '-bot';
    // Add a placeholder for the bot's message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: botMessageId,
        text: '', // Start with empty text
        sender: MessageSender.BOT,
        timestamp: new Date(),
      },
    ]);

    try {
      await sendMessageToGemini(
        text,
        (chunkText) => { // onStreamUpdate
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, text: msg.text + chunkText }
                : msg
            )
          );
        },
        () => { // onStreamEnd
          setIsLoading(false);
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '與 Gemini API 通訊時發生錯誤';
      setError(errorMessage);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: `抱歉，發生錯誤：${errorMessage}` }
            : msg
        )
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-200">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-md text-center">
        <h1 className="text-2xl font-bold">今天好嗎?</h1>
        <p className="text-sm opacity-90">一個溫暖的聊天夥伴</p>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-2 rounded" role="alert">
          <p className="font-bold">發生錯誤</p>
          <p>{error}</p>
        </div>
      )}

      <main className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
        {isLoading && messages[messages.length -1]?.sender === MessageSender.BOT && messages[messages.length -1]?.text === '' && (
           <div className="flex justify-start mb-4">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow-md bg-slate-100 text-slate-800 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
