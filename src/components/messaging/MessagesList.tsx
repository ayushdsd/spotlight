import { useState, useEffect } from 'react';
import axios from 'axios';

interface Contact {
  _id: string;
  name: string;
  picture?: string;
  lastMessage?: {
    content: string;
    createdAt: string;
    unread: boolean;
  };
  followStatus?: {
    isFollowing: boolean;
    isFollowedBy: boolean;
  };
}

export default function MessagesList({ onSelectContact }: { onSelectContact: (contact: Contact) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/contacts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        // Log the response for debugging
        console.error('Non-JSON response from /api/messages/contacts:', text);
        throw new Error('Failed to fetch contacts: Invalid server response.');
      }
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts');
      }
      // Filter contacts: mutuals and pending
      const mutuals: Contact[] = [];
      const pending: Contact[] = [];
      for (const contact of data) {
        try {
          const followStatusRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${contact._id}/follow-status`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (followStatusRes.data.isFollowing && followStatusRes.data.isFollowedBy) {
            mutuals.push({ ...contact, followStatus: followStatusRes.data });
          } else if (followStatusRes.data.isFollowing && !followStatusRes.data.isFollowedBy) {
            pending.push({ ...contact, followStatus: followStatusRes.data });
          }
        } catch (err) {
          // skip contact if error
        }
      }
      setContacts(mutuals);
      setPendingRequests(pending);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <div className="p-4">Loading contacts...</div>}
      {error && (
        <div className="p-4 text-red-500">
          Error: {error}
          <button
            className="ml-2 px-2 py-1 bg-blue-600 text-white rounded"
            onClick={fetchContacts}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Pending Follow Requests</h3>
              {pendingRequests.map(contact => (
                <div key={contact._id} className="flex items-center gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-2">
                  {contact.picture ? (
                    <img src={contact.picture} alt={contact.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-md text-gray-500">{contact.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{contact.name}</div>
                    <div className="text-xs text-yellow-700">Waiting for them to follow you back</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Mutuals */}
          <div>
            {contacts.length === 0 ? (
              <div className="p-4 text-gray-500">No mutual contacts to message. You must follow each other to appear here.</div>
            ) : (
              contacts.map(contact => (
                <div
                  key={contact._id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => onSelectContact(contact)}
                >
                  {contact.picture ? (
                    <img src={contact.picture} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg text-gray-500">{contact.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{contact.name}</div>
                    {contact.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {contact.lastMessage.content}
                        {contact.lastMessage.unread && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </p>
                    )}
                  </div>
                  {contact.lastMessage && (
                    <span className="text-sm text-gray-500">
                      {new Date(contact.lastMessage.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
