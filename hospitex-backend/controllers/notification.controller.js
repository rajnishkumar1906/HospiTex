import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Notification } from '../models/index.js';

// ============================================
// USER NOTIFICATION FUNCTIONS
// ============================================

export const getUserNotifications = handleAsync(async (req, res) => {
  const userId = req.userId;
  const { page = 1, limit = 20, isRead } = req.query;
  
  const query = { user: userId };
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }
  
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
  
  return apiResponse.paginated(res, notifications, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
    unreadCount
  });
});

export const markAsRead = handleAsync(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.userId;
  
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
  
  if (!notification) {
    return apiResponse.error(res, 'Notification not found', 404);
  }
  
  return apiResponse.success(res, notification, 'Notification marked as read');
});

export const markAllAsRead = handleAsync(async (req, res) => {
  const userId = req.userId;
  
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
  
  return apiResponse.success(res, { modifiedCount: result.modifiedCount }, 'All notifications marked as read');
});

export const deleteNotification = handleAsync(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.userId;
  
  const notification = await Notification.findOneAndDelete({ _id: notificationId, user: userId });
  
  if (!notification) {
    return apiResponse.error(res, 'Notification not found', 404);
  }
  
  return apiResponse.deleted(res, 'Notification deleted successfully');
});

export const deleteAllNotifications = handleAsync(async (req, res) => {
  const userId = req.userId;
  
  const result = await Notification.deleteMany({ user: userId });
  
  return apiResponse.success(res, { deletedCount: result.deletedCount }, 'All notifications deleted successfully');
});

export const getUnreadCount = handleAsync(async (req, res) => {
  const userId = req.userId;
  
  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });
  
  return apiResponse.success(res, { unreadCount }, 'Unread count retrieved successfully');
});

// ============================================
// ADMIN NOTIFICATION FUNCTIONS
// ============================================

export const getAllNotifications = handleAsync(async (req, res) => {
  const { page = 1, limit = 20, userId, type } = req.query;
  
  const query = {};
  if (userId) query.user = userId;
  if (type) query.type = type;
  
  const notifications = await Notification.find(query)
    .populate('user', 'username email role')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Notification.countDocuments(query);
  
  return apiResponse.paginated(res, notifications, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

export const sendNotificationToUser = handleAsync(async (req, res) => {
  const { userId, title, message, type, link } = req.body;
  
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type: type || 'info',
    link: link || ''
  });
  
  return apiResponse.created(res, notification, 'Notification sent successfully');
});

export const sendBulkNotifications = handleAsync(async (req, res) => {
  const { userIds, title, message, type, link } = req.body;
  
  const notifications = await Notification.insertMany(
    userIds.map(userId => ({
      user: userId,
      title,
      message,
      type: type || 'info',
      link: link || ''
    }))
  );
  
  return apiResponse.created(res, { count: notifications.length }, 'Bulk notifications sent successfully');
});

// ============================================
// BASIC CRUD FUNCTIONS (for backward compatibility)
// ============================================

export const getAlls = handleAsync(async (req, res) => {
  const notifications = await Notification.find().populate('user', 'username');
  return apiResponse.success(res, notifications, 'Notifications retrieved successfully');
});

export const getById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findById(id).populate('user', 'username');
  
  if (!notification) {
    return apiResponse.error(res, 'Notification not found', 404);
  }
  
  return apiResponse.success(res, notification, 'Notification retrieved successfully');
});

export const create = handleAsync(async (req, res) => {
  const notification = await Notification.create(req.body);
  return apiResponse.created(res, notification, 'Notification created successfully');
});

export const update = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  
  if (!notification) {
    return apiResponse.error(res, 'Notification not found', 404);
  }
  
  return apiResponse.updated(res, notification, 'Notification updated successfully');
});

export const deleteNotificationById = handleAsync(async (req, res) => {
  const { id } = req.params;
  
  const notification = await Notification.findByIdAndDelete(id);
  
  if (!notification) {
    return apiResponse.error(res, 'Notification not found', 404);
  }
  
  return apiResponse.deleted(res, 'Notification deleted successfully');
});