const JobAlert = require('./jobAlertModel');
const User = require('../user/userModel');

exports.createJobAlert = async (req, res) => {
  try {
    const { userId, keywords, location, experience } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const jobAlert = new JobAlert({
      user: userId,
      keywords,
      location,
      experience
    });
    await jobAlert.save();
    res.status(201).json(jobAlert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job alert', error });
  }
};

exports.getJobAlerts = async (req, res) => {
  try {
    const jobAlerts = await JobAlert.find({ user: req.params.userId });
    res.json(jobAlerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job alerts', error });
  }
};

exports.updateJobAlert = async (req, res) => {
  try {
    const { keywords, location, experience } = req.body;
    const jobAlert = await JobAlert.findById(req.params.id);
    if (!jobAlert) {
      return res.status(404).json({ message: 'Job alert not found' });
    }
    jobAlert.keywords = keywords;
    jobAlert.location = location;
    jobAlert.experience = experience;
    await jobAlert.save();
    res.json(jobAlert);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job alert', error });
  }
};

exports.deleteJobAlert = async (req, res) => {
  try {
    const jobAlert = await JobAlert.findById(req.params.id);
    if (!jobAlert) {
      return res.status(404).json({ message: 'Job alert not found' });
    }
    await jobAlert.deleteOne();
    res.json({ message: 'Job alert deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job alert', error });
  }
};