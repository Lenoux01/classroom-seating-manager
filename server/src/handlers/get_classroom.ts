
import { type GetClassroomInput, type Classroom, type ClassroomObject, type StudentAssignment, type Student } from '../schema';

export type ClassroomWithDetails = Classroom & {
  objects: ClassroomObject[];
  assignments: (StudentAssignment & {
    student: Student;
    deskObject: ClassroomObject;
  })[];
};

export declare function getClassroom(input: GetClassroomInput): Promise<ClassroomWithDetails>;
