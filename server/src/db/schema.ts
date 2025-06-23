
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const classroomObjectTypeEnum = pgEnum('classroom_object_type', [
  'desk',
  'teacher_desk',
  'whiteboard',
  'projector',
  'bookshelf',
  'cabinet',
  'plant',
  'trash_can'
]);

export const layoutTypeEnum = pgEnum('layout_type', [
  'traditional_rows',
  'u_shape',
  'grouped_tables',
  'circle',
  'horseshoe',
  'custom'
]);

// Students table
export const studentsTable = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  student_id: text('student_id'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Classrooms table
export const classroomsTable = pgTable('classrooms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  teacher_name: text('teacher_name').notNull(),
  canvas_width: real('canvas_width').notNull(),
  canvas_height: real('canvas_height').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Classroom objects table (desks, whiteboards, etc.)
export const classroomObjectsTable = pgTable('classroom_objects', {
  id: serial('id').primaryKey(),
  classroom_id: integer('classroom_id').notNull().references(() => classroomsTable.id, { onDelete: 'cascade' }),
  type: classroomObjectTypeEnum('type').notNull(),
  name: text('name').notNull(),
  position_x: real('position_x').notNull(),
  position_y: real('position_y').notNull(),
  rotation: real('rotation').notNull().default(0),
  width: real('width').notNull(),
  height: real('height').notNull(),
  color: text('color'),
  is_assignable: boolean('is_assignable').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Student assignments table (which student sits at which desk)
export const studentAssignmentsTable = pgTable('student_assignments', {
  id: serial('id').primaryKey(),
  classroom_id: integer('classroom_id').notNull().references(() => classroomsTable.id, { onDelete: 'cascade' }),
  student_id: integer('student_id').notNull().references(() => studentsTable.id, { onDelete: 'cascade' }),
  desk_object_id: integer('desk_object_id').notNull().references(() => classroomObjectsTable.id, { onDelete: 'cascade' }),
  assigned_at: timestamp('assigned_at').defaultNow().notNull()
});

// Layout templates table (predefined layouts)
export const layoutTemplatesTable = pgTable('layout_templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  layout_type: layoutTypeEnum('layout_type').notNull(),
  canvas_width: real('canvas_width').notNull(),
  canvas_height: real('canvas_height').notNull(),
  is_public: boolean('is_public').notNull().default(false),
  created_by: text('created_by').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Layout template objects table (objects in predefined layouts)
export const layoutTemplateObjectsTable = pgTable('layout_template_objects', {
  id: serial('id').primaryKey(),
  template_id: integer('template_id').notNull().references(() => layoutTemplatesTable.id, { onDelete: 'cascade' }),
  type: classroomObjectTypeEnum('type').notNull(),
  name: text('name').notNull(),
  position_x: real('position_x').notNull(),
  position_y: real('position_y').notNull(),
  rotation: real('rotation').notNull().default(0),
  width: real('width').notNull(),
  height: real('height').notNull(),
  color: text('color'),
  is_assignable: boolean('is_assignable').notNull().default(false)
});

// Relations
export const classroomsRelations = relations(classroomsTable, ({ many }) => ({
  objects: many(classroomObjectsTable),
  assignments: many(studentAssignmentsTable)
}));

export const classroomObjectsRelations = relations(classroomObjectsTable, ({ one, many }) => ({
  classroom: one(classroomsTable, {
    fields: [classroomObjectsTable.classroom_id],
    references: [classroomsTable.id]
  }),
  assignments: many(studentAssignmentsTable)
}));

export const studentsRelations = relations(studentsTable, ({ many }) => ({
  assignments: many(studentAssignmentsTable)
}));

export const studentAssignmentsRelations = relations(studentAssignmentsTable, ({ one }) => ({
  classroom: one(classroomsTable, {
    fields: [studentAssignmentsTable.classroom_id],
    references: [classroomsTable.id]
  }),
  student: one(studentsTable, {
    fields: [studentAssignmentsTable.student_id],
    references: [studentsTable.id]
  }),
  deskObject: one(classroomObjectsTable, {
    fields: [studentAssignmentsTable.desk_object_id],
    references: [classroomObjectsTable.id]
  })
}));

export const layoutTemplatesRelations = relations(layoutTemplatesTable, ({ many }) => ({
  objects: many(layoutTemplateObjectsTable)
}));

export const layoutTemplateObjectsRelations = relations(layoutTemplateObjectsTable, ({ one }) => ({
  template: one(layoutTemplatesTable, {
    fields: [layoutTemplateObjectsTable.template_id],
    references: [layoutTemplatesTable.id]
  })
}));

// Export all tables for proper query building
export const tables = {
  students: studentsTable,
  classrooms: classroomsTable,
  classroomObjects: classroomObjectsTable,
  studentAssignments: studentAssignmentsTable,
  layoutTemplates: layoutTemplatesTable,
  layoutTemplateObjects: layoutTemplateObjectsTable
};
