const User = require('../user/userModel');
const JobAlert = require('../jobAlert/jobAlertModel');
const Application = require('../application/applicationModel');
const Order = require('../payment/orderModel');

exports.getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobAlerts = await JobAlert.find({ user: userId }).count();
    const applications = await Application.find({ user: userId }).count();
    const orders = await Order.find({ user: userId }).count();

    res.json({
      jobAlerts,
      applications,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};

exports.getApplicationAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ user: userId });
    const analytics = {
      totalApplications: applications.length,
      applicationsByStatus: {
        pending: applications.filter(app => app.status === 'pending').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        accepted: applications.filter(app => app.status === 'accepted').length
      },
      applicationsByCompany: applications.reduce((acc, app) => {
        if (acc[app.company]) {
          acc[app.company]++;
        } else {
          acc[app.company] = 1;
        }
        return acc;
      }, {})
    };
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application analytics', error });
  }
};

// Other analytics-related controller functions...