import { useState, useEffect } from 'react';
import { ApiGet, ApiPost, ApiDelete } from '../../helpers/API/ApiData';
import { ENDPOINTS } from '../../config/API/api-prod';
import { notification, Modal } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const DailyStatus = () => {
  const [deletingTask, setDeletingTask] = useState({});
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState({});
  const [dailyStatus, setDailyStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserData(userInfo);
    if (userInfo) {
      fetchDailyStatus(userInfo.id);
    }
  }, []);

  const fetchDailyStatus = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const date = new Date().toISOString().split('T')[0];
      console.log('Fetching daily status for:', { userId, date });
      
      // Using the full URL for the API call
      const response = await ApiGet(`report/get-daily-status`, { 
        userId: userId,
        date: date 
      });
      
      console.log('Daily status response:', response);
      
      if (response.data && response.data.data) {
        const statusData = response.data.data;
        setDailyStatus(statusData);
        
        // Group tasks by project
        const groupedTasks = {};
        
        // Process plans
        if (statusData.plans && Array.isArray(statusData.plans)) {
          statusData.plans.forEach(task => {
            const projectName = task.projectName || 'Other';
            if (!groupedTasks[projectName]) {
              groupedTasks[projectName] = [];
            }
            groupedTasks[projectName].push({
              ...task,
              type: 'Plan'
            });
          });
        }

        // Process status
        if (statusData.status && Array.isArray(statusData.status)) {
          statusData.status.forEach(task => {
            const projectName = task.projectName || 'Other';
            if (!groupedTasks[projectName]) {
              groupedTasks[projectName] = [];
            }
            groupedTasks[projectName].push({
              ...task,
              type: 'Status'
            });
          });
        }
        
        setTasks(groupedTasks);
      } else {
        setTasks({});
        notification.info({
          message: 'No Tasks',
          description: 'No daily status found for today.',
        });
      }
    } catch (error) {
      console.error('Error fetching daily status:', error);
      setError(error.response?.data?.message || 'Failed to fetch daily status');
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Failed to fetch daily status. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (reportId, type, taskId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          setDeletingTask(prev => ({ ...prev, [taskId]: true }));
          
          // Using the full URL for the delete API call
          const response = await ApiDelete(`report/delete/${reportId}/${type.toLowerCase()}/${taskId}`);
          
          if (response.data) {
            notification.success({
              message: 'Success',
              description: 'Task deleted successfully',
            });
            // Refresh the data
            if (userData) {
              fetchDailyStatus(userData.id);
            }
          }
        } catch (error) {
          console.error('Error deleting task:', error);
          notification.error({
            message: 'Error',
            description: error.response?.data?.message || 'Failed to delete task',
          });
        } finally {
          setDeletingTask(prev => ({ ...prev, [taskId]: false }));
        }
      },
    });
  };

  if (loading) {
    return <div className="dailyStatus_loading">Loading...</div>;
  }

  if (error) {
    return <div className="dailyStatus_error">Error: {error}</div>;
  }

  return (
    <div className="dailyStatus">
      {Object.entries(tasks).length > 0 ? (
        Object.entries(tasks).map(([projectName, projectTasks]) => (
          <div key={projectName} className="dailyStatus_section">
            <h2 className="dailyStatus_sectionTitle">{projectName}</h2>
            <div className="dailyStatus_taskList">
              {projectTasks.map((task) => (
                <div key={task._id} className={`dailyStatus_task ${task.type.toLowerCase()}`}>
                  <div className="dailyStatus_taskContent">
                    <div className="dailyStatus_taskHeader">
                      <div className="dailyStatus_taskTitle">
                        <span className="dailyStatus_taskType">{task.type}</span>
                        <h3>{task.taskDetails || task.task}</h3>
                      </div>
                      <div className="dailyStatus_actions">
                        <button
                          className="dailyStatus_actionBtn dailyStatus_deleteBtn"
                          onClick={() => handleDeleteTask(dailyStatus._id, task.type, task._id)}
                          disabled={deletingTask[task._id]}
                        >
                          <DeleteOutlined />
                        </button>
                        <button className="dailyStatus_actionBtn dailyStatus_editBtn">
                          <EditOutlined />
                        </button>
                      </div>
                    </div>
                    <div className="dailyStatus_taskMeta">
                      <span>Hours: {task.totalHours || 0}</span>
                      {task.taskStatus && <span>Status: {task.taskStatus}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="dailyStatus_emptyState">
          No tasks for today
        </div>
      )}
    </div>
  );
};

export default DailyStatus; 