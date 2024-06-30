import React from 'react';
import ProfileHeader from './ProfileHeader';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import CertificationsSection from './CertificationsSection';
import ProjectsSection from './ProjectsSection';
import ResumeSection from './ResumeSection';
import PortfolioSection from './PortfolioSection';
import SocialSection from './SocialSection';
import ActionSection from './ActionSection';

const ProfilePreview = ({ profileData }) => {
  return (
    <div className="profile-preview">
      <ProfileHeader
        profileData={profileData}
        profilePicture={profileData.profilePicture}
        backgroundPicture={profileData.backgroundPicture}
      />
      <SkillsSection skills={profileData.skills} />
      <EducationSection education={profileData.education} />
      <ExperienceSection experience={profileData.experience} />
      <CertificationsSection certifications={profileData.certifications} />
      <ProjectsSection projects={profileData.projects} />
      <ResumeSection resumeUrl={profileData.resumeUrl} />
      <PortfolioSection portfolio={profileData.portfolio} />
      <SocialSection socialLinks={profileData.socialLinks} />
      <ActionSection actions={profileData.actions} />
    </div>
  );
};

export default ProfilePreview;