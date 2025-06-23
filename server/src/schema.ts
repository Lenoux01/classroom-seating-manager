
import { z } from 'zod';

// Enum for classroom object types
export const classroomObjectTypeSchema = z.enum([
  'desk',
  'teacher_desk',
  'whiteboard',
  'projector',
  'bookshelf',
  'cabinet',
  'plant',
  'trash_can'
]);

export type ClassroomObjectType = z.infer<typeof classroomObjectTypeSchema>;

// Enum for predefined layout types
export const layoutTypeSchema = z.enum([
  'traditional_rows',
  'u_shape',
  'grouped_tables',
  'circle',
  'horseshoe',
  'custom'
]);

export type LayoutType = z.infer<typeof layoutTypeSchema>;

// Position schema for object coordinates
export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
  rotation: z.number().default(0) // rotation in degrees
});

export type Position = z.infer<typeof positionSchema>;

// Student schema
export const studentSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().nullable(),
  student_id: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Student = z.infer<typeof studentSchema>;

// Classroom schema
export const classroomSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  teacher_name: z.string(),
  canvas_width: z.number().positive(),
  canvas_height: z.number().positive(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Classroom = z.infer<typeof classroomSchema>;

// Classroom object schema
export const classroomObjectSchema = z.object({
  id: z.number(),
  classroom_id: z.number(),
  type: classroomObjectTypeSchema,
  name: z.string(),
  position_x: z.number(),
  position_y: z.number(),
  rotation: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  color: z.string().nullable(),
  is_assignable: z.boolean(), // true for desks that can have students assigned
  created_at: z.coerce.date()
});

export type ClassroomObject = z.infer<typeof classroomObjectSchema>;

// Student assignment schema
export const studentAssignmentSchema = z.object({
  id: z.number(),
  classroom_id: z.number(),
  student_id: z.number(),
  desk_object_id: z.number(),
  assigned_at: z.coerce.date()
});

export type StudentAssignment = z.infer<typeof studentAssignmentSchema>;

// Layout template schema
export const layoutTemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  layout_type: layoutTypeSchema,
  canvas_width: z.number().positive(),
  canvas_height: z.number().positive(),
  is_public: z.boolean(),
  created_by: z.string(),
  created_at: z.coerce.date()
});

export type LayoutTemplate = z.infer<typeof layoutTemplateSchema>;

// Layout template object schema
export const layoutTemplateObjectSchema = z.object({
  id: z.number(),
  template_id: z.number(),
  type: classroomObjectTypeSchema,
  name: z.string(),
  position_x: z.number(),
  position_y: z.number(),
  rotation: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  color: z.string().nullable(),
  is_assignable: z.boolean()
});

export type LayoutTemplateObject = z.infer<typeof layoutTemplateObjectSchema>;

// Input schemas for creating entities
export const createStudentInputSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().nullable(),
  student_id: z.string().nullable()
});

export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export const createClassroomInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  teacher_name: z.string().min(1),
  canvas_width: z.number().positive(),
  canvas_height: z.number().positive()
});

export type CreateClassroomInput = z.infer<typeof createClassroomInputSchema>;

export const createClassroomObjectInputSchema = z.object({
  classroom_id: z.number(),
  type: classroomObjectTypeSchema,
  name: z.string().min(1),
  position_x: z.number(),
  position_y: z.number(),
  rotation: z.number().default(0),
  width: z.number().positive(),
  height: z.number().positive(),
  color: z.string().nullable(),
  is_assignable: z.boolean().default(false)
});

export type CreateClassroomObjectInput = z.infer<typeof createClassroomObjectInputSchema>;

export const createStudentAssignmentInputSchema = z.object({
  classroom_id: z.number(),
  student_id: z.number(),
  desk_object_id: z.number()
});

export type CreateStudentAssignmentInput = z.infer<typeof createStudentAssignmentInputSchema>;

export const createLayoutTemplateInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  layout_type: layoutTypeSchema,
  canvas_width: z.number().positive(),
  canvas_height: z.number().positive(),
  is_public: z.boolean().default(false),
  created_by: z.string().min(1),
  objects: z.array(z.object({
    type: classroomObjectTypeSchema,
    name: z.string().min(1),
    position_x: z.number(),
    position_y: z.number(),
    rotation: z.number().default(0),
    width: z.number().positive(),
    height: z.number().positive(),
    color: z.string().nullable(),
    is_assignable: z.boolean().default(false)
  }))
});

export type CreateLayoutTemplateInput = z.infer<typeof createLayoutTemplateInputSchema>;

// Update schemas
export const updateClassroomObjectInputSchema = z.object({
  id: z.number(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  rotation: z.number().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  color: z.string().nullable().optional(),
  name: z.string().optional()
});

export type UpdateClassroomObjectInput = z.infer<typeof updateClassroomObjectInputSchema>;

export const updateClassroomInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  teacher_name: z.string().min(1).optional(),
  canvas_width: z.number().positive().optional(),
  canvas_height: z.number().positive().optional()
});

export type UpdateClassroomInput = z.infer<typeof updateClassroomInputSchema>;

// Randomize assignment input schema
export const randomizeAssignmentsInputSchema = z.object({
  classroom_id: z.number(),
  student_ids: z.array(z.number()),
  desk_object_ids: z.array(z.number())
});

export type RandomizeAssignmentsInput = z.infer<typeof randomizeAssignmentsInputSchema>;

// Load template input schema
export const loadLayoutTemplateInputSchema = z.object({
  template_id: z.number(),
  classroom_id: z.number()
});

export type LoadLayoutTemplateInput = z.infer<typeof loadLayoutTemplateInputSchema>;

// Query input schemas
export const getClassroomInputSchema = z.object({
  id: z.number()
});

export type GetClassroomInput = z.infer<typeof getClassroomInputSchema>;

export const deleteStudentAssignmentInputSchema = z.object({
  id: z.number()
});

export type DeleteStudentAssignmentInput = z.infer<typeof deleteStudentAssignmentInputSchema>;

export const deleteClassroomObjectInputSchema = z.object({
  id: z.number()
});

export type DeleteClassroomObjectInput = z.infer<typeof deleteClassroomObjectInputSchema>;
