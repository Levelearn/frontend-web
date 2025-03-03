export interface BadgeDto {
  id: number;
  name: string;
  type: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE';
  courseId: number;
  chapterId: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddBadgeDto {
  name: string;
  type: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE';
  courseId: number;
  chapterId: number;
}

export interface UpdateBadgeDto {
  name?: string;
  type?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCE';
  courseId: number;
  chapterId: number;
}
