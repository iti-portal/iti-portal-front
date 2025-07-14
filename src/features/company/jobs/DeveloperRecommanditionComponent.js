import { motion } from 'framer-motion';

import { getAllDevelopers, getTopDevelopersForJob } from './RecommandItians';
import { useState, useEffect } from 'react';
import {
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  ChevronRight,
  BadgeCheck,
  Check,
  X,
  Star,
  Frown,
  Search
} from 'lucide-react';

const DeveloperRecommendations = ({ jobId, jobData }) => {
  const [developers, setDevelopers] = useState([]);
  const [recommendedDevs, setRecommendedDevs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState('');
 const [visibleCount, setVisibleCount] = useState(3);

const [allRecommendedDevs, setAllRecommendedDevs] = useState([]);
const [visibleDevs, setVisibleDevs] = useState([]);


useEffect(() => {
  setAllRecommendedDevs(recommendedDevs); 
  setVisibleDevs(recommendedDevs.slice(0, visibleCount));
}, [recommendedDevs]);

const HandleCardNumbers = () => {
  const newCount = visibleCount + 3;
  setVisibleCount(newCount);
  setVisibleDevs(allRecommendedDevs.slice(0, newCount));
};

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        if (jobData.status == 'closed') {
          setLoading(false);
          setAnalysis('This job is not active');
          return;
        }

        setLoading(true);
        setError(null);
        setAnalysis('');

        const devsResponse = await getAllDevelopers();
        if (!devsResponse.success) {
          throw new Error(devsResponse.message || 'Failed to fetch developers');
        }

        const allDevelopers = devsResponse.data || [];
        setDevelopers(allDevelopers);

        if (allDevelopers.length === 0) {
          setLoading(false);
          setAnalysis('No developer profiles available in the system');
          return;
        }

        const token = localStorage.getItem('token');
        console.log("Job ID:", jobId);
        console.log("All developers:", allDevelopers.length);
        console.log("Token:", token);

        // const rawResponse = await getTopDevelopersForJob(jobId, allDevelopers, token);
        // console.log("Raw response:", rawResponse);
        
        const recommendations = await getTopDevelopersForJob(
          jobId,
          allDevelopers,
          token
        );
        console.log('Recommendations:', recommendations);

        setRecommendedDevs(recommendations || []);
        
        if (recommendations.length === 0) {
          setAnalysis('No developers meet the minimum requirements for this position');
        }
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err.message || 'An unknown error occurred while fetching recommendations');
        setRecommendedDevs([]);
        
        if (err.message.includes('No developers meet')) {
          setAnalysis(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    if (jobId && jobData) {
      fetchData();
    } else {
      setLoading(false);
      setError('Missing job ID or job data');
    }
  }, [jobId, jobData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
        <p className="text-gray-600">Analyzing Best developers for this job...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Recommendation Analysis Failed</h3>
            <p className="text-sm text-red-700 mb-2">{error}</p>
            {analysis && (
              <div className="bg-white p-3 rounded border border-red-100">
                <p className="text-sm text-gray-700">{analysis}</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    );
  }



  if (recommendedDevs.length === 0 && jobData?.status == 'active') {
    return (
      <div className='text-center text-lg text-red-800'>no recommaditions found for this job</div>
    );
  }

  return (
   <div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {visibleDevs.map((dev) => (
      <DeveloperCard key={dev.id} developer={dev} />
    ))}
  </div>
  {visibleDevs.length < allRecommendedDevs.length && (
    <div className="text-center mt-6 mx-auto w-96">
      <button
        onClick={HandleCardNumbers}
        className=" bg-red-700 px-20 py-3 mt-5  text-white rounded-full hover:bg-red-800"
      >
        Show More
      </button>
    </div>
  )}
</div>

  );
};

const DeveloperCard = ({ developer }) => {
  const dev = developer;
  const matchingDetails = dev.matching_details || {};


  return (

     <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-all flex flex-col h-full">

      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 rounded-full w-10 h-10 flex items-center justify-center text-red-600">
            {dev.profile?.profile_picture ? (
              <img
                src={`${process.env.REACT_APP_API_ASSET_URL}/${dev.profile.profile_picture}`}
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {dev.profile?.first_name?.charAt(0) || ''}
                {dev.profile?.last_name?.charAt(0) || ''}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {dev.profile?.first_name} {dev.profile?.last_name}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {dev.profile?.track}
             
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-grow">
        <div className="space-y-3 mb-3">
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600 truncate">{dev.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-gray-600">
              {dev.profile?.phone || 'Not provided'}
            </span>
          </div>
        </div>

        {matchingDetails.reason && (
          <div className="mb-4 bg-gray-50 p-3 rounded">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Match Reason</h4>
            <p className="text-sm text-gray-700">{matchingDetails.reason}</p>
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            SKILLS MATCH 
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600">Required:</span>
              <div className="flex flex-wrap gap-1">
                {matchingDetails.matched_skills?.length > 0 ? (
                  matchingDetails.matched_skills.map((skill, i) => (
                    <span
                      key={`req-${i}`}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full flex items-center"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">None matched</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-0">
          <div className="bg-gray-50 p-2 rounded">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Education</h4>
            <p className='text-sm text-gray-500'>ITI {dev.profile.program} Program {dev.profile.intake}</p>
      
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Track</h4>
            <div className="flex items-center">
              {matchingDetails.track_relevance === 'perfect' ? (
                <>
                  <Check className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-700">Perfect fit</span>
                </>
              ) : matchingDetails.track_relevance === 'related' ? (
                <>
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-700">Related</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-700">Unrelated</span>
                </>
              )}
            </div>
          </div>
        </div>

        {matchingDetails.strengths?.length > 0 && (
          <div className="mb-2">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Strengths</h4>
            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
              {matchingDetails.strengths.map((strength, i) => (
                <li key={`strength-${i}`}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg mt-auto">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-md text-sm font-medium transition-colors">
          <span>View Full Profile</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>


    </div>
  
    
   
    
 
  );
};

export default DeveloperRecommendations;