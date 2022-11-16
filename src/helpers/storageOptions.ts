const LOCAL_STORAGE_OPTIONS = {
  defaultPanel: '',
  defaultManagedPanel: '',
  isDefaultPanelManaged: '',
};

// Set all values to the key
Object.keys(LOCAL_STORAGE_OPTIONS).forEach((key) => {
  LOCAL_STORAGE_OPTIONS[key] = key;
});

export default LOCAL_STORAGE_OPTIONS;
export { LOCAL_STORAGE_OPTIONS };
