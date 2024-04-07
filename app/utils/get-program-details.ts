import { Course, Program } from "./model";
import getProgramBySlug from "./getProgram";

export async function getProgramDetails(slug: string) {
  try {
    const programData = await getProgramBySlug(slug);
    const program = programData.data[0] as Program;
    const programStartDate = program.attributes.starts! + "";
    const courses = program.attributes.courses.data as Course[];
    return {
      id: program.attributes.slug,
      name: program.attributes.name,
      startsOn: programStartDate,
      courses: courses,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(`Failed to retrieve program details: ${error}`);
  }
}
