import { useState, useEffect } from 'react';
import { ApiDelete, ApiGet } from '../../helpers/API/ApiData';
import { notification, Modal } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const DailyStatus = () => {
  const [deletingTask, setDeletingTask] = useState({});
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUserData(userInfo);
    if (userInfo) {
      fetchDailyStatus(userInfo.id);
    }
  }, []);

  const fetchDailyStatus = async (userId) => {
    try {
      const today = new Date();
      const date = today.toISOString().split('T')[0];
      const response = await ApiGet(`report/get-daily-status?userId=${userId}&date=${date}`);
      
      if (response.status === 200) {
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
      notification.error({
        message: 'Error',
        description: 'Failed to fetch daily status',
      });
    }
  };

  const handleDeleteTask = async (task) => {
    Modal.confirm({
      title: 'Delete Task',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete this ${task.type.toLowerCase()}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setDeletingTask(prev => ({ ...prev, [task._id]: true }));
          
          // Determine the correct endpoint based on task type
          const type = task.isPlan ? 'plan' : 'status';
          const reportId = task.reportId || task._id;
          
          const response = await ApiDelete(`report/delete/${reportId}/${type}/${task._id}`);
          
          if (response.status === 200) {
            notification.success({
              message: 'Success',
              description: `${task.type} deleted successfully`,
            });
            // Refresh the tasks list
            if (userData) {
              fetchDailyStatus(userData.id);
            }
          } else {
            throw new Error(`Failed to delete ${task.type.toLowerCase()}`);
          }
        } catch (error) {
          console.error(`Error deleting task:`, error);
          notification.error({
            message: 'Error',
            description: error.response?.data?.message || `Failed to delete task`,
          });
        } finally {
          setDeletingTask(prev => ({ ...prev, [task._id]: false }));
        }
      },
    });
  };

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
                        onClick={() => handleDeleteTask(task)}
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