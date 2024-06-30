/**
 * Saves state to localStorage
 * @param {Object} state - The state to save
 */
export const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('resume-storage', serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};
