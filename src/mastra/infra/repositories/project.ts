import { inject, injectable } from "inversify";
import { DB_SYMBOL, type DB } from "../database/mongodb.js";
import type { Project} from "../../domain/aggregates/project/index.js";
import { ProjectFactory } from "../../domain/aggregates/project/index.js";

@injectable()
export class ProjectRepository {
  @inject(DB_SYMBOL)
  db!: DB;
  @inject(ProjectFactory)
  projectFactory!: ProjectFactory;
  get collection() {
    return this.db.collection("projects");
  }

  async list(props?: {
    id?: string;
    status?: string;
    name?: string;
    repoURL?: string;
  }): Promise<Project[]> {
    const filter: any = {};
    if (props?.id) {
      filter.id = props.id;
    }
    if (props?.status) {
      filter.status = props.status;
    }
    if (props?.name) {
      filter.name = { $regex: props.name, $options: "i" }; // Case-insensitive partial match
    }
    if (props?.repoURL) {
      filter.repoURL = props.repoURL;
    }

    const projects = await this.collection.find(filter).toArray();
    console.log("Projects found:", projects.length, "with filter:", filter);

    return projects.map((proj) => {
      console.log(
        `Mapping project with id: ${proj.id}, MongoDB _id: ${proj._id}`
      );
      return this.projectFactory.create({
        ...proj,
        repoURL: proj.repoURL,
      } as unknown as ConstructorParameters<typeof Project>[0]);
    });
  }


  async save(project: Project) {
    const result = await this.collection.updateOne(
      { id: project.id.value },
      { $set: project.toDTO() },
      { upsert: true }
    );
    console.log(
      `Project ${project.id.value} saved:`,
      result.acknowledged ? "success" : "failed"
    );
    return result;
  }
}
