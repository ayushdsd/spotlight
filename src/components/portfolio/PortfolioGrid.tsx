import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FiEdit2, FiTrash2, FiStar, FiEye } from 'react-icons/fi';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'link';
  mediaUrl: string;
  thumbnailUrl?: string;
  featured: boolean;
  stats: {
    views: number;
    likes: number;
  };
  visibility: 'public' | 'private' | 'unlisted';
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  onOrderChange?: (items: { id: string; order: number }[]) => void;
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (item: PortfolioItem) => void;
  onToggleFeatured?: (item: PortfolioItem) => void;
  isEditable?: boolean;
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  items,
  onOrderChange,
  onEdit,
  onDelete,
  onToggleFeatured,
  isEditable = false,
}) => {
  const [gridItems, setGridItems] = useState(items);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onOrderChange) return;

    const reorderedItems = Array.from(gridItems);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setGridItems(reorderedItems);
    onOrderChange(
      reorderedItems.map((item, index) => ({
        id: item._id,
        order: index,
      }))
    );
  };

  const renderMediaPreview = (item: PortfolioItem) => {
    switch (item.type) {
      case 'image':
        return (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        );
      case 'video':
        return (
          <div className="relative h-48">
            <img
              src={item.thumbnailUrl || item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
              </div>
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
            <div className="text-4xl text-gray-400">🎵</div>
          </div>
        );
      default:
        return (
          <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
            <div className="text-4xl text-gray-400">📄</div>
          </div>
        );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="portfolio" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gridItems.map((item, index) => (
              <Draggable
                key={item._id}
                draggableId={item._id}
                index={index}
                isDragDisabled={!isEditable}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {renderMediaPreview(item)}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        {isEditable && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onToggleFeatured?.(item)}
                              className={`p-1 rounded-full ${
                                item.featured
                                  ? 'text-yellow-500 hover:text-yellow-600'
                                  : 'text-gray-400 hover:text-gray-500'
                              }`}
                            >
                              <FiStar className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onEdit?.(item)}
                              className="p-1 text-gray-400 hover:text-gray-500 rounded-full"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => onDelete?.(item)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiEye className="w-4 h-4 mr-1" />
                          {item.stats.views}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PortfolioGrid;
