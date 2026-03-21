import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { DefaultLayout } from "./components/Layouts";
import {  publicRoutes, kitchenRoutes, cashierRoutes, managerRoutes } from "./routers";

function App() {
  const user = JSON.parse(sessionStorage.getItem('user')) || '';
  if (!user) {
    return (
      <Router>
        <div className="App">
          <Routes>
            {
              publicRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                }
                else if (route.layout === null) {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                )
              })
            }
          </Routes>
        </div>
      </Router>
    )
  }
  else if (user.role == "MANAGER") {
    return (
      <Router>
        <div className="App">
          <Routes>
            {
              managerRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                }
                else if (route.layout === null) {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                )
              })
            }
          </Routes>
        </div>
      </Router>
    )
  }

  else if (user.role == "CASHIER") {
    return (
      <Router>
        <div className="App">
          <Routes>
            {
              cashierRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                }
                else if (route.layout === null) {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                )
              })
            }
          </Routes>
        </div>
      </Router>
    )
  }
  else if (user.role == "KITCHEN") {
    return (
      <Router>
        <div className="App">
          <Routes>
            {
              kitchenRoutes.map((route, index) => {
                const Page = route.component;
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                }
                else if (route.layout === null) {
                  Layout = Fragment;
                }

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
                )
              })
            }
          </Routes>
        </div>
      </Router>
    )
  }
}

export default App;

