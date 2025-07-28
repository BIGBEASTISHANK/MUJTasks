export enum TaskType {
  Assignment = "Assignment",
  Projects = "Projects",
}

export const GetTaskDisplayName = (taskNumber: number): string => {
  switch (taskNumber) {
    case 1:
      return TaskType.Assignment;
    case 2:
      return TaskType.Projects;
    default:
      return `Unknown Task (${taskNumber})`;
  }
};
