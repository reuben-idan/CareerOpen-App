import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaBriefcase, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const JobList = () => {
  const [jobs, setJobs] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Fetch job listings from the API
    axios
      .get("/api/jobs")
      .then((response) => {
        // Ensure the response is an array before setting state
        if (Array.isArray(response.data)) {
          setJobs(response.data);
        } else {
          console.error("Expected an array of jobs, but got:", response.data);
          setJobs([]); // Set an empty array in case of unexpected response format
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs", error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="border-b pb-4">
                <Link to={`/job/${job.id}`} className="block">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FaBriefcase />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FaMapMarkerAlt />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
