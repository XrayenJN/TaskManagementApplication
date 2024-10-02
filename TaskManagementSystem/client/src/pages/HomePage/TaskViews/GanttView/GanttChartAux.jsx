export default function SortData(contributors, tasks) {
  var taskData = {}
  // For each user create a space for them
  contributors.forEach((user) => {
    taskData[user.name] = {
       id: user.name,
       label:{
        title: user.name
       },
       data:[]
     }});
    
  // For each task allocate it to the user
  tasks.forEach((task) => {
    task.owners.forEach((owner) =>{
      var formattedData = {
        id: task.id,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
        title: task.name,
        description: task.description
      }
      // Add the background color
      if (new Date() > new Date(task.endDate)){
        if (task.status == "Completed"){
          formattedData.bgColor = 'rgb(27,160,152)'
        }
        else{
          formattedData.bgColor = 'rgb(189,118,118)'
        }
      }
      else{
        formattedData.bgColor = 'rgb(165,165,141)'
      }
      taskData[owner.name].data.push(formattedData)
    })
  })
  // Return the tasks
  return Object.values(taskData)
}