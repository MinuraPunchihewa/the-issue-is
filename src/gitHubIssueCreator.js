import MindsDB from 'mindsdb-js-sdk';
const config = require('../config/config');

class GitHubIssueCreator {
    constructor(mindsdb_user, mindsdb_password) {
        this.mindsdb_user = mindsdb_user;
        this.mindsdb_password = mindsdb_password;
    }

    async connectMindsDB() {
        try {
            // Authenticate with MindsDB
            await MindsDB.default.connect({
                user: this.mindsdb_user,
                password: this.mindsdb_password
            });
            console.log('Connected to MindsDB.');
        } catch(error) {
            // Failed to authenticate
            console.error(error);
        }
    }

    async createDatabase(database, repository, github_api_key) {
        try {
            // Check if the database exists
            const gitHubDatabase = await MindsDB.Databases.getDatabase(database);

            // If the database doesn't exist, create it
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
            // Couldn't connect to database
            console.error(error);
        }
    }

    async createModel(model) {
        // Define the prompt template
        const promptTemplate = config.promptTemplate;       

        // Define training options
        const trainingOptions = {
            using: {
                engine: 'openai', 
                prompt_template: promptTemplate
            }
        };
        
        try{
            // Check if the model exists
            const openAIModel = await MindsDB.default.Models.getModel(model, 'mindsdb');

            // If the model doesn't exist, create it
            if (!openAIModel) {
                const openAIModel = await MindsDB.default.Models.trainModel(
                    model,
                    'generated_issue',
                    'mindsdb',
                    trainingOptions
                );
            }
        } catch (error) {
            // Couldn't create model
            console.error(error);
        }
        
        console.log(`Created OpenAI model ${model} in MindsDB.`);

        // Wait for the training to be completed
        while (openAIModel.status !== 'complete' && openAIModel.status !== 'error') {
            openAIModel = await MindsDB.default.Models.getModel(model, 'mindsdb');
        }
        
        // Check if the training was successful
        if (openAIModel.status === 'complete') {
            console.log(`Training of OpenAI model ${model} completed.`);
        }
        // If not, log the error
        else if (openAIModel.status === 'error') {
            console.error(`Training of OpenAI model ${model} failed.`);
        }
    }

    async getIssueDescription(model, title, description, sections, lingo, style) {
        // Define query options
        const queryOptions = {
            where: [
              `title = \'${title}.\'`,
              `description = \'${description}.\'`
              `sections = \'${sections}.\'`
              `lingo = \'${lingo}.\'`
              `style = \'${style}.\'`
            ]
        }

        // Check if the model exists
        const openAIModel = await MindsDB.default.Models.getModel(model, 'mindsdb');

        // If the model doesn't exist, throw an error
        if (!openAIModel) {
            throw new Error(`Model ${model} does not exist.`); 
        }

        // If the model exists, make a prediction
        response = await openAIModel.query(queryOptions);

        // Return the response
        return response.value;
    }

    async createIssue(database, title, description) {
        // Create a new issue
    }
}

module.exports = GitHubIssueCreator;