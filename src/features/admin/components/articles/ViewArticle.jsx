import React from 'react';
import { ChevronLeft, Edit } from 'lucide-react';

const ViewArticle = ({ article, onBack, onEdit }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-700">
          <ChevronLeft size={18} /> Back
        </button>
        <button onClick={() => onEdit(article)} className="bg-blue-600 text-white px-4 py-2 rounded">
          <Edit size={16} className="inline-block mr-1" />
          Edit
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">By {article.author?.email} • {new Date(article.published_at).toLocaleDateString()}</p>
      <div className="prose">{article.content}</div>
      {article.external_link && (
        <a href={article.external_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-4 block">
          External Link
        </a>
      )}
    </div>
  );
};

export default ViewArticle;
