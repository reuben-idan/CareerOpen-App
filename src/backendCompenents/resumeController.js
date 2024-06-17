const Resume = require('./resumeModel');

exports.createResume = async (req, res) => {
  try {
    const { name, education, experience, skills } = req.body;
    const resume = new Resume({
      name,
      education,
      experience,
      skills,
      user: req.user.userId
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error creating resume', error });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resumes', error });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { name, education, experience, skills } = req.body;
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    resume.name = name;
    resume.education = education;
    resume.experience = experience;
    resume.skills = skills;
    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resume', error });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    if (resume.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume', error });
  }
};