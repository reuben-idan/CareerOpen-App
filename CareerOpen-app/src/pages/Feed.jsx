import "react";
// import NavigationBar from "../components/NavigationBar";
import Sidebar from "../components/Sidebar";
import FeedPost from "../components/FeedPost";
import JobCard from "../components/JobCard";

const FeedPage = () => {
  const feedPosts = [
    {
      user: {
        name: "John Doe",
        profilePicture: "/path/to/profile.jpg",
      },
      timestamp: "2 hours ago",
      content: "Looking for new opportunities in web development!",
    },
    {
      user: {
        name: "Jane Smith",
        profilePicture: "/path/to/profile2.jpg",
      },
      timestamp: "3 hours ago",
      content: "Excited about the latest JavaScript framework release!",
    },
  ];

  const jobListings = [
    {
      title: "Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
    },
    {
      title: "Backend Developer",
      company: "DevWorks",
      location: "Remote",
    },
  ];

  return (
    // <div className="bg-gray-100 min-h-screen">
    //   <NavigationBar />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-6 px-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>

        {/* Feed Section */}
        <main className="lg:col-span-2">
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Feed</h2>
            {feedPosts.map((post, index) => (
              <FeedPost key={index} post={post} />
            ))}
          </section>
        </main>

        {/* Job Listings */}
        <aside className="lg:col-span-1">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Job Listings</h2>
            {jobListings.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </section>
        </aside>
      </div>
    
  );
};

export default FeedPage;
