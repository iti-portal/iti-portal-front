import React, { useState } from 'react';
import { updateArticle } from '../../../../services/articlesApi';
import { toast } from 'react-toastify';

const EditArticleForm = ({ article, onBack, onSave }) => {
  const [formData, setFormData] = useState({
    title: article.title,
    content: article.content,
    external_link: article.external_link || '',
    status: article.status
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateArticle(article.id, formData);
      onSave(res.data.data);
      toast.success('Article updated!');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border" required />
      <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="w-full p-2 border" required />
      <input name="external_link" value={formData.external_link} onChange={handleChange} placeholder="External link" className="w-full p-2 border" />
      <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </select>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onBack} className="px-4 py-2 bg-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white">Save</button>
      </div>
    </form>
  );
};

export default EditArticleForm;
