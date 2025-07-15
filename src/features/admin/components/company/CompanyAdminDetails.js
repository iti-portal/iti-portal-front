import React, { useEffect, useState } from "react";
import { 
  Loader2, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  Building2, 
  Users, 
  Calendar, 
  Globe, 
  Mail 
} from "lucide-react";
import { useParams } from "react-router-dom";
function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/companies/${id}`, {
          headers: {
            Authorization: "Bearer 3|VT9TjiUAFmzQCfLVAdWjJUdISFfuUzYvG72Cs0fg6331ba53",
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setCompany(data.data);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-500">Loading selecting company Data...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-gray-500" />
          </div>
          <p className="text-gray-600 font-semibold text-xl">Company not found</p>
          <p className="text-gray-500 mt-2">The requested company could not be located.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'rejected':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (

    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Header Section */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {company.company_name}
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                About Company
              </h2>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                {company.description}
              </p>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Location</span>
                </div>
                <p className="text-gray-900 font-semibold">{company.location}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <Building2 className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Industry</span>
                </div>
                <p className="text-gray-900 font-semibold">{company.industry}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <Users className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Company Size</span>
                </div>
                <p className="text-gray-900 font-semibold">{company.company_size} employees</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Established</span>
                </div>
                <p className="text-gray-900 font-semibold">{formatDate(company.established_at)}</p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <Globe className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Website</span>
                </div>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200 underline"
                  >
                    Visit Website
                  </a>
                ) : (
                  <p className="text-gray-900 font-semibold">Not available</p>
                )}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center mb-3">
                  <Mail className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Contact Email</span>
                </div>
                <p className="text-gray-900 font-semibold">{company.user?.email || 'Not available'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetails;