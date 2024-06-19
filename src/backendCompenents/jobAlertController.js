// jobController.js
const Job = require('./jobModel');

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createJob = async (req, res) => {
  const job = new Job({
    title: req.body.title,
    description: req.body.description,
    salary: req.body.salary,
    location: req.body.location,
    company: req.body.company,
    postedBy: req.body.postedBy
  });

  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.title = req.body.title || job.title;
    job.description = req.body.description || job.description;
    job.salary = req.body.salary || job.salary;
    job.location = req.body.location || job.location;
    job.company = req.body.company || job.company;
    job.postedBy = req.body.postedBy || job.postedBy;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await job.remove();
    res.status(200).json({ message: 'Job deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};