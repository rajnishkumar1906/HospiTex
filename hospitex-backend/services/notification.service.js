import { Notification } from '../models/index.js';

export const createNotification = async (userId, title, message, type = 'info', link = '', relatedId = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
      relatedId
    });
    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    return null;
  }
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ user: userId, isRead: false });
};

export const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
};
