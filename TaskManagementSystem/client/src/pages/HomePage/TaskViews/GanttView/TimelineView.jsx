import { Scheduler } from "@bitnoi.se/react-scheduler";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'; // ES 2015
import React, { useCallback, useState, useContext, useEffect } from "react";
import '../../../../assets/styles/App.css';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { TaskContext } from '../../../../contexts/TaskContext';
import { getContributors } from "../../../../firebase/firebase";
import sortData from "./GanttChartAux";

dayjs.extend(isBetween);

export default function GanttChart() {
  const { projectId } = useParams();
  const { projectTasks } = useContext(TaskContext);
  const [contributors, setContributors] = useState([]);

  // Get contributors for this project
  const retrieveContributors = async () => {
    const theContributors = await getContributors(projectId);
    setContributors(theContributors);
  }
  useEffect(() => {
    retrieveContributors()
  }, [])


  var finialisedData = []
  if (projectTasks && projectTasks[projectId]) {
    finialisedData = sortData(contributors, projectTasks[projectId])
  }
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range) => {
    setRange(range);
  }, []);

  // Filtering events that are included in current date range
  // Example can be also found on video https://youtu.be/9oy4rTVEfBQ?t=118&si=52BGKSIYz6bTZ7fx
  // and in the react-scheduler repo App.tsx file https://github.com/Bitnoise/react-scheduler/blob/master/src/App.tsx
  const data = finialisedData.map((person) => ({
    ...person,
    data: person.data.filter(
      (project) =>
        // we use "dayjs" for date calculations, but feel free to use library of your choice
        dayjs(project.startDate).isBetween(range.startDate, range.endDate) ||
        dayjs(project.endDate).isBetween(range.startDate, range.endDate) ||
        (dayjs(project.startDate).isBefore(range.startDate, "day") &&
          dayjs(project.endDate).isAfter(range.endDate, "day"))
    )
  }))

  return (
    <div>
      <div class="divForStuff*">
      <h1 class="heading">Timeline View</h1>
        <button class="linkbutton">
          <Link to={`/project/${projectId}/new-project-task-form`} style={{ color: 'black' }}>
            Add Project Task
          </Link>
        </button>
      </div>
      <div>
        <hr />
      </div>
      <div class="gantt">

        <Scheduler
          isFullscreen={false}
          isLoading={false}
          data={data}
          onRangeChange={handleRangeChange}
          config={{
            zoom: 1,
            filterButtonState: -1,
            showThemeToggle: true,
          }}
        />
      </div>
    </div>
  );
}
