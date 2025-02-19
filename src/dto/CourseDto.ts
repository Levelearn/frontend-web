export interface CourseDto {
  id: number,
  code: string,
  name: string,
  createdAt: string,
  updatedAt: string,
}

export interface AddCourseDto {
  code: string,
  name: string,
}

export interface UpdateCourseDto {
  code? : string;
  name? : string;
}