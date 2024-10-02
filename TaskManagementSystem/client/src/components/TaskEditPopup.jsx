import React, { useContext, useState, useEffect } from 'react';
import { getUser, updateTask, removeParticularTask } from '../firebase/firebase';
import { TaskContext } from '../contexts/TaskContext';
import { DatePicker, Space } from 'antd';
import Select from 'react-select';
import { addTimeToDate, extractDate } from '../utils/dateHandler';
import moment from 'moment';

const TaskEditPopup = ({ task, contributors, onClose }) => {
  const { refreshTasks } = useContext(TaskContext);
  const [editedTask, setEditedTask] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    comments: '',
    links: '',
    isMeeting: false,
    status: null,
    owners: '',
  });

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      console.log(task.owners)
      const ownerDetails = await getUser(task.owners[0].ref);
      setEditedTask({
        ...task,
        owners: ownerDetails.email,
      });
    };
    fetchOwnerDetails();
  }, [task]);

  const handleInputChange = (e) => {
    const { type, name, checked, value } = e.target;
    setEditedTask({
      ...editedTask,
      [name]: type === 'checkbox' ? checked : type === 'date' ? addTimeToDate(value) : value,
    });
  };

  const handleSave = async () => {
    await updateTask(task.id, editedTask);
    refreshTasks();
    onClose();
  };

  const removeTask = async () => {
    await removeParticularTask(task.id);
    refreshTasks();
    onClose();
  };

  const onChange = (_, dateStrings) => {
    const formattedStartDate = dateStrings[0] ? addTimeToDate(dateStrings[0], editedTask.isMeeting) : editedTask.startDate;
    const formattedEndDate = dateStrings[1] ? addTimeToDate(dateStrings[1], editedTask.isMeeting) : editedTask.endDate;
    setEditedTask({
      ...editedTask,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  const meetingComponent = () => {
    if (!editedTask.isMeeting) {
      return (
        <div>
          <div>
            <select name="status" value={editedTask.status} onChange={handleInputChange} required>
              <option value="">Select Status</option>
              <option value="Backlog">Backlog</option>
              <option value="Ready">Ready</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <h3>Start Date:</h3>
            <input
              name="startDate"
              type="date"
              value={extractDate(editedTask.startDate)}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <h3>End Date:</h3>
            <input
              name="endDate"
              type="date"
              value={extractDate(editedTask.endDate)}
              onChange={handleInputChange}
            />
          </div>
          
        </div>
      );
    } else {
      return (
        <div style={{paddingTop : '8px'}}>
          <Space direction="vertical" size={12}>
            <DatePicker.RangePicker
              showTime={{ format: 'HH:mm' }}
              value={[
                moment(editedTask.startDate, 'YYYY-MM-DD HH:mm'),
                moment(editedTask.endDate, 'YYYY-MM-DD HH:mm'),
              ]}
              onChange={onChange}
              format="YYYY-MM-DD HH:mm"
            />
          </Space>
        </div>
      );
    }
  };

  return (
    <div className="popup">
      <div className="popup-content" style={{ backgroundColor: '#DEB992' }}>
        <h2>Edit Task Details</h2>
        <hr />
        <div>
          <table style={{ margin: 'auto' }}>
            <tbody>
              <tr>
                <td>
                  <h3>Task Name</h3>
                  <input
                    type="text"
                    name="name"
                    value={editedTask.name}
                    onChange={handleInputChange}
                  />
                  <h3>Task Description</h3>
                  <textarea
                    name="description"
                    value={editedTask.description}
                    onChange={handleInputChange}
                  />
                  <h3>Task Comments</h3>
                  <textarea
                    name="comments"
                    value={editedTask.comments}
                    onChange={handleInputChange}
                  />
                </td>
                <td>
                  <div>
                    <h3>Task Links</h3>
                    <textarea
                      name="links"
                      value={editedTask.links}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label>
                    <b>Meeting</b>
                    <div>
                      <input
                        name="isMeeting"
                        type="checkbox"
                        checked={editedTask.isMeeting}
                        onChange={handleInputChange}
                      />
                    </div>
                  </label>
                  <div>
                    <select
                      name="owners"
                      value={editedTask.owners}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Owner</option>
                      {contributors.map((contributor, index) => (
                        <option key={index} value={contributor.email}>
                          {contributor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {meetingComponent()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr />
        <button onClick={handleSave}>Save</button>
        <button onClick={removeTask}>Remove Task</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskEditPopup;