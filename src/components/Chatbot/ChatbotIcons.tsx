import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import "./style.css"

interface Message {
    type: 'bot' | 'user';
    text: string;
    image?: string;
    thinking?: boolean;
    isError?: boolean;
}

interface SelectedFile {
    preview: string;
    data: string;
    mimeType: string;
}

interface ChatHistoryPart {
    text?: string;
    inline_data?: {
        data: string;
        mime_type: string;
    };
}

interface ChatHistoryItem {
    role: 'user' | 'model';
    parts: ChatHistoryPart[];
}

const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const ThinkingIndicator = () => (
    <div className="flex gap-1.5 py-3">
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="h-2.5 w-2.5 bg-gradient-to-b from-red-500 to-rose-500 rounded-full"
                style={{
                    animation: `pulse 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    animationDelay: `${i * 0.2}s`,
                    opacity: 0.6 + i * 0.2
                }}
            />
        ))}
    </div>
);

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            type: 'bot',
            text: 'Hey there 👋\nHow can I help you today?',
        }
    ]);
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const [isThinking, setIsThinking] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);

    const chatBodyRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY || "";
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL + "?key=" + API_KEY || "";

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [inputValue]);

    const generateBotResponse = async (userMessage: string, fileData: { data: string; mime_type: string } | null) => {
        const newHistory: ChatHistoryItem[] = [
            ...chatHistory,
            {
                role: "user",
                parts: [
                    { text: userMessage },
                    ...(fileData ? [{ inline_data: fileData }] : []),
                ],
            }
        ];

        setChatHistory(newHistory);

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: newHistory,
            }),
        };

        try {
            const response = await fetch(API_URL, requestOptions);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error.message);

            const apiResponseText = data.candidates[0].content.parts[0].text
                .replace(/\*\*(.*?)\*\*/g, "$1")
                .trim();

            setMessages(prev => [...prev.slice(0, -1), { type: 'bot', text: apiResponseText }]);

            setChatHistory([
                ...newHistory,
                {
                    role: "model",
                    parts: [{ text: apiResponseText }],
                }
            ]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setMessages(prev => [...prev.slice(0, -1), {
                type: 'bot',
                text: errorMessage,
                isError: true
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() && !selectedFile) return;

        const userMessage: Message = {
            type: 'user',
            text: inputValue,
            image: selectedFile?.preview
        };

        setMessages(prev => [...prev, userMessage]);
        setIsThinking(true);

        const fileData = selectedFile ? {
            data: selectedFile.data,
            mime_type: selectedFile.mimeType
        } : null;

        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text: '', thinking: true }]);
            generateBotResponse(inputValue, fileData);
        }, 600);

        setInputValue('');
        setSelectedFile(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            const base64String = result.split(',')[1];
            setSelectedFile({
                preview: result,
                data: base64String,
                mimeType: file.type
            });
        };
        reader.readAsDataURL(file);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chatbot Toggler */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 h-14 w-14 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-rose-600 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110 ${isOpen ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
                title="Open chat assistant"
                type="button"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            {/* Chatbot Popup */}
            <div
                className={`fixed right-6 w-full max-w-md bg-white rounded-3xl shadow-2xl transition-all duration-300 z-40 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                    } origin-bottom-right flex flex-col border border-gray-100 overflow-hidden`}
                style={{
                    top: isOpen ? '1.5rem' : 'auto',
                    bottom: isOpen ? 'auto' : '6rem',
                    maxHeight: isOpen ? 'calc(100vh - 3rem)' : '680px',
                    height: isOpen ? 'calc(100vh - 3rem)' : '680px'
                }}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 px-6 py-5">
                    {/* Decorative background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-8 w-16 h-16 bg-white rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/20 rounded-xl p-2 flex-shrink-0 backdrop-blur-sm">
                                <ChatbotIcon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-white font-bold text-lg">BloodLink Assistant</h2>
                                <p className="text-red-50 text-xs font-medium">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-shrink-0 text-white hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200 cursor-pointer"
                            title="Close chat"
                            type="button"
                        >
                            <svg className="h-6 w-6 text-white" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Chat Body */}
                <div
                    ref={chatBodyRef}
                    className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-white"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#e5e7eb transparent' }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 animate-fade-in ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            style={{
                                animation: 'fadeInUp 0.4s ease-out',
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            {message.type === 'bot' && (
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center shadow-sm">
                                    <ChatbotIcon className="h-5 w-5 text-white" />
                                </div>
                            )}
                            <div className={`flex flex-col max-w-[75%] gap-2`}>
                                {message.thinking ? (
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                                        <ThinkingIndicator />
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm transition-all ${message.type === 'bot'
                                                ? `bg-gray-100 text-gray-900 rounded-tl-none ${message.isError ? 'bg-red-50 text-red-700 border border-red-200' : ''}`
                                                : 'bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-br-none'
                                                }`}
                                        >
                                            {message.text}
                                        </div>
                                        {message.image && (
                                            <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <img
                                                    src={message.image}
                                                    alt="Attachment"
                                                    className="max-w-[200px] max-h-[200px] rounded-2xl rounded-tl-none shadow-md object-cover"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-white border-t border-gray-100 rounded-b-3xl space-y-4">
                    {/* File Preview */}
                    {selectedFile && (
                        <div className="relative inline-flex rounded-xl overflow-hidden border-2 border-red-200 bg-red-50">
                            <img
                                src={selectedFile.preview}
                                alt="Preview"
                                className="h-16 w-16 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                                title="Remove attachment"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    
                    {/* Input Area */}
                    <div className="relative bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:shadow-md transition-all">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            rows={1}
                            className="w-full px-5 py-3 pr-24 outline-none resize-none max-h-32 text-sm rounded-2xl bg-transparent text-gray-900 placeholder-gray-500"
                            style={{ scrollbarWidth: 'thin' }}
                        />

                        <div className="absolute right-2 bottom-2 flex items-center gap-2">
                            {/* File Upload */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isThinking}
                                className="h-9 w-9 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Attach image"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            {/* Send Button */}
                            <button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() && !selectedFile || isThinking}
                                className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 text-white hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
                                title="Send message"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Helper text */}
                    <p className="text-xs text-gray-500 text-center">Press Enter to send, Shift+Enter for new line</p>
                </div>
            </div>
        </>
    );
}
