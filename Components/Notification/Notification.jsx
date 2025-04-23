import { useEffect, useState } from "react";
import { ApiGet, ApiPost, ApiPut } from "../../helpers/API/ApiData";
import { notification as antdNotification } from "antd";
import Image from 'next/image';
import { LoadingOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [imageError, setImageError] = useState({});

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
      const response = await ApiGet(`notification/get-notification?userId=${userId}`);
      if (response.status === 200) {
        const processedNotifications = response.data.data.map(notification => ({
          ...notification,
          imageUrl: getImageUrl(notification.imageUrl),
          userImage: getImageUrl(notification.userImage)
        }));
        setNotifications(processedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      antdNotification.error({
        message: "Error",
        description: "Failed to fetch notifications",
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      setLoading(prev => ({ ...prev, [notification._id]: 'read' }));

      const response = await ApiPost('notification/update-notification-status', {
        id: notification._id,
        status: 'read'
      });

      if (response.status === 200) {
        antdNotification.success({
          message: "Success",
          description: "Notification marked as read",
        });
        await fetchNotifications(userData.id);
      } else {
        throw new Error('Failed to mark notification as read');
      }

      setLoading(prev => ({ ...prev, [notification._id]: false }));
    } catch (error) {
      console.error('Error marking as read:', error);
      setLoading(prev => ({ ...prev, [notification._id]: false }));
      antdNotification.error({
        message: "Error",
        description: "Failed to mark notification as read",
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
        antdNotification.success({
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
      antdNotification.error({
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

  return (
    <>
      <div className="notificationPage">
        <div className="notificationPage_heading textcolor">
          Task Notification
        </div>
        <div className="notificationSection">
          {notifications.length === 0 ? (
            <div className="notificationPage_card">
              <div className="notificationPage_discretion textcolorWT">
                No notifications available
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notificationPage_card ${notification.status === "completed" ? "completed" : ""}`}
              >
                <div className="notificationPage_header">
                  <div className="notificationPage_userImage">
                    <div className="image-container">
                      {!imageError[`${notification._id}-profile`] ? (
                        <Image 
                          src={notification.userImage ? getImageUrl(notification.userImage) : defaultAvatar}
                          alt={notification.userName || "User"}
                          width={40}
                          height={40}
                          className="profile-image"
                          onError={() => handleImageError(notification._id, 'profile')}
                          priority
                          unoptimized={notification.userImage?.startsWith('data:')}
                        />
                      ) : (
                        <div className="fallback-avatar">
                          <UserOutlined />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="notificationPage_userInfo">
                    <div className="notificationPage_userName">
                      {notification.userName || "User"}
                    </div>
                    <div className="notificationPage_date textcolorWT">
                      {new Date(notification.date).toLocaleDateString()}
                    </div>
                  </div>
                  {notification.status === "completed" && (
                    <div className="notificationPage_status">
                      <CheckCircleOutlined className="completed-icon" />
                    </div>
                  )}
                </div>

                {notification.imageUrl && !imageError[`${notification._id}-content`] && (
                  <div className="notificationPage_image">
                    <div className="notification-image-container">
                      <Image 
                        src={getImageUrl(notification.imageUrl)}
                        alt={notification.title || "Notification image"}
                        width={800}
                        height={600}
                        className="notification-image"
                        onError={() => handleImageError(notification._id, 'content')}
                        priority
                        unoptimized={notification.imageUrl?.startsWith('data:')}
                      />
                    </div>
                  </div>
                )}

                <div className="notificationPage_content">
                  <div className="notificationPage_titleName textcolorWT">
                    {notification.title}
                  </div>
                  <div className="notificationPage_discretion textcolorWT">
                    {notification.description}
                  </div>
                </div>

                {notification.status !== "completed" && (
                  <div className="notificationPage_actions">
                    <button 
                      className={`notificationPage_actionBtn ${loading[notification._id] === 'read' ? 'loading' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      disabled={loading[notification._id]}
                    >
                      {loading[notification._id] === 'read' ? <LoadingOutlined /> : 'Mark as Read'}
                    </button>
                    <button 
                      className={`notificationPage_actionBtn notificationPage_actionBtnPrimary ${loading[notification._id] === 'complete' ? 'loading' : ''}`}
                      onClick={() => moveTaskToStatus(notification)}
                      disabled={loading[notification._id]}
                    >
                      {loading[notification._id] === 'complete' ? <LoadingOutlined /> : 'Complete Task'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notification;
