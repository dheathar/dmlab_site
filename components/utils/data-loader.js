/**
 * Data Loader Utility
 * Handles loading and caching of JSON data files
 */

class DataLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  /**
   * Load JSON data from file with caching
   * @param {string} dataFile - Path to JSON file (e.g., 'team', 'publications')
   * @returns {Promise<Object>} Parsed JSON data
   */
  async load(dataFile) {
    // Return cached data if available
    if (this.cache.has(dataFile)) {
      return this.cache.get(dataFile);
    }

    // Wait for ongoing load if already loading
    if (this.loading.has(dataFile)) {
      return this.loading.get(dataFile);
    }

    // Start loading
    const loadPromise = this._fetchData(dataFile);
    this.loading.set(dataFile, loadPromise);

    try {
      const data = await loadPromise;
      this.cache.set(dataFile, data);
      this.loading.delete(dataFile);
      return data;
    } catch (error) {
      this.loading.delete(dataFile);
      throw error;
    }
  }

  /**
   * Fetch data from JSON file
   * @private
   */
  async _fetchData(dataFile) {
    const basePath = this._getBasePath();
    const url = `${basePath}/data/${dataFile}.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${dataFile}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${dataFile}:`, error);
      throw error;
    }
  }

  /**
   * Get base path based on current location
   * @private
   */
  _getBasePath() {
    const path = window.location.pathname;
    // If we're in /pages/, go up one level
    if (path.includes('/pages/')) {
      return '..';
    }
    return '.';
  }

  /**
   * Load multiple data files in parallel
   * @param {string[]} dataFiles - Array of data file names
   * @returns {Promise<Object>} Object with all loaded data
   */
  async loadMultiple(dataFiles) {
    const promises = dataFiles.map(file =>
      this.load(file).then(data => ({ [file]: data }))
    );
    const results = await Promise.all(promises);
    return Object.assign({}, ...results);
  }

  /**
   * Clear cache for specific file or all files
   * @param {string} [dataFile] - Optional specific file to clear
   */
  clearCache(dataFile = null) {
    if (dataFile) {
      this.cache.delete(dataFile);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Preload data files (useful for performance)
   * @param {string[]} dataFiles - Array of data file names
   */
  async preload(dataFiles) {
    await this.loadMultiple(dataFiles);
  }
}

// Create singleton instance
const dataLoader = new DataLoader();

export default dataLoader;

// Export class for testing/custom instances
export { DataLoader };
