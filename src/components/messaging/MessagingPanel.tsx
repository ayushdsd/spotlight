import { useState } from 'react';
import MessagesList from './MessagesList';
import ChatWindow from './ChatWindow';

interface Contact {
  _id: string;
  name: string;
  picture?: string;
}

export default function MessagingPanel() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Contacts List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <MessagesList onSelectContact={setSelectedContact} />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedContact ? (
          <ChatWindow
            recipientId={selectedContact._id}
            recipientName={selectedContact.name}
            recipientPicture={selectedContact.picture}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
