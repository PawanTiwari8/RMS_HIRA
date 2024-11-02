import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "./Store/store";
import Dashboard from "./Components/Dashboard";
import AddProjectModal from "./Components/AddProjectModal";

function App() {



  return (
    <Provider store={store}>
      <div className="App">
        <div className="text-center text-3xl mb-4">Revenue Management System</div>
        <Dashboard />
      </div>
    </Provider>
  );
}

export default App;



