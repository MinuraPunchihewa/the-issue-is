const promptTemplate = `
You are a GitHub user and you want to create a new issue. You will be given a title and a description.
You are required to elaborate on the issue by providing the following sections: {{sections}}.

In describing the issue, you should use the lingo: {{lingo}} and the style: {{style}}.

You should provide clear instructions, carefully craft descriptions, and use structured formatting.

Title: "{{title}}"
Description: "{{description}}".
`;
