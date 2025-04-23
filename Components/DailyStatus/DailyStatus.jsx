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
      
      const response = await ApiGet(ENDPOINTS.DAILY_STATUS, { userId, date });
      console.log('Daily status response:', response);
      
      if (response.data) {
        setDailyStatus(response.data);
        // Group tasks by project
        const groupedTasks = {};
        
        // Process plans and status
        const allTasks = [...(response.data.plans || []), ...(response.data.status || [])];
        
        allTasks.forEach(task => {
          const projectName = task.projectName || 'Other';
          if (!groupedTasks[projectName]) {
            groupedTasks[projectName] = [];
          }
          groupedTasks[projectName].push({
            ...task,
            type: task.isPlan ? 'Plan' : 'Status'
          });
        });
        
        setTasks(groupedTasks);
      }
    } catch (error) {
      console.error('Error fetching daily status:', error);
      setError(error.response?.data?.message || 'Failed to fetch daily status');
      notification.error({
        message: 'Error',
        description: 'Failed to fetch daily status. Please try again.',
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
          const response = await ApiDelete(ENDPOINTS.DELETE_STATUS(reportId, type, taskId));
          if (response.data) {
            notification.success({
              message: 'Success',
              description: 'Task deleted successfully',
            });
            // Refresh the data
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (userInfo) {
              fetchDailyStatus(userInfo.id);
            }
          }
        } catch (error) {
          console.error('Error deleting task:', error);
          notification.error({
            message: 'Error',
            description: error.response?.data?.message || 'Failed to delete task',
          });
        }
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dailyStatus">
      {Object.entries(tasks).map(([projectName, projectTasks]) => (
        <div key={projectName} className="dailyStatus_section">
          <h2 className="dailyStatus_sectionTitle">{projectName}</h2>
          <div className="dailyStatus_taskList">
            {projectTasks.map((task) => (
              <div key={task._id} className={`dailyStatus_task ${task.type.toLowerCase()}`}>
                <div className="dailyStatus_taskContent">
                  <div className="dailyStatus_taskHeader">
                    <div className="dailyStatus_taskTitle">
                      <span className="dailyStatus_taskType">{task.type}</span>
                      <h3>{task.taskDetails}</h3>
                    </div>
                    <div className="dailyStatus_actions">
                      <button
                        className="dailyStatus_actionBtn dailyStatus_deleteBtn"
                        onClick={() => handleDeleteTask(dailyStatus._id, task.type.toLowerCase(), task._id)}
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
      ))}
      {Object.keys(tasks).length === 0 && (
        <div className="dailyStatus_emptyState">
          No tasks for today
        </div>
      )}
    </div>
  );
};

export default DailyStatus; 