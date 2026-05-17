/**
 * Firestore Service — Core CRUD operations for ALL SafeLink collections.
 * Uses modular Firebase v9+ syntax.
 * 
 * Collections: users, complaints, crimes, emergency_requests, alerts,
 * hotspots, hospitals, police_stations, fire_stations, analytics,
 * notifications, response_teams, citizen_reports, risk_zones
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  GeoPoint
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ─── Collection References ────────────────────────────────────────────
const COLLECTIONS = {
  USERS: 'users',
  COMPLAINTS: 'complaints',
  CRIMES: 'crimes',
  EMERGENCY_REQUESTS: 'emergency_requests',
  ALERTS: 'alerts',
  HOTSPOTS: 'hotspots',
  HOSPITALS: 'hospitals',
  POLICE_STATIONS: 'police_stations',
  FIRE_STATIONS: 'fire_stations',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
  RESPONSE_TEAMS: 'response_teams',
  CITIZEN_REPORTS: 'citizen_reports',
  RISK_ZONES: 'risk_zones'
};

// ─── Generic CRUD ─────────────────────────────────────────────────────

/** Create a document with auto-generated ID */
export const createDocument = async (collectionName, data) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

/** Create or overwrite a document with a specific ID */
export const setDocument = async (collectionName, docId, data, merge = true) => {
  await setDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp()
  }, { merge });
  return docId;
};

