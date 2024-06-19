import React from 'react';

function UserProfile() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">User Profile</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <img src="https://via.placeholder.com/150" alt="Profile" className="img-fluid rounded-circle mb-3" />
              </div>
              <div className="col-md-8">
                <h5>John Doe</h5>
                <p className="text-muted">johndoe@example.com</p>
                <p>
                  <strong>About:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <button type="button" className="btn btn-primary">Update Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;