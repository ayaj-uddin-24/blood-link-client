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
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
        <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" />
    </svg>
);

const ThinkingIndicator = () => (
    <div className="flex gap-1 py-4">
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="h-2 w-2 bg-rose-400 rounded-full opacity-70 animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
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
                className={`fixed bottom-8 right-9 z-50 h-12 w-12 flex items-center justify-center rounded-full bg-rose-500 shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-rose-600 ${isOpen ? 'rotate-90' : ''}`}
            >
                {isOpen ? (
                    <span className="text-white text-2xl">×</span>
                ) : (
                    <span className="text-white text-xl">💬</span>
                )}
            </button>

            {/* Chatbot Popup */}
            <div
                className={`fixed right-9 bottom-24 w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-100 z-40 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
                    } origin-bottom-right flex flex-col md:h-[600px] h-screen md:max-h-[600px]`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-rose-500 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white rounded-full p-1.5 flex-shrink-0">
                            <ChatbotIcon />
                        </div>
                        <h2 className="text-white font-semibold text-xl">Chatbot</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-rose-600 rounded-full p-2 transition-colors"
                    >
                        <span className="text-2xl leading-none">⌄</span>
                    </button>
                </div>

                {/* Chat Body */}
                <div
                    ref={chatBodyRef}
                    className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#fecdd3 transparent' }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.type === 'user' ? 'flex-col items-end' : 'items-start'}`}
                        >
                            {message.type === 'bot' && (
                                <div className="w-9 h-9 bg-rose-500 rounded-full p-1.5 flex-shrink-0 self-end fill-white">
                                    <ChatbotIcon />
                                </div>
                            )}
                            <div className={`max-w-[75%] ${message.type === 'user' ? 'order-1' : ''}`}>
                                {message.thinking ? (
                                    <div className="bg-rose-50 rounded-2xl px-4">
                                        <ThinkingIndicator />
                                    </div>
                                ) : (
                                    <div
                                        className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${message.type === 'bot'
                                            ? `bg-rose-50 rounded-tl-sm ${message.isError ? 'text-red-600' : ''}`
                                            : 'bg-rose-500 text-white rounded-br-sm'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                )}
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="w-1/2 mt-2 rounded-2xl rounded-tr-sm"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white rounded-b-2xl border-t">
                    <div className="relative bg-white rounded-full border border-rose-200 shadow-sm focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500 transition-all">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message..."
                            rows={1}
                            className="w-full px-5 py-3 pr-28 outline-none resize-none max-h-44 text-sm rounded-full"
                            style={{ scrollbarWidth: 'thin' }}
                        />

                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                            {/* File Upload */}
                            <div className="relative h-9 w-9">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {selectedFile ? (
                                    <>
                                        <img
                                            src={selectedFile.preview}
                                            alt="Preview"
                                            className="absolute inset-0 h-full w-full object-cover rounded-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setSelectedFile(null)}
                                            className="absolute inset-0 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors opacity-0 hover:opacity-100 flex items-center justify-center text-2xl"
                                        >
                                            ×
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-9 w-9 rounded-full text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center text-lg"
                                    >
                                        📎
                                    </button>
                                )}
                            </div>

                            {/* Send Button */}
                            {(inputValue.trim() || selectedFile) && (
                                <button
                                    type="button"
                                    onClick={handleSendMessage}
                                    className="h-9 w-9 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors flex items-center justify-center text-lg font-bold"
                                >
                                    ↑
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}