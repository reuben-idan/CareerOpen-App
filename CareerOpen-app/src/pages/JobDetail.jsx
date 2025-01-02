import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaRegHeart,
  FaArrowAltCircleRight,
} from "react-icons/fa";

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null); // Initial state set to null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch job detail from API using jobId
    axios
      .get(`/api/jobs/${jobId}`)
      .then((response) => {
        if (response.data && typeof response.data === "object") {
          setJob(response.data); // Ensure that the response is an object
        } else {
          console.error("Expected a job object, but got:", response.data);
          setJob(null); // Set to null if data is unexpected
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching job details", error);
        setLoading(false);
      });
  }, [jobId]);

  const handleApply = () => {
    alert("Application submitted!");
  };

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold">{job.title}</h2>
        <div className="flex items-center space-x-2 text-lg text-gray-700 mt-2">
          <FaBriefcase />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <FaMapMarkerAlt />
          <span>{job.location}</span>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Job Description</h3>
          <p className="text-gray-600 mt-2">{job.description}</p>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-200"
          >
            <FaArrowAltCircleRight />
            <span>Apply Now</span>
          </button>
          <button className="text-gray-500 flex items-center space-x-2">
            <FaRegHeart />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
