const Application = require('./applicationModel');
const Job = require('../job/jobModel');

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const application = new Application({
      job: jobId,
      user: req.user.userId,
      status: 'Pending'
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error applying for job', error });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.userId }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application', error });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error });
  }
};