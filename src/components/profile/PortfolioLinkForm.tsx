import React, { useState } from 'react';

interface PortfolioLink {
  title: string;
  url: string;
  description: string;
}

interface PortfolioLinkFormProps {
  onSubmit: (link: PortfolioLink) => void;
  onCancel: () => void;
}

const PortfolioLinkForm: React.FC<PortfolioLinkFormProps> = ({ onSubmit, onCancel }) => {
  const [link, setLink] = useState<PortfolioLink>({
    title: '',
    url: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(link);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={link.title}
          onChange={(e) => setLink({ ...link, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="url"
          id="url"
          value={link.url}
          onChange={(e) => setLink({ ...link, url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={link.description}
          onChange={(e) => setLink({ ...link, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Add Link
        </button>
      </div>
    </form>
  );
};

export default PortfolioLinkForm;
