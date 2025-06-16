import React from 'react';

const AdminFooter = () => (
  <footer className="w-full bg-[#223843] rounded-b-xl mt-8 py-8 px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
    <div>
      <h2 className="text-2xl font-semibold text-white mb-1">Looking for something more?</h2>
      <p className="text-gray-200 text-base">
        Subscribe to our newsletter for exclusive insights and updates.
      </p>
    </div>
    <form className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
      <input
        type="email"
        placeholder="Your email address"
        className="px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#901b20] w-full md:w-64"
      />
      <button
        type="submit"
        className="bg-[#901b20] text-white px-5 py-2 rounded font-semibold hover:bg-[#a83236] transition"
      >
        Subscribe
      </button>
    </form>
  </footer>
);

export default AdminFooter;