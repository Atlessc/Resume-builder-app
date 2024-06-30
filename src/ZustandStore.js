import { create } from 'zustand';

const useStore = create((set) => ({
  personalInfo: {},
  workExperience: [],
  education: [],
  skills: [],
  customSections: [],

  setPersonalInfo: (info) => set({ personalInfo: info }),

  updatePersonalInfo: (info) => set({ personalInfo: info }),

  addWorkExperience: (experience) => set((state) => ({
    workExperience: [...state.workExperience, experience],
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
    education: [...state.education, education],
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
    skills,
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
    customSections: [...state.customSections, section],
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
