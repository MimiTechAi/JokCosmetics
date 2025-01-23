'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, MessageSquare, Minimize2, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

export default function FloatingAIAssistant() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Setze Unread-Status wenn neue Nachricht vom Assistenten kommt
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isOpen) {
      setHasUnread(true);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Fehler bei der Kommunikation mit dem KI-Assistenten');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Fehler:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage. Bitte versuchen Sie es erneut.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasUnread(false);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50 flex items-center gap-2 ${
          isOpen ? 'bg-gray-100 text-gray-900' : 'bg-blue-500 text-white'
        } ${hasUnread ? 'animate-bounce' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare size={24} />
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 right-6 w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden z-40 border border-gray-100 ${
              isMinimized ? 'h-auto' : 'h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" />
                <h3 className="font-medium">{t('assistant.name')}</h3>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector />
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label={t(isMinimized ? 'button.maximize' : 'button.minimize')}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  aria-label={t('button.close')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="flex flex-col h-[calc(600px-8rem)]"
                >
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4" ref={scrollRef}>
                      {messages.length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-8">
                          <p>{t('welcome')}</p>
                          <p className="text-xs mt-2">{t('assistant.greeting')}</p>
                        </div>
                      )}
                      {messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                              message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <div>{message.content}</div>
                            {message.timestamp && (
                              <div className="text-[10px] opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                            <div className="flex space-x-1">
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                              />
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t('input.placeholder')}
                        disabled={isLoading}
                        className="flex-1 text-sm"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        size="sm"
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        {t('button.send')}
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
