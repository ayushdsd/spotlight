import { useState, useEffect } from 'react';

interface Contact {
  _id: string;
  name: string;
  picture?: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    unread: boolean;
  };
}

export default function MessagesList({ onSelectContact }: { onSelectContact: (contact: Contact) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      console.log('Fetching contacts...');
      console.log('API URL:', import.meta.env.VITE_API_URL);
      console.log('User token:', localStorage.getItem('token'));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/contacts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts');
      }

      setContacts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading contacts...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error: {error}
        <button
          onClick={fetchContacts}
          className="ml-2 text-blue-500 hover:text-blue-700 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        No messages yet. Start a conversation with someone!
      </div>
    );
  }

  return (
    <div className="divide-y">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => onSelectContact(contact)}
          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
        >
          <img
            src={contact.picture || '/default-avatar.png'}
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{contact.name}</h3>
              {contact.lastMessage && (
                <span className="text-sm text-gray-500">
                  {new Date(contact.lastMessage.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {contact.lastMessage && (
              <p className="text-sm text-gray-600 truncate">
                {contact.lastMessage.content}
                {contact.lastMessage.unread && (
                  <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
