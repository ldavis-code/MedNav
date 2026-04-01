/**
 * useDataSync Hook
 * Handles syncing localStorage data to server for authenticated subscribers
 * Provides functions for initial migration and ongoing sync
 */

import { useState, useCallback, useEffect } from 'react';
import { useSubscriberAuth } from '../context/SubscriberAuthContext';

const API_BASE = '/.netlify/functions/subscriber-data';

// localStorage keys used by the app
const STORAGE_KEYS = {
  QUIZ_DATA: 'medication_navigator_progress',
  MY_MEDICATIONS: 'mednav_my_medications',
  SAVINGS_USER_ID: 'mednav_savings_user_id',
  MIGRATION_DONE: 'mednav_migration_completed',
};

export function useDataSync() {
  const { isAuthenticated, getToken, user } = useSubscriberAuth();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [migrationNeeded, setMigrationNeeded] = useState(false);

  // Check if migration is needed on mount
  useEffect(() => {
    if (isAuthenticated) {
      const migrationDone = localStorage.getItem(STORAGE_KEYS.MIGRATION_DONE);
      const hasLocalData =
        localStorage.getItem(STORAGE_KEYS.QUIZ_DATA) ||
        localStorage.getItem(STORAGE_KEYS.MY_MEDICATIONS);

      setMigrationNeeded(!migrationDone && hasLocalData);
    }
  }, [isAuthenticated]);

  // Fetch helper with auth
  const fetchWithAuth = useCallback(async (endpoint, options = {}) => {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Request failed');
    }

    return response.json();
  }, [getToken]);

  // Migrate all local data to server
  const migrateLocalData = useCallback(async () => {
    if (!isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    setSyncing(true);
    setError(null);

    try {
      const quizDataRaw = localStorage.getItem(STORAGE_KEYS.QUIZ_DATA);
      const medicationsRaw = localStorage.getItem(STORAGE_KEYS.MY_MEDICATIONS);
      const savingsUserId = localStorage.getItem(STORAGE_KEYS.SAVINGS_USER_ID);

      const quizData = quizDataRaw ? JSON.parse(quizDataRaw) : null;
      const medications = medicationsRaw ? JSON.parse(medicationsRaw) : null;

      const result = await fetchWithAuth('/migrate', {
        method: 'POST',
        body: JSON.stringify({
          quizData,
          medications,
          legacySavingsUserId: savingsUserId,
        }),
      });

      localStorage.setItem(STORAGE_KEYS.MIGRATION_DONE, user.id);
      setMigrationNeeded(false);

      return { success: true, migrated: result.migrated };
    } catch (err) {
      console.error('Migration error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, fetchWithAuth, user]);

  // Fetch all user data from server
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      return await fetchWithAuth('');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Save quiz data to server
  const saveQuizData = useCallback(async (data) => {
    if (!isAuthenticated) return false;
    try {
      await fetchWithAuth('/quiz', { method: 'POST', body: JSON.stringify(data) });
      return true;
    } catch (err) {
      console.error('Error saving quiz data:', err);
      setError(err.message);
      return false;
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Fetch quiz data from server
  const fetchQuizData = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      return await fetchWithAuth('/quiz');
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      return null;
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Fetch medications from server
  const fetchMedications = useCallback(async () => {
    if (!isAuthenticated) return [];
    try {
      return await fetchWithAuth('/medications');
    } catch (err) {
      console.error('Error fetching medications:', err);
      return [];
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Add a medication to server
  const addMedication = useCallback(async (medication) => {
    if (!isAuthenticated) return null;
    try {
      return await fetchWithAuth('/medications', { method: 'POST', body: JSON.stringify(medication) });
    } catch (err) {
      console.error('Error adding medication:', err);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Update a medication on server
  const updateMedication = useCallback(async (id, updates) => {
    if (!isAuthenticated) return null;
    try {
      return await fetchWithAuth(`/medications/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
    } catch (err) {
      console.error('Error updating medication:', err);
      setError(err.message);
      return null;
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Delete a medication from server
  const deleteMedication = useCallback(async (id) => {
    if (!isAuthenticated) return false;
    try {
      await fetchWithAuth(`/medications/${id}`, { method: 'DELETE' });
      return true;
    } catch (err) {
      console.error('Error deleting medication:', err);
      setError(err.message);
      return false;
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Sync multiple medications to server
  const syncMedications = useCallback(async (medications) => {
    if (!isAuthenticated) return { synced: 0 };
    try {
      return await fetchWithAuth('/medications/sync', { method: 'POST', body: JSON.stringify({ medications }) });
    } catch (err) {
      console.error('Error syncing medications:', err);
      setError(err.message);
      return { synced: 0 };
    }
  }, [isAuthenticated, fetchWithAuth]);

  // Clear migration flag (for testing)
  const clearMigrationFlag = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.MIGRATION_DONE);
    setMigrationNeeded(true);
  }, []);

  return {
    syncing,
    error,
    migrationNeeded,
    isAuthenticated,
    migrateLocalData,
    clearMigrationFlag,
    fetchUserData,
    fetchQuizData,
    saveQuizData,
    fetchMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    syncMedications,
  };
}

export default useDataSync;
