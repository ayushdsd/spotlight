import React, { useState, useEffect } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface PortfolioFormData {
  title: string;
  description: string;
  category: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'link';
  mediaFile?: File;
  tags: string[];
  credits: Array<{ name: string; role: string }>;
  visibility: 'public' | 'private' | 'unlisted';
}

interface PortfolioFormProps {
  initialData?: Partial<PortfolioFormData>;
  onSubmit: (data: PortfolioFormData) => void;
  onCancel: () => void;
}

const categories = [
  'Acting',
  'Music',
  'Dance',
  'Photography',
  'Visual Arts',
  'Writing',
  'Other',
];

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: '',
    description: '',
    category: 'Acting',
    type: 'image',
    tags: [],
    credits: [],
    visibility: 'public',
    ...initialData,
  });

  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [creditName, setCreditName] = useState('');
  const [creditRole, setCreditRole] = useState('');

  useEffect(() => {
    if (formData.mediaFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(formData.mediaFile);
    }
  }, [formData.mediaFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, mediaFile: file });
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleCreditAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (creditName.trim() && creditRole.trim()) {
      setFormData({
        ...formData,
        credits: [...formData.credits, { name: creditName.trim(), role: creditRole.trim() }],
      });
      setCreditName('');
      setCreditRole('');
    }
  };

  const handleCreditRemove = (index: number) => {
    setFormData({
      ...formData,
      credits: formData.credits.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Media Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Media Type
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as PortfolioFormData['type'],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="document">Document</option>
          <option value="link">Link</option>
        </select>
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Media</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {mediaPreview ? (
              <div className="relative">
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="mx-auto h-32 w-auto"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, mediaFile: undefined });
                    setMediaPreview('');
                  }}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept={
                        formData.type === 'image'
                          ? 'image/*'
                          : formData.type === 'video'
                          ? 'video/*'
                          : formData.type === 'audio'
                          ? 'audio/*'
                          : '*'
                      }
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          placeholder="Press Enter to add tags"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="ml-1 inline-flex items-center p-0.5 text-primary-400 hover:text-primary-500"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Credits</label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={creditName}
            onChange={(e) => setCreditName(e.target.value)}
            placeholder="Name"
            className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <input
            type="text"
            value={creditRole}
            onChange={(e) => setCreditRole(e.target.value)}
            placeholder="Role"
            className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={handleCreditAdd}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {formData.credits.map((credit, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div>
                <span className="font-medium">{credit.name}</span>
                <span className="text-gray-500"> - {credit.role}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCreditRemove(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Visibility
        </label>
        <select
          value={formData.visibility}
          onChange={(e) =>
            setFormData({
              ...formData,
              visibility: e.target.value as PortfolioFormData['visibility'],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="unlisted">Unlisted</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PortfolioForm;
