import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  LightBulbIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const AICareerPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchCareerInsights();
    } else if (activeTab === 'recommendations') {
      fetchJobRecommendations();
    }
  }, [activeTab]);

  const fetchCareerInsights = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setInsights({
        profile: {
          skills: ['JavaScript', 'React', 'Python', 'Django'],
          experience_level: 'mid',
          strengths: ['Problem Solving', 'Team Collaboration', 'Technical Leadership'],
          improvement_areas: ['Public Speaking', 'Data Analysis', 'Cloud Architecture']
        },
        recent_analyses: [
          { id: 1, score: 0.85, created_at: new Date(), suggestions_count: 3 },
          { id: 2, score: 0.78, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), suggestions_count: 5 }
        ],
        top_matches: [
          { job_title: 'Senior Frontend Developer', company: 'TechCorp', match_score: 0.92, created_at: new Date() },
          { job_title: 'Full Stack Engineer', company: 'StartupXYZ', match_score: 0.88, created_at: new Date() }
        ]
      });
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobRecommendations = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      setRecommendations([
        {
          job_id: 1,
          title: 'Senior React Developer',
          company: 'InnovateTech',
          match_score: 0.94,
          reasons: ['Strong React experience', 'Matches your seniority level'],
          skill_gaps: ['TypeScript', 'GraphQL']
        },
        {
          job_id: 2,
          title: 'Full Stack Engineer',
          company: 'GrowthCorp',
          match_score: 0.87,
          reasons: ['Full stack experience', 'Django expertise'],
          skill_gaps: ['AWS', 'Docker']
        }
      ]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);

      // Mock analysis - replace with actual API call
      setTimeout(() => {
        setAnalysis({
          id: Date.now(),
          score: 0.82,
          analysis: {
            skills: ['JavaScript', 'React', 'Python', 'Django', 'SQL'],
            experience_level: 'mid',
            years_experience: 4,
            education: [{ degree: 'Bachelor', field: 'Computer Science' }]
          },
          suggestions: [
            'Add specific achievements with quantifiable results',
            'Include more technical keywords relevant to your target roles',
            'Consider adding a professional summary section'
          ]
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Career Dashboard', icon: ChartBarIcon },
    { id: 'resume', name: 'Resume Analysis', icon: DocumentTextIcon },
    { id: 'recommendations', name: 'Job Matches', icon: BriefcaseIcon },
    { id: 'skills', name: 'Skill Assessment', icon: LightBulbIcon }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <LightBulbIcon className="w-8 h-8 text-blue-200" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Career Intelligence</h1>
            <p className="text-white/70">Unlock your career potential with AI-powered insights</p>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Tabs */}
      <GlassCard className="p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/30 text-blue-200'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <>
          {/* Career Dashboard */}
          {activeTab === 'dashboard' && insights && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Overview */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {insights.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-white/60 text-sm">Experience Level:</p>
                  <p className="text-white font-medium capitalize">{insights.profile.experience_level}</p>
                </div>
              </GlassCard>

              {/* Strengths & Improvements */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Career Insights</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-green-200 font-medium mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {insights.profile.strengths.map((strength, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-center">
                          <StarIcon className="w-4 h-4 text-green-400 mr-2" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-yellow-200 font-medium mb-2">Growth Areas</h4>
                    <ul className="space-y-1">
                      {insights.profile.improvement_areas.map((area, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-center">
                          <LightBulbIcon className="w-4 h-4 text-yellow-400 mr-2" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>

              {/* Recent Analyses */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Analyses</h3>
                <div className="space-y-3">
                  {insights.recent_analyses.map((analysis) => (
                    <div key={analysis.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Resume Analysis</p>
                        <p className="text-white/60 text-sm">
                          {analysis.suggestions_count} suggestions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-200 font-bold">{Math.round(analysis.score * 100)}%</p>
                        <p className="text-white/60 text-xs">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Top Job Matches */}
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Top Job Matches</h3>
                <div className="space-y-3">
                  {insights.top_matches.map((match, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{match.job_title}</p>
                        <p className="text-white/60 text-sm">{match.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-200 font-bold">{Math.round(match.match_score * 100)}%</p>
                        <p className="text-white/60 text-xs">Match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Resume Analysis */}
          {activeTab === 'resume' && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Upload Resume for Analysis</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                    <DocumentTextIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <p className="text-white/70 mb-4">
                      Upload your resume to get AI-powered feedback and suggestions
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload">
                      <GlassButton variant="primary" className="cursor-pointer">
                        Choose File
                      </GlassButton>
                    </label>
                    {resumeFile && (
                      <p className="text-white/60 mt-2">Selected: {resumeFile.name}</p>
                    )}
                  </div>
                  
                  {resumeFile && (
                    <div className="text-center">
                      <GlassButton
                        variant="success"
                        onClick={handleResumeUpload}
                        disabled={loading}
                      >
                        {loading ? 'Analyzing...' : 'Analyze Resume'}
                      </GlassButton>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Analysis Results */}
              {analysis && (
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Analysis Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Overall Score</h4>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-200 mb-2">
                          {Math.round(analysis.score * 100)}%
                        </div>
                        <p className="text-white/60">Resume Quality Score</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Detected Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.analysis.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-white mb-3">Improvement Suggestions</h4>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start text-white/80">
                          <LightBulbIcon className="w-5 h-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* Job Recommendations */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <GlassCard key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{rec.title}</h3>
                      <p className="text-white/70">{rec.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-200">
                        {Math.round(rec.match_score * 100)}%
                      </div>
                      <p className="text-white/60 text-sm">Match Score</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-green-200 font-medium mb-2">Why you're a good fit:</h4>
                      <ul className="space-y-1">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="text-white/80 text-sm flex items-center">
                            <StarIcon className="w-4 h-4 text-green-400 mr-2" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-yellow-200 font-medium mb-2">Skills to develop:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.skill_gaps.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-yellow-500/20 text-yellow-200 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-3">
                    <GlassButton variant="primary">
                      View Job Details
                    </GlassButton>
                    <GlassButton variant="ghost">
                      Save for Later
                    </GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Skill Assessment */}
          {activeTab === 'skills' && (
            <GlassCard className="p-6 text-center">
              <LightBulbIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-4">Skill Assessments</h3>
              <p className="text-white/70 mb-6">
                Take AI-powered skill assessments to validate your expertise and identify growth opportunities.
              </p>
              <GlassButton variant="primary" size="lg">
                Coming Soon
              </GlassButton>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
};

export default AICareerPage;