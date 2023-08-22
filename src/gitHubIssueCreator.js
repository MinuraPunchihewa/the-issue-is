import MindsDB from 'mindsdb-js-sdk';

class GitHubIssueCreator {
    constructor(mindsdb_user, mindsdb_password) {
        this.mindsdb_user = mindsdb_user;
        this.mindsdb_password = mindsdb_password;
    }

    async connectMindsDB() {
        try {
            await MindsDB.default.connect({
                user: this.mindsdb_user,
                password: this.mindsdb_password
            });
            console.log('Connected to MindsDB.');
        } catch(error) {
            // Failed to authenticate.
            console.error(error);
        }
    }

    async createDatabase(database, repository, github_api_key) {
        try {
            const gitHubDatabase = await MindsDB.Databases.getDatabase(database);
            if (!gitHubDatabase) {
                await MindsDB.default.Databases.createDatabase(
                    database,
                    'github',
                    {
                        'repository': repository,
                        'api_key': github_api_key
                    }
                );
            }
            console.log('Connected to GitHub and created a database in MindsDB.');
        } catch (error) {
            // Couldn't connect to database.
            console.error(error);
        }
    }

    async connectOpenAI(model, lingo, style, sections) {
        // Define the prompt template
        const promptTemplate = `You are a GitHub user and you want to create a new issue. You will be given a title and a description. You are required 
        to elaborate on the issue by providing the following sections: ${sections}.\n\nIn describing the issue, you should use the lingo: ${lingo} 
        and the style: ${style}.\n\nYou should provide clear instructions, carefully craft descriptions and use structured formatting.\n\n
        Title: "{{title}}" description: "{{description}}".`          

        // Define training options
        const trainingOptions = {
            using: {
                engine: 'openai', 
                prompt_template: promptTemplate
            }
        };
        
        try{
            // Create and train a model
            let openai_model = await MindsDB.default.Models.trainModel(
                model,
                'generated_issue',
                'mindsdb',
                trainingOptions
            );
        } catch (error) {
            // Couldn't connect to database.
            console.error(error);
            let openai_model = await MindsDB.default.Models.getModel(model, 'mindsdb');
        }
        
        console.log('Created a model');

        // Wait for the training to be completed
        while (openai_model.status !== 'complete' && openai_model.status !== 'error') {
            openai_model = await MindsDB.default.Models.getModel(model, 'mindsdb');
        }

        // Checking model's status
        console.log('Model status: ' + openai_model.status);

        if (openai_model.status === 'complete') {
            this.model = openai_model;
        }        
    }

    async createIssue(title, description) {
        // Define query options
        const queryOptions = {
            where: [
              `title = \'${title}.\'`,
              `description = \'${description}.\'`
            ]
        }

        const response = await this.model.query(queryOptions);

        console.log(response.value);
    }

    async executeQuery(query) {
        try {
            const queryResult = await MindsDB.default.SQL.runQuery(query);
            if (queryResult.rows.length > 0) {
                const matchingUserRow = queryResult.rows;
                console.log(matchingUserRow);
            }
        } catch (error) {
            // Something went wrong sending the API request or executing the query.
            console.error(error);
        }
    }
}