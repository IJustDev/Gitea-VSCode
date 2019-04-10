const ConfigParser = require("configparser");
const path = require("path");

export class RepositoryInformationManager {
    public token(rootPath: string | undefined) {
        const config = new ConfigParser();
        config.read(path.join(rootPath as string, "/.gitea/config.ini"));
        return config.get("PRIVATE", "token");
    }
    public repoApiUrl(rootPath: string | undefined) {
        const config = new ConfigParser();
        config.read(rootPath + "/.gitea/config.ini");
        const domain = config.get("REPO", "domain");
        const repo_owner = config.get("REPO", "repo_owner");
        const repo_name = config.get("REPO", "repo_name");
        const ssl = config.get("REPO", "ssl");
        const prefix = ssl ? "https" : "http";
        return prefix + "://" + domain + "/api/v1/repos/" + repo_owner + "/" + repo_name + "/issues";
    }
    public saveRepoInformation(rootPath: string | undefined, repoInformations: any) {
        const file_path = path.join(rootPath as string, ".gitea/config.ini");
        const config = new ConfigParser();
        config.addSection("PRIVATE");
        config.addSection("REPO");
        config.set("PRIVATE", "token", repoInformations.token);
        config.set("REPO", "domain", repoInformations.domain);
        config.set("REPO", "repo_owner", repoInformations.repo_owner);
        config.set("REPO", "repo_name", repoInformations.repo_name);
        config.set("REPO", "ssl", true);
        config.write(file_path, true);
    }
}
