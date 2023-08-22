const assert = require('assert');
const GitHubIssueCreator = require('./src/gitHubIssueCreator');
import MindsDB from 'mindsdb-js-sdk';

describe('GitHubIssueCreator', () => {
  const mindsdb_user = 'mindsdb_user';
  const mindsdb_password = 'mindsdb_password';
  const database = 'github_issues';
  const repository = 'my-repo';
  const github_api_key = 'my-api-key';
  const model = 'issue_model';
  const title = 'Test issue';
  const description = 'This is a test issue.';
  const sections = 'Steps to reproduce, Expected behavior, Actual behavior';
  const lingo = 'technical';
  const style = 'concise';

  let gitHubIssueCreator;

  before(async () => {
    // Create the database and model
    gitHubIssueCreator = new GitHubIssueCreator(mindsdb_user, mindsdb_password);
    await gitHubIssueCreator.connectMindsDB();
    await gitHubIssueCreator.createDatabase(database, repository, github_api_key);
    await gitHubIssueCreator.createModel(model);
  });

  after(async () => {
    // Delete the database
    const databaseToDelete = await MindsDB.default.Databases.getDatabase(database);
    if (databaseToDelete) {
      try {
        await databaseToDelete.delete();
      } catch (error) {
        // Something went wrong while deleting the database
        console.error(error);
      }
    }

    // Delete the model
    const modelToDelete = await MindsDB.default.Models.getModel(model);
    if (modelToDelete) {
        try {
            await modelToDelete.delete();
        } catch (error) {
            // Something went wrong while deleting the model
            console.error(error);
        }
        }
  });

  describe('#connectMindsDB()', () => {
    it('should connect to MindsDB', async () => {
      assert.doesNotReject(async () => {
        await gitHubIssueCreator.connectMindsDB();
      });
    });
  });

  describe('#createDatabase()', () => {
    it('should create a new database in MindsDB', async () => {
      assert.doesNotReject(async () => {
        await gitHubIssueCreator.createDatabase(database, repository, github_api_key);
      });
    });
  });

  describe('#createModel()', () => {
    it('should create a new model in MindsDB', async () => {
      assert.doesNotReject(async () => {
        await gitHubIssueCreator.createModel(model);
      });
    });
  });

  describe('#getIssueDescription()', () => {
    it('should return a description for the given issue', async () => {
      const response = await gitHubIssueCreator.getIssueDescription(model, title, description, sections, lingo, style);
      assert.ok(response.value);
    });

    it('should throw an error if the model does not exist', async () => {
      const invalidModel = 'invalid_model';
      await assert.rejects(async () => {
        await gitHubIssueCreator.getIssueDescription(invalidModel, title, description, sections, lingo, style);
      }, { message: `Model ${invalidModel} does not exist.` });
    });
  });

  describe('#createIssue()', () => {
    it('should create a new issue in the specified database', async () => {
      assert.fail('Not implemented');
    });
  });
});