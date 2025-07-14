import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,
  MapPin,
  Globe,
  Users,
  CalendarDays,
  Loader2,
  Bookmark,
  BadgeCheck,
  Search,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/companies`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }
        
        const result = await response.json();
        
        if (result.success) {
          setCompanies(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || 
                          company.industry?.toLowerCase() === filterIndustry.toLowerCase();
    return matchesSearch && matchesIndustry;
  });

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);
  const industries = [...new Set(companies.map(company => company.industry).filter(Boolean))];

  const loadMoreCompanies = () => {
    setVisibleCount(prevCount => prevCount + 5);
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh]"
    >
      <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
      <p className="text-gray-600 text-lg font-medium">Loading companies...</p>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh]"
    >
      <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      <motion.button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Retry
      </motion.button>
    </motion.div>
  );
  
  if (companies.length === 0) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh]"
    >
      <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
      <p className="text-gray-600 text-lg font-medium">No companies found</p>
      <p className="text-gray-500">Try again later or check your connection</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 w-full max-w-7xl mx-auto"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center">
          <Building2 className="mr-3 w-10 h-10 text-red-600" />
          Companies Directory
        </h1>
      </motion.div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
          >
            <option value="all">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {filteredCompanies.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[30vh] bg-gray-50 rounded-xl p-8"
        >
          <Bookmark className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No matches found</h3>
          <p className="text-gray-500 text-center max-w-md">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CompanyCard company={company} />
              </motion.div>
            ))}
          </motion.div>

          {visibleCount < filteredCompanies.length && (
            <motion.div 
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={loadMoreCompanies}
                className="px-6 py-3 bg-red-700   border-red-600 text-red-600 rounded-lg hover:bg-red-800 text-white transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Load More
                <ChevronRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();
  const establishedYear = new Date(company.established_at).getFullYear();
  const yearsInBusiness = new Date().getFullYear() - establishedYear;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
    >
      <div className="relative h-40 bg-gradient-to-r from-red-50 to-gray-50 flex items-center justify-center">
        <img 
          src='https://png.pngtree.com/png-vector/20220825/ourmid/pngtree-creative-logo-design-vector-free-png-png-image_6123042.png' 
          alt={company.company_name}
          className="h-full w-full object-contain p-4"
        />

      </div>

      <div className="p-6 flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-red-700 transition-colors">
            {company.company_name}
          </h3>
          <div className="flex items-center mt-1 text-gray-500">
            <span className="text-sm text-gray-600">{company.industry || 'Not specified'}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
          {company.description || 'No description provided'}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700 truncate">
              {company.location || 'Location not specified'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">
                {company.company_size || 'Size not specified'}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <CalendarDays className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">
                {yearsInBusiness} {yearsInBusiness === 1 ? 'year' : 'years'}
              </span>
            </div>
          </div>
          
          {company.website && (
            <div className="flex items-center text-sm">
              <Globe className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <a 
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        <motion.button
          onClick={() => navigate(`/companies/${company.id}`)} 
          className='w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group-hover:shadow-lg'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Company Profile
          <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CompaniesList;