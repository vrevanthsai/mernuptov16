import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";

const UserProfile = () => {
  return (
    <Layout title={"Your Profile - ChocoStore"}>
      <div className="container-fluid  p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>Profile</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
