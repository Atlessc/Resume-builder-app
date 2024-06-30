/**
 * Loads state from localStorage
 * @returns {Object} The state loaded from localStorage or an empty object
 */
export const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('resume-storage');
    return serializedState ? JSON.parse(serializedState) : {};
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return {};
  }
};
