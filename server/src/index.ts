
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createStudentInputSchema,
  createClassroomInputSchema,
  getClassroomInputSchema,
  updateClassroomInputSchema,
  createClassroomObjectInputSchema,
  updateClassroomObjectInputSchema,
  deleteClassroomObjectInputSchema,
  createStudentAssignmentInputSchema,
  deleteStudentAssignmentInputSchema,
  randomizeAssignmentsInputSchema,
  createLayoutTemplateInputSchema,
  loadLayoutTemplateInputSchema
} from './schema';

// Import handlers
import { createStudent } from './handlers/create_student';
import { getStudents } from './handlers/get_students';
import { createClassroom } from './handlers/create_classroom';
import { getClassrooms } from './handlers/get_classrooms';
import { getClassroom } from './handlers/get_classroom';
import { updateClassroom } from './handlers/update_classroom';
import { createClassroomObject } from './handlers/create_classroom_object';
import { updateClassroomObject } from './handlers/update_classroom_object';
import { deleteClassroomObject } from './handlers/delete_classroom_object';
import { createStudentAssignment } from './handlers/create_student_assignment';
import { deleteStudentAssignment } from './handlers/delete_student_assignment';
import { randomizeAssignments } from './handlers/randomize_assignments';
import { getLayoutTemplates } from './handlers/get_layout_templates';
import { createLayoutTemplate } from './handlers/create_layout_template';
import { loadLayoutTemplate } from './handlers/load_layout_template';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Student management
  createStudent: publicProcedure
    .input(createStudentInputSchema)
    .mutation(({ input }) => createStudent(input)),
  getStudents: publicProcedure
    .query(() => getStudents()),

  // Classroom management
  createClassroom: publicProcedure
    .input(createClassroomInputSchema)
    .mutation(({ input }) => createClassroom(input)),
  getClassrooms: publicProcedure
    .query(() => getClassrooms()),
  getClassroom: publicProcedure
    .input(getClassroomInputSchema)
    .query(({ input }) => getClassroom(input)),
  updateClassroom: publicProcedure
    .input(updateClassroomInputSchema)
    .mutation(({ input }) => updateClassroom(input)),

  // Classroom object management
  createClassroomObject: publicProcedure
    .input(createClassroomObjectInputSchema)
    .mutation(({ input }) => createClassroomObject(input)),
  updateClassroomObject: publicProcedure
    .input(updateClassroomObjectInputSchema)
    .mutation(({ input }) => updateClassroomObject(input)),
  deleteClassroomObject: publicProcedure
    .input(deleteClassroomObjectInputSchema)
    .mutation(({ input }) => deleteClassroomObject(input)),

  // Student assignment management
  createStudentAssignment: publicProcedure
    .input(createStudentAssignmentInputSchema)
    .mutation(({ input }) => createStudentAssignment(input)),
  deleteStudentAssignment: publicProcedure
    .input(deleteStudentAssignmentInputSchema)
    .mutation(({ input }) => deleteStudentAssignment(input)),
  randomizeAssignments: publicProcedure
    .input(randomizeAssignmentsInputSchema)
    .mutation(({ input }) => randomizeAssignments(input)),

  // Layout template management
  getLayoutTemplates: publicProcedure
    .query(() => getLayoutTemplates()),
  createLayoutTemplate: publicProcedure
    .input(createLayoutTemplateInputSchema)
    .mutation(({ input }) => createLayoutTemplate(input)),
  loadLayoutTemplate: publicProcedure
    .input(loadLayoutTemplateInputSchema)
    .mutation(({ input }) => loadLayoutTemplate(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
