import React, { useState } from 'react';
import { createArticle } from '../../../../services/articlesApi';
import { toast } from 'react-toastify';

const NewArticleForm = ({ onCancel, onCreate }) => {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    external_link: '',
    status: 'published',
    featured_image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setArticle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    setArticle((prev) => ({
      ...prev,
      featured_image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit triggered ✅');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', article.title);
    formData.append('content', article.content);
    formData.append('external_link', article.external_link);
    formData.append('status', article.status.toLowerCase()); // normalized
    if (article.featured_image) {
      formData.append('featured_image', article.featured_image);
    }

    const entries = [...formData.entries()];
    console.log('FormData:', entries); // DEBUG

    try {
      const res = await createArticle(formData);
      console.log('API response ✅:', res);

      const createdArticle = res.data.data;
      toast.success('Article created successfully!');
      onCreate(createdArticle); // 👈 go back to article list
    } catch (error) {
      console.error('Create Article Error ❌:', error);
      toast.error(error.response?.data?.message || 'Failed to create article.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">+ New Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={article.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />

        <textarea
          placeholder="Content"
          className="w-full border p-2 rounded"
          rows={10}
          value={article.content}
          onChange={(e) => handleChange('content', e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="External Link (optional)"
          className="w-full border p-2 rounded"
          value={article.external_link}
          onChange={(e) => handleChange('external_link', e.target.value)}
        />

        <select
          className="w-full border p-2 rounded"
          value={article.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="w-full"
          onChange={handleFileChange}
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#901b20] text-white px-4 py-2 rounded"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewArticleForm;
