import { useEffect, useState } from "react";
import { ApiGet, ApiPost, ApiPut } from "../../helpers/API/ApiData";
import { notification } from "antd";
import Image from 'next/image';
import { LoadingOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { ENDPOINTS } from "../../config/API/api-prod";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imageError, setImageError] = useState({});
  const [error, setError] = useState(null);

  // Default avatar as a base64 string to avoid import issues
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI2U2ZTZlNiIvPjxwYXRoIGQ9Ik0yMCAxOWE2IDYgMCAxIDAgMC0xMiA2IDYgMCAwIDAgMCAxMnptMCAyYy00LjAwMiAwLTEyIDIuMDEtMTIgNnY0aDI0di00YzAtMy45OS03Ljk5OC02LTEyLTZ6IiBmaWxsPSIjOTk5Ii8+PC9zdmc+";

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserData(userInfo);
    if (userInfo) {
      fetchNotifications(userInfo.id);
    }
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('data:')) return imagePath;
    if (imagePath.startsWith('http')) return imagePath;
    
    // Remove any leading slashes from the image path
    const cleanImagePath = imagePath.replace(/^\/+/, '');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    return `${apiUrl}/uploads/${cleanImagePath}`;
  };

  const handleImageError = (id, type) => {
    console.log(`Image error for ${id}-${type}`);
    setImageError(prev => ({
      ...prev,
      [`${id}-${type}`]: true
    }));
  };

  const fetchNotifications = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching notifications for user:', userId);
      
      const response = await ApiGet(ENDPOINTS.NOTIFICATIONS, { userId });
      console.log('Notifications response:', response);
      
      if (response.data) {
        const processedNotifications = response.data.map(notification => ({
          ...notification,
          imageUrl: getImageUrl(notification.imageUrl),
          userImage: getImageUrl(notification.userImage)
        }));
        setNotifications(processedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.response?.data?.message || 'Failed to fetch notifications');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch notifications. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);
      
      const response = await ApiPut(ENDPOINTS.UPDATE_NOTIFICATION, {
        notificationId,
        status: 'read'
      });
      
      if (response.data) {
        notification.success({
          message: 'Success',
          description: 'Notification marked as read',
        });
        
        // Refresh notifications
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
          fetchNotifications(userInfo.id);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update notification. Please try again.',
      });
    }
  };

  const moveTaskToStatus = async (notification) => {
    try {
      setLoading(prev => ({ ...prev, [notification._id]: 'complete' }));

      // First mark the notification as completed
      const notificationResponse = await ApiPost('notification/update-notification-status', {
        id: notification._id,
        status: 'completed'
      });

      if (notificationResponse.status !== 200) {
        throw new Error('Failed to update notification status');
      }

      // Then create the daily status entry
      const today = new Date();
      const statusData = {
        date: today.toISOString().split('T')[0],
        userId: userData.id,
        projectId: notification.projectId || "",
        taskDetails: notification.description || "",
        totalHours: 0,
        taskType: "Task",
        taskStatus: "Completed",
        isPlan: false,
        isStatus: true
      };

      console.log('Creating daily status with data:', statusData);

      // Add to Daily Status
      const dailyStatusResponse = await ApiPost('report/add-status', statusData);
      console.log('Daily status creation response:', dailyStatusResponse);

      if (dailyStatusResponse.status === 200) {
        notification.success({
          message: "Success",
          description: "Task completed and moved to Daily Status",
        });
        await fetchNotifications(userData.id);
      } else {
        // If daily status creation fails, revert notification status
        await ApiPost('notification/update-notification-status', {
          id: notification._id,
          status: 'unread'
        });
        throw new Error('Failed to create daily status entry');
      }

      setLoading(prev => ({ ...prev, [notification._id]: false }));
    } catch (error) {
      console.error('Error completing task:', error);
      setLoading(prev => ({ ...prev, [notification._id]: false }));
      notification.error({
        message: "Error",
        description: error.response?.data?.message || error.message || "Failed to complete task",
      });

      // Attempt to revert notification status if it was updated
      try {
        await ApiPost('notification/update-notification-status', {
          id: notification._id,
          status: 'unread'
        });
      } catch (revertError) {
        console.error('Error reverting notification status:', revertError);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.status === 'read' ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {notification.status !== 'read' && (
                <button 
                  className="mark-read-btn"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notifications">
          No notifications found
        </div>
      )}
    </div>
  );
};

export default Notification;
