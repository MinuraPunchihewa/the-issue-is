import assert from 'assert';
import dotenv from 'dotenv';
import GitHubIssueCreator from 'gitHubIssueCreator';
import MindsDB from 'mindsdb-js-sdk';

describe('GitHubIssueCreator', () => {
  const mindsdb_user = process.env.MINDSDB_USER;
  const mindsdb_password =process.env.MINDSDB_PASSWORD;
  const database = 'github_ds';
  const repository = 'MinuraPunchihewa/ai-text-to-sql';
  const github_api_key = process.env.GITHUB_TOKEN;
  const model = 'openai_model';
  const title = 'Unable to turn off the telemetry feature (#102)';
  const description = 'The toggle button does not change on click.';
  const sections = 'Steps to reproduce, Expected behavior, Actual behavior';
  const lingo = 'Friendly manager';
  const style = 'concise';

  beforeAll(async () => {
    // Create the database and model
    const gitHubIssueCreator = new GitHubIssueCreator(mindsdb_user, mindsdb_password);
    await gitHubIssueCreator.connectMindsDB();
    await gitHubIssueCreator.createDatabase(database, repository, github_api_key);
    await gitHubIssueCreator.createModel(model);
  });

  afterAll(async () => {
    // Delete the database
    const databaseToDelete = await MindsDB.Databases.getDatabase(database);
    if (databaseToDelete) {
      try {
        await databaseToDelete.delete();
      } catch (error) {
        // Something went wrong while deleting the database
        console.error(error);
      }
    }

    // Delete the model
    const modelToDelete = await MindsDB.Models.getModel(model);
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
      await assert.doesNotReject(async () => {
        await gitHubIssueCreator.connectMindsDB();
      });
    });
  });

  describe('#createDatabase()', () => {
    it('should create a new database in MindsDB', async () => {
      await assert.doesNotReject(async () => {
        await gitHubIssueCreator.createDatabase(database, repository, github_api_key);
      });
    });
  });

  describe('#createModel()', () => {
    it('should create a new model in MindsDB', async () => {
      await assert.doesNotReject(async () => {
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