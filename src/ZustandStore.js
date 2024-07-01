import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useStore = create((set) => ({
  personalInfo: {},
  workExperience: [],
  education: [],
  skills: [],
  customSections: [],

  setPersonalInfo: (info) => set({ personalInfo: info }),

  updatePersonalInfo: (info) => set({ personalInfo: info }),

  addWorkExperience: (experience) => set((state) => ({
    workExperience: [...state.workExperience, { ...experience, id: uuidv4() }],
  })),

  updateWorkExperience: (index, experience) => set((state) => {
    const updatedWorkExperience = [...state.workExperience];
    updatedWorkExperience[index] = experience;
    return { workExperience: updatedWorkExperience };
  }),

  deleteWorkExperience: (index) => set((state) => ({
    workExperience: state.workExperience.filter((_, i) => i !== index),
  })),

  addEducation: (education) => set((state) => ({
    education: [...state.education, { ...education, id: uuidv4() }],
  })),

  updateEducation: (index, education) => set((state) => {
    const updatedEducation = [...state.education];
    updatedEducation[index] = education;
    return { education: updatedEducation };
  }),

  deleteEducation: (index) => set((state) => ({
    education: state.education.filter((_, i) => i !== index),
  })),

  addSkills: (skills) => set((state) => ({
    skills: skills.map(skill => ({ ...skill, id: uuidv4() })),
  })),

  updateSkill: (index, skill) => set((state) => {
    const updatedSkills = [...state.skills];
    updatedSkills[index] = skill;
    return { skills: updatedSkills };
  }),

  deleteSkill: (index) => set((state) => ({
    skills: state.skills.filter((_, i) => i !== index),
  })),

  addCustomSection: (section) => set((state) => ({
    customSections: [...state.customSections, { ...section, id: uuidv4() }],
  })),

  updateCustomSectionEntry: (index, entry) => set((state) => {
    const updatedCustomSections = [...state.customSections];
    updatedCustomSections[index] = entry;
    return { customSections: updatedCustomSections };
  }),

  deleteCustomSection: (index) => set((state) => ({
    customSections: state.customSections.filter((_, i) => i !== index),
  })),
}));

export default useStore;
