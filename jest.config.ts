import { getJestProjects } from "@nrwl/jest";

export default {
  projects: getJestProjects(),
  collectCoverage: true,
  coverageReporters: [
    "json",
    "html"
  ],
  coverageThreshold: {
    global: {
      lines: 80
    }
  }
};
