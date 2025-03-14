import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Course from './pages/Course';
import Material from './pages/Material';
import Assessment from './pages/Assessment';
import Assignment from './pages/Assignment';
import User from './pages/User';
import CourseDetail from './pages/CourseDetail';
import UserCourse from './pages/UserCourse';
import Testing from './pages/Testing';
import EditQuestion from './pages/EditQuestion';
import Badge from './pages/Badge';
import Login from './pages/Login';
import Trade from './pages/Trade';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/course" /> : <Login />}
      />

      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <DefaultLayout>
              <Routes>
                <Route
                  index
                  element={
                    <>
                      <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <ECommerce />
                    </>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <>
                      <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Calendar />
                    </>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <>
                      <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Profile />
                    </>
                  }
                />
                <Route
                  path="/forms/form-elements"
                  element={
                    <>
                      <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <FormElements />
                    </>
                  }
                />
                <Route
                  path="/forms/form-layout"
                  element={
                    <>
                      <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <FormLayout />
                    </>
                  }
                />
                <Route
                  path="/tables"
                  element={
                    <>
                      <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Tables />
                    </>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <>
                      <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Settings />
                    </>
                  }
                />
                <Route
                  path="/chart"
                  element={
                    <>
                      <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Chart />
                    </>
                  }
                />
                <Route
                  path="/ui/alerts"
                  element={
                    <>
                      <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Alerts />
                    </>
                  }
                />
                <Route
                  path="/ui/buttons"
                  element={
                    <>
                      <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <Buttons />
                    </>
                  }
                />
                <Route
                  path="/auth/signin"
                  element={
                    <>
                      <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <SignIn />
                    </>
                  }
                />
                <Route
                  path="/auth/signup"
                  element={
                    <>
                      <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                      <SignUp />
                    </>
                  }
                />
                <Route
                  path="/course"
                  element={
                    <>
                      <PageTitle title="Course" />
                      <Course />
                    </>
                  }
                />
                <Route
                  path="/course/:id"
                  element={
                    <>
                      <PageTitle title="Edit Course (testing)" />
                      <CourseDetail />
                    </>
                  }
                />
                <Route
                  path="/Badge"
                  element={
                    <>
                      <PageTitle title="Chapter" />
                      <Badge />
                    </>
                  }
                />
                <Route
                  path="/material/:id"
                  element={
                    <>
                      <PageTitle title="Material" />
                      <Material />
                    </>
                  }
                />
                <Route
                  path="/assessment/:id"
                  element={
                    <>
                      <PageTitle title="Assessment" />
                      <Assessment />
                    </>
                  }
                />
                <Route
                  path="/assignment/:id"
                  element={
                    <>
                      <PageTitle title="Assignment" />
                      <Assignment />
                    </>
                  }
                />
                <Route
                  path="/user"
                  element={
                    <>
                      <PageTitle title="User" />
                      <User />
                    </>
                  }
                />
                <Route
                  path="/usercourse/:id"
                  element={
                    <>
                      <PageTitle title="User Course" />
                      <UserCourse />
                    </>
                  }
                />

                <Route
                  path="/testing"
                  element={
                    <>
                      <PageTitle title="testing" />
                      <Testing />
                    </>
                  }
                />
                <Route
                  path="/edit-question/:id/:index"
                  element={
                    <>
                      <PageTitle title="Edit Question" />
                      <EditQuestion />
                    </>
                  }
                />
                <Route
                  path="/trade"
                  element={
                    <>
                      <PageTitle title="Trades" />
                      <Trade />
                    </>
                  }
                />
              </Routes>
            </DefaultLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
