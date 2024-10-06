import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';

export default class App extends React.Component {
// wrotte a routing rather than it directly being in here for possible future routes
  render () {
      return (

          <Router>
              <Routes>
                  <Route path="/employees" element={<EmployeeList/>} />

                  <Route path="/" element={<Navigate to="/Employees" />} >
                </Route>
            </Routes>
          </Router>
    );
  }
}
