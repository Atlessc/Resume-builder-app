import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import ResumeForm from './components/ResumeForm/ResumeForm';
import Editor from './components/Editor/Editor';
import NavBar from './components/Global/NavBar/NavBar';
import Footer from './components/Global/Footer/Footer';
import useStore from './ZustandStore';
import { loadStateFromLocalStorage } from './helper/LoadStateFromLocalStorage';
import { saveStateToLocalStorage } from './helper/SaveStateToLocalStorage';


function App() {
  const setPersonalInfo = useStore((state) => state.setPersonalInfo);
  const addWorkExperience = useStore((state) => state.addWorkExperience);
  const addEducation = useStore((state) => state.addEducation);
  const addSkills = useStore((state) => state.addSkills);
  const addCustomSection = useStore((state) => state.addCustomSection);

  useEffect(() => {
    const initialState = loadStateFromLocalStorage();
    if (initialState.personalInfo) setPersonalInfo(initialState.personalInfo);
    if (initialState.workExperience) initialState.workExperience.forEach(addWorkExperience);
    if (initialState.education) initialState.education.forEach(addEducation);
    if (initialState.skills) addSkills(initialState.skills);
    if (initialState.customSections) initialState.customSections.forEach(addCustomSection);
  }, [setPersonalInfo, addWorkExperience, addEducation, addSkills, addCustomSection]);

  // useEffect(() => {
  //   const unsubscribe = useStore.subscribe(
  //     (state) => {
  //       saveStateToLocalStorage(state);
  //     },
  //     (state) => state
  //   );
  //   return () => unsubscribe();
  // }, []);

  return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resume-form" element={<ResumeForm />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
        <Footer />
      </div>
  );
}

export default App;
