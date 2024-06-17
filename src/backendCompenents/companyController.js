const Company = require('./companyModel');

exports.createCompany = async (req, res) => {
  try {
    const { name, description, website, industry } = req.body;
    const company = new Company({
      name,
      description,
      website,
      industry
    });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error creating company', error });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company', error });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { name, description, website, industry } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    company.name = name;
    company.description = description;
    company.website = website;
    company.industry = industry;
    await company.save();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Error updating company', error });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    await company.deleteOne();
    res.json({ message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting company', error });
  }
};