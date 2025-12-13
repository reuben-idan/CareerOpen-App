import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaRegHeart,
  FaArrowAltCircleRight,
} from "react-icons/fa";
import JobCard from "../components/jobs/JobCard";
import Sidebar from "../components/layout/Sidebar";

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <JobCard job={job} onApply={handleApply} />
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
