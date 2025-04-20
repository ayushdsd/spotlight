import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    picture?: string;
  };
  content: string;
  attachments?: {
    url: string;
    type: string;
  }[];
  createdAt: string;
  read: boolean;
}

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  recipientPicture?: string;
}

export default function ChatWindow({ recipientId, recipientName, recipientPicture }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [canMessage, setCanMessage] = useState<boolean>(true);
  const [checkingFollow, setCheckingFollow] = useState<boolean>(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check mutual following before allowing messaging
  useEffect(() => {
    const checkMutualFollow = async () => {
      setCheckingFollow(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/users/${recipientId}/follow-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCanMessage(res.data.isFollowing && res.data.isFollowedBy);
      } catch {
        setCanMessage(false);
      } finally {
        setCheckingFollow(false);
      }
    };
    checkMutualFollow();
  }, [recipientId]);

  // Fetch or create conversation on recipientId change
  useEffect(() => {
    const getConversationId = async () => {
      if (!recipientId) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations/by-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipientId }),
        });
        const data = await res.json();
        setConversationId(data.conversationId);
      } catch (error) {
        setConversationId(null);
      }
    };
    getConversationId();
  }, [recipientId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (canMessage && conversationId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [conversationId, canMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!conversationId) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations/${conversationId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    setLoading(true);
    try {
      let attachmentData;
      if (attachment) {
        const formData = new FormData();
        formData.append('file', attachment);
        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/message-attachment`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });
        attachmentData = await uploadResponse.json();
      }

      if (!conversationId) return;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          conversationId,
          content: newMessage,
          attachments: attachmentData ? [attachmentData] : undefined,
        }),
      });

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');
      setAttachment(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingFollow) {
    return <div className="flex items-center justify-center h-full text-gray-500">Checking follow status...</div>;
  }

  if (!canMessage) {
    return <div className="flex items-center justify-center h-full text-gray-500 text-center">
      You can only message users who follow you back. Please follow each other to start messaging.
    </div>;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <img
          src={recipientPicture || '/default-avatar.png'}
          alt={recipientName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="font-semibold">{recipientName}</h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(m => m.sender).map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender._id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              {message.attachments?.map((attachment, index) => (
                <div key={index} className="mt-2">
                  {attachment.type === 'image' ? (
                    <img src={attachment.url} alt="attachment" className="max-w-full rounded" />
                  ) : (
                    <video src={attachment.url} controls className="max-w-full rounded" />
                  )}
                </div>
              ))}
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            className="hidden"
            id="attachment"
          />
          <label
            htmlFor="attachment"
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {attachment && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-sm text-gray-500">{attachment.name}</span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
