import { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "../components/Sidebar"; // Sidebar Component Import

const ProfilePage = ({ user }) => {
  const [userData, setUserData] = useState(
    user || {
      name: "John Doe",
      headline: "Web Developer",
      location: "New York, NY",
      profilePicture: "/default-profile-pic.jpg",
      backgroundImage: "/default-background.jpg",
      experiences: [],
      education: [],
      skills: [],
      recommendations: [],
      activities: [],
    }
  );
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [editingSection, setEditingSection] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMessage(""); // Reset error message on save attempt

    try {
      // Simulate an API call for saving the profile data
      setTimeout(() => {
        setIsLoading(false);
        alert("Profile updated successfully!");
        setEditModalOpen(false);
      }, 1000);
    } catch {
      setIsLoading(false);
      setErrorMessage("An error occurred while saving the profile.");
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <header
        className="bg-cover bg-center h-64 relative"
        style={{ backgroundImage: `url(${userData.backgroundImage})` }}
      >
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="rounded-full w-32 h-32 border-4 border-white absolute bottom-[-20px] left-4"
            style={{ transform: "translateY(50%)" }}
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "backgroundImage")}
          className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-md"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "profilePicture")}
          className="absolute top-2 left-2 bg-blue-500 text-white p-2 rounded-md"
        />
      </header>

      {/* Main Content and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-6 px-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white shadow-lg rounded-lg p-6 space-y-6">
          <Sidebar user={userData} />
        </aside>

        {/* Profile Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* About Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">About</h2>
              <button
                onClick={() => handleEditSection("about")}
                className="text-blue-500"
              >
                Edit
              </button>
            </div>
            <textarea
              name="headline"
              value={userData.headline}
              onChange={handleChange}
              placeholder="Add your headline here..."
              className="w-full h-24 p-4 border border-gray-300 rounded-md"
              disabled={editingSection !== "about"}
            />
          </section>

          {/* Experience Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Experience
              </h2>
              <button
                onClick={() => handleEditSection("experience")}
                className="text-blue-500"
              >
                Edit
              </button>
            </div>
            <ul className="space-y-4">
              {userData.experiences.length > 0 ? (
                userData.experiences.map((experience, index) => (
                  <li key={index} className="flex flex-col space-y-2">
                    <h3 className="font-semibold">
                      {experience.position} at {experience.company}
                    </h3>
                    <textarea
                      name="experienceDetails"
                      value={experience.details || ""}
                      onChange={(e) => handleChange(e)}
                      placeholder="Experience details..."
                      className="w-full h-24 p-4 border border-gray-300 rounded-md"
                      disabled={editingSection !== "experience"}
                    />
                    <p className="text-gray-600">{experience.duration}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No experience available.</p>
              )}
            </ul>
          </section>

          {/* Education Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Education
              </h2>
              <button
                onClick={() => handleEditSection("education")}
                className="text-blue-500"
              >
                Edit
              </button>
            </div>
            <ul className="space-y-4">
              {userData.education.length > 0 ? (
                userData.education.map((edu, index) => (
                  <li key={index} className="flex flex-col space-y-2">
                    <h3 className="font-semibold">
                      {edu.degree} at {edu.institution}
                    </h3>
                    <textarea
                      name="educationDetails"
                      value={edu.details || ""}
                      onChange={handleChange}
                      placeholder="Education details..."
                      className="w-full h-24 p-4 border border-gray-300 rounded-md"
                      disabled={editingSection !== "education"}
                    />
                    <p className="text-gray-600">{edu.duration}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No education history available.</p>
              )}
            </ul>
          </section>

          {/* Skills Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Skills & Endorsements
              </h2>
              <button
                onClick={() => handleEditSection("skills")}
                className="text-blue-500"
              >
                Edit
              </button>
            </div>
            <ul className="space-y-4">
              {userData.skills.length > 0 ? (
                userData.skills.map((skill, index) => (
                  <li key={index} className="flex flex-col space-y-2">
                    <textarea
                      name="skills"
                      value={skill.name || ""}
                      onChange={handleChange}
                      placeholder="Add a skill..."
                      className="w-full h-16 p-4 border border-gray-300 rounded-md"
                      disabled={editingSection !== "skills"}
                    />
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No skills listed.</p>
              )}
            </ul>
          </section>
        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Edit Profile
            </h2>
            {errorMessage && (
              <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
            )}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="headline"
                  className="block text-sm font-medium text-gray-700"
                >
                  Headline
                </label>
                <input
                  type="text"
                  id="headline"
                  name="headline"
                  value={userData.headline}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setEditModalOpen(true)}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
    backgroundImage: PropTypes.string,
    experiences: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        position: PropTypes.string.isRequired,
        company: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
      })
    ).isRequired,
    education: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        degree: PropTypes.string.isRequired,
        institution: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
      })
    ).isRequired,
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    recommendations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        recommender: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
      })
    ).isRequired,
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        timestamp: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ProfilePage;
