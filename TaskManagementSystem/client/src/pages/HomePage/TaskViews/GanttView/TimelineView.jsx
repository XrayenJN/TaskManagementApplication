import { Scheduler } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'; 
import React, { useCallback, useState, useContext, useEffect } from "react";
import '../../../../assets/styles/TimelineView.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { getContributors } from "../../../../firebase/firebase";
import SortData from "./GanttChartAux";
import TaskEditPopup from '../../../../components/TaskEditPopup';

dayjs.extend(isBetween);

export default function GanttChart() {
  const { projectId } = useParams();
  const { projectTasks } = useContext(TaskContext);
  const { setChosenProjectId } = useContext(TaskContext);
  const [contributors, setContributors] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  var loadingStatus = true;

  // Get contributors for this project
  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }
  
  useEffect(() => {
    retrieveContributors()
  }, [])

  useEffect(() => {
    setChosenProjectId(projectId)
  }, [projectId])

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTask(null);
  };

  // Once we have the data 
  var finialisedData = []
  if (projectTasks && projectTasks[projectId] && contributors.length) {
    finialisedData = SortData(contributors, projectTasks[projectId])
    loadingStatus = false
  }
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range) => {
    setRange(range);
  }, []);

  // Leaving this here if we need references to the library used.
  // Example can be also found on video https://youtu.be/9oy4rTVEfBQ?t=118&si=52BGKSIYz6bTZ7fx
  // and in the react-scheduler repo App.tsx file https://github.com/Bitnoise/react-scheduler/blob/master/src/App.tsx
  const data = finialisedData.map((person) => ({
    ...person,
    data: person.data.filter(
      (project) =>
        // date calculations
        dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
        dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
        (dayjs(project.startDate).isBefore(range.startDate, "day") &&
          dayjs(project.endDate).isAfter(range.endDate, "day"))
    )
  }))

  return (
    <div>
      <div class="divWrapper*" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <h1 class="heading">Timeline View</h1>
        <button class="linkButton">
          <Link to={`/project/${projectId}/new-project-task-form`} style={{ color: 'black' }}>
            Add Project Task
          </Link>
        </button>
      </div>
      <div>
        <hr />
      </div>
      <div class="ganttWrapper">
        <Scheduler
          isFullscreen={false}
          isLoading={loadingStatus}
          data={data}
          onRangeChange={handleRangeChange}
          onTileClick={handleTaskClick}
          config={{
            zoom: 1,
            filterButtonState: -1,
            showThemeToggle: true,
            showTooltip: false
          }}
        />
      </div>
      {isPopupOpen && selectedTask && (
        <TaskEditPopup 
          task={selectedTask}
          contributors={contributors}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}
