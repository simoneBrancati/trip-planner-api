import cors, { CorsOptions } from "cors";

export const getGithubPageCors = (
  methods: Array<"GET" | "POST" | "PUT" | "DELETE" | "OPTIONS">,
) => {
  const options: CorsOptions = {
    origin: "https://simonebrancati.github.io/trip-planner-api",
    methods,
  };
  return cors(options);
};
