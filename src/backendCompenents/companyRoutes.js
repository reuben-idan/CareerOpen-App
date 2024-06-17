const express = require('express');
const companyController = require('./companyController');
const adminMiddleware = require('../auth/adminMiddleware');

const router = express.Router();

// Create a new company
router.post('/', adminMiddleware.authenticate, companyController.createCompany);

// Get all companies
router.get('/', companyController.getCompanies);

// Get a single company
router.get('/:id', companyController.getCompanyById);

// Update a company
router.put('/:id', adminMiddleware.authenticate, companyController.updateCompany);

// Delete a company
router.delete('/:id', adminMiddleware.authenticate, companyController.deleteCompany);

module.exports = router;