/** Get a single document */
export const getDocument = async (collectionName, docId) => {
  const docSnap = await getDoc(doc(db, collectionName, docId));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

/** Get all documents from a collection (with optional filters) */
export const getDocuments = async (collectionName, filters = [], sortField = 'createdAt', sortDirection = 'desc', limitCount = 50) => {
  let q = collection(db, collectionName);
  const constraints = [];
  
  filters.forEach(f => {
    constraints.push(where(f.field, f.operator, f.value));
  });
  
  if (sortField) constraints.push(orderBy(sortField, sortDirection));
  if (limitCount) constraints.push(limit(limitCount));
  
  q = query(q, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/** Update a document */
export const updateDocument = async (collectionName, docId, data) => {
  await updateDoc(doc(db, collectionName, docId), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

/** Delete a document */
export const removeDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};

/** Batch write multiple documents */
export const batchWrite = async (operations) => {
  const batch = writeBatch(db);
  operations.forEach(op => {
    const ref = doc(db, op.collection, op.id);
    if (op.type === 'set') batch.set(ref, { ...op.data, updatedAt: serverTimestamp() }, { merge: true });
    if (op.type === 'update') batch.update(ref, { ...op.data, updatedAt: serverTimestamp() });
    if (op.type === 'delete') batch.delete(ref);
  });
  await batch.commit();
};

// ─── Real-Time Listeners ─────────────────────────────────────────────

/** Subscribe to a collection with real-time updates (returns unsubscribe fn) */
export const subscribeToCollection = (collectionName, callback, filters = [], sortField = 'createdAt', sortDirection = 'desc', limitCount = 50) => {
  let q = collection(db, collectionName);
  const constraints = [];
  
  filters.forEach(f => {
    constraints.push(where(f.field, f.operator, f.value));
  });
  
  if (sortField) constraints.push(orderBy(sortField, sortDirection));
  if (limitCount) constraints.push(limit(limitCount));
  
  q = query(q, ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(docs);
  }, (error) => {
    console.error(`Firestore listener error on ${collectionName}:`, error);
  });
};

/** Subscribe to a single document */
export const subscribeToDocument = (collectionName, docId, callback) => {
  return onSnapshot(doc(db, collectionName, docId), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

// ─── User Services ───────────────────────────────────────────────────

/** Create or update user profile in Firestore (called on signup/login) */
export const syncUserProfile = async (uid, userData) => {
  const existing = await getDocument(COLLECTIONS.USERS, uid);
  if (existing) {
    await updateDocument(COLLECTIONS.USERS, uid, {
      lastLogin: serverTimestamp(),
      ...userData
    });
    return { ...existing, ...userData };
  } else {
    const profile = {
      email: userData.email || '',
      displayName: userData.displayName || '',
      role: userData.role || 'citizen',
      phone: userData.phone || '',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      location: userData.location || null
    };
    await setDocument(COLLECTIONS.USERS, uid, profile, false);
    return { id: uid, ...profile };
  }
};

/** Get user profile */
export const getUserProfile = async (uid) => {
  return getDocument(COLLECTIONS.USERS, uid);
};

/** Subscribe to user profile changes */
export const subscribeToUserProfile = (uid, callback) => {
  return subscribeToDocument(COLLECTIONS.USERS, uid, callback);
};

// ─── Complaint Services ──────────────────────────────────────────────

/** Submit a new complaint */
export const submitComplaint = async (complaintData) => {
  const id = await createDocument(COLLECTIONS.COMPLAINTS, {
    ...complaintData,
    status: 'pending',
    updatedAt: serverTimestamp()
  });
  
  // Also update analytics
  await updateAnalytics({ totalComplaints: increment(1) });
  
  return id;
};

/** Get complaints by user */
export const getUserComplaints = async (userId) => {
  return getDocuments(COLLECTIONS.COMPLAINTS, [
    { field: 'userId', operator: '==', value: userId }
  ]);
};

/** Subscribe to user's complaints (real-time) */
export const subscribeToUserComplaints = (userId, callback) => {
  return subscribeToCollection(COLLECTIONS.COMPLAINTS, callback, [
    { field: 'userId', operator: '==', value: userId }
  ]);
};

/** Subscribe to all complaints (with optional department/status filters) */
export const subscribeToAllComplaints = (callback, department = null, statusFilter = null) => {
  const filters = [];
  if (department) filters.push({ field: 'department', operator: '==', value: department });
  if (statusFilter) filters.push({ field: 'status', operator: '==', value: statusFilter });
  
  // Sort in-memory to prevent index errors when statusFilter/department is used
  return subscribeToCollection(COLLECTIONS.COMPLAINTS, (complaints) => {
    const sorted = [...complaints].sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return timeB - timeA;
    });
    callback(sorted);
  }, filters, null);
};

/** Update complaint status */
export const updateComplaintStatus = async (complaintId, status, assignedTo = null) => {
  const update = { status };
  if (assignedTo) update.assignedTo = assignedTo;
  if (status === 'resolved') update.resolvedAt = serverTimestamp();
  await updateDocument(COLLECTIONS.COMPLAINTS, complaintId, update);
};

/** Update complaint image URL */
export const updateComplaintImageUrl = async (complaintId, imageUrl) => {
  await updateDocument(COLLECTIONS.COMPLAINTS, complaintId, { imageUrl });
};

// ─── Emergency Request Services ──────────────────────────────────────

/** Create SOS / emergency request */
export const createEmergencyRequest = async (requestData) => {
  const id = await createDocument(COLLECTIONS.EMERGENCY_REQUESTS, {
    ...requestData,
    status: 'active',
    priority: requestData.priority || 'critical'
  });
  
  await updateAnalytics({ totalEmergencies: increment(1) });
  
  return id;
};

/** Subscribe to active emergencies (for departments) */
export const subscribeToEmergencies = (callback, typeFilter = null) => {
  const filters = [{ field: 'status', operator: 'in', value: ['active', 'dispatched'] }];
  if (typeFilter) filters.push({ field: 'type', operator: '==', value: typeFilter });
  
  // Sort in-memory to prevent index errors
  return subscribeToCollection(COLLECTIONS.EMERGENCY_REQUESTS, (emergencies) => {
    const sorted = [...emergencies].sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return timeB - timeA;
    });
    callback(sorted);
  }, filters, null);
};

/** Assign team to emergency */
export const assignTeamToEmergency = async (emergencyId, teamId) => {
  await updateDocument(COLLECTIONS.EMERGENCY_REQUESTS, emergencyId, {
    status: 'dispatched',
    assignedTeam: teamId
  });
};

/** Resolve emergency */
export const resolveEmergency = async (emergencyId) => {
  await updateDocument(COLLECTIONS.EMERGENCY_REQUESTS, emergencyId, {
    status: 'resolved',
    resolvedAt: serverTimestamp()
  });
};

// ─── Crime Services ──────────────────────────────────────────────────

/** Report a crime */
export const reportCrime = async (crimeData) => {
  return createDocument(COLLECTIONS.CRIMES, {
    ...crimeData,
    status: 'reported'
  });
};

/** Subscribe to crimes (for police dashboard) */
export const subscribeToCrimes = (callback, statusFilter = null) => {
  const filters = statusFilter ? [{ field: 'status', operator: '==', value: statusFilter }] : [];
  return subscribeToCollection(COLLECTIONS.CRIMES, callback, filters);
};

// ─── Alert Services ──────────────────────────────────────────────────

/** Create an alert */
export const createAlert = async (alertData) => {
  return createDocument(COLLECTIONS.ALERTS, {
    ...alertData,
    isActive: true
  });
};

/** Subscribe to active alerts */
export const subscribeToAlerts = (callback, targetRole = null) => {
  const filters = [{ field: 'isActive', operator: '==', value: true }];
  
  // Fetch active alerts and filter/sort in-memory to prevent index errors
  return subscribeToCollection(COLLECTIONS.ALERTS, (alerts) => {
    const sorted = [...alerts].sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return timeB - timeA;
    });

    if (!targetRole) {
      callback(sorted);
      return;
    }
    const filtered = sorted.filter(alert => 
      !alert.targetRoles || 
      alert.targetRoles.length === 0 || 
      alert.targetRoles.includes(targetRole)
    );
    callback(filtered);
  }, filters, null);
};

