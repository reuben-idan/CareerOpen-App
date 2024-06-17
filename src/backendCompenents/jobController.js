const Job = require('./jobModel');

exports.createJob = async (req, res) => {
  try {
    const { title, description, salary, company } = req.body;
    const job = new Job({
      title,
      description,
      salary,
      company,
      createdBy: req.user.userId
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('createdBy', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, description, salary, company } = req.body;
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    job.title = title;
    job.description = description;
    job.salary = salary;
    job.company = company;
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
};