// ─── Hotspot Services ────────────────────────────────────────────────

/** Get all hotspots */
export const getHotspots = async () => {
  return getDocuments(COLLECTIONS.HOTSPOTS, [], 'riskLevel', 'desc');
};

/** Subscribe to hotspots */
export const subscribeToHotspots = (callback) => {
  return subscribeToCollection(COLLECTIONS.HOTSPOTS, callback, [], 'lastUpdated', 'desc');
};

/** Update hotspot risk level */
export const updateHotspot = async (hotspotId, data) => {
  await updateDocument(COLLECTIONS.HOTSPOTS, hotspotId, {
    ...data,
    lastUpdated: serverTimestamp()
  });
};

// ─── Notification Services ───────────────────────────────────────────

/** Send notification to a user */
export const sendNotification = async (userId, notification) => {
  return createDocument(COLLECTIONS.NOTIFICATIONS, {
    userId,
    ...notification,
    read: false
  });
};

/** Subscribe to user's notifications (real-time) */
export const subscribeToNotifications = (userId, callback) => {
  return subscribeToCollection(COLLECTIONS.NOTIFICATIONS, callback, [
    { field: 'userId', operator: '==', value: userId }
  ]);
};

/** Alias for component compatibility */
export const subscribeToUserNotifications = subscribeToNotifications;

/** Mark notification as read */
export const markNotificationRead = async (notificationId) => {
  await updateDocument(COLLECTIONS.NOTIFICATIONS, notificationId, { read: true });
};

/** Mark all notifications as read */
export const markAllNotificationsRead = async (userId) => {
  const unread = await getDocuments(COLLECTIONS.NOTIFICATIONS, [
    { field: 'userId', operator: '==', value: userId },
    { field: 'read', operator: '==', value: false }
  ]);
  
  const operations = unread.map(n => ({
    collection: COLLECTIONS.NOTIFICATIONS,
    id: n.id,
    type: 'update',
    data: { read: true }
  }));
  
  if (operations.length > 0) await batchWrite(operations);
};

// ─── Response Team Services ─────────────────────────────────────────

/** Subscribe to response teams */
export const subscribeToResponseTeams = (callback, department = null) => {
  const filters = department ? [{ field: 'department', operator: '==', value: department }] : [];
  return subscribeToCollection(COLLECTIONS.RESPONSE_TEAMS, callback, filters, 'name', 'asc');
};

/** Update team status */
export const updateTeamStatus = async (teamId, status, location = null) => {
  const update = { status };
  if (location) update.currentLocation = location;
  await updateDocument(COLLECTIONS.RESPONSE_TEAMS, teamId, update);
};

// ─── Analytics Services ─────────────────────────────────────────────

/** Get today's analytics document ID */
const getTodayAnalyticsId = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

/** Update analytics counters */
export const updateAnalytics = async (updates) => {
  const docId = getTodayAnalyticsId();
  try {
    await updateDocument(COLLECTIONS.ANALYTICS, docId, updates);
  } catch {
    // Document might not exist yet, create it
    await setDocument(COLLECTIONS.ANALYTICS, docId, {
      date: serverTimestamp(),
      totalComplaints: 0,
      totalEmergencies: 0,
      avgResponseTime: 0,
      resolutionRate: 0,
      hotspotCount: 0,
      departmentStats: {},
      ...updates
    });
  }
};

/** Subscribe to today's analytics */
export const subscribeToAnalytics = (callback) => {
  const docId = getTodayAnalyticsId();
  return subscribeToDocument(COLLECTIONS.ANALYTICS, docId, callback);
};

/** Get analytics for a date range */
export const getAnalyticsRange = async (startDate, endDate) => {
  return getDocuments(COLLECTIONS.ANALYTICS, [
    { field: 'date', operator: '>=', value: startDate },
    { field: 'date', operator: '<=', value: endDate }
  ], 'date', 'asc', 100);
};

// ─── Citizen Reports ─────────────────────────────────────────────────

/** Submit citizen report */
export const submitCitizenReport = async (reportData) => {
  return createDocument(COLLECTIONS.CITIZEN_REPORTS, {
    ...reportData,
    status: 'submitted'
  });
};

/** Subscribe to citizen reports */
export const subscribeToCitizenReports = (callback, userId = null) => {
  const filters = userId ? [{ field: 'userId', operator: '==', value: userId }] : [];
  return subscribeToCollection(COLLECTIONS.CITIZEN_REPORTS, callback, filters);
};

// ─── Risk Zones ──────────────────────────────────────────────────────

/** Subscribe to risk zones */
export const subscribeToRiskZones = (callback) => {
  return subscribeToCollection(COLLECTIONS.RISK_ZONES, callback, [], 'riskScore', 'desc');
};

// ─── Export Collections Enum ─────────────────────────────────────────
export { COLLECTIONS };
