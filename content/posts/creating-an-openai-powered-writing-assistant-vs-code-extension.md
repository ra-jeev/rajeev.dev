---
title: "Creating an OpenAI powered Writing Assistant for VS Code"
description: "Rabbit holes are many, and as a developer, you keep falling into one or the other during your journey. This is not necessarily a bad thing—granted that it may frustrate you—that..."
date: "2023-06-19T20:19:25.949Z"
slug: "creating-an-openai-powered-writing-assistant-vs-code-extension"
cover: "/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/b2749874-26ba-49da-9a07-ef174c979231-e1d533e1e6.png"
tags:
  - "javascript"
  - "typescript"
  - "openai"
  - "vscode-extensions"
  - "chatgpt"
draft: false
hashnodeId: "clj3avb7h000j09l4fc3j2uk8"
---

Rabbit holes are many, and as a developer, you keep falling into one or the other during your journey. This is not necessarily a bad thing—granted that it may frustrate you—that is how you learn something extra (the 0.01 of 1.01<sup>365</sup>). This is one such story where my urge to create something new pushed me into writing a brand new VS Code extension.

## Introduction

I've always wondered how a VS Code extension works and what it takes to implement one. Recently this urge got the best of me and I decided to finally create a VS Code extension. But what to build? I like using Hashnode's AI editor for rephrasing texts and other writing assistance, so I thought why not implement a similar functionality for VS Code? Since writing assistance is most useful for a markdown file (which can also work as a blog post), I created a basic writing assistant for markdown (and text) files.

Here is a simple GIF showcasing how the extension works.

![Write Assist AI working gif](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/d8a0ae80-fa3e-4b76-ba45-89146a35ef6b-270734e4f0.gif)

Ready to dive into how I implemented it? Let's get started.

## Getting Started

Before we can start building the extension, we need to gather and prepare the necessary tools. In this case, the needed tools are node, git, [yeoman](https://yeoman.io/) and [generator-code](https://www.npmjs.com/package/generator-code). For a newcomer like myself, [this basic tutorial](https://code.visualstudio.com/api/get-started/your-first-extension) is perfect. I recommend going through it to learn the fundamentals.

Run `yo code` command and pick `New Extension (js/ts)` from the choices as shown below

![yo code command choices](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/103a52d9-c518-4e23-8694-fae49d972fce-1e72801190.png)

![All steps of the yo code command](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/569c6d97-1a09-4c45-8fe9-9e0e9ddc73a8-c9e17c625f.png)

I haven't selected the `webpack` option yet. We can always do so later on. This is my current directory structure.

![Basic directory structure for a VS Code extension](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/efee7119-e8fc-4bdd-9640-9507fc7197ed-d2d2ac73cb.png)

## Implementing the extension

We're mostly interested in the `package.json` and `extension.ts` files while building the extension. The important fields in the package.json file are

1. **activationEvents**: When should our extension be activated
    
2. **main**: The entry point of the extension code (the entry is in the `out` folder which gets generated when you debug or run the extension)
    
3. **contributes**: What does this extension contributes to the VS Code commands and settings
    

![package.json fields](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/5d4626a4-1d24-4809-9080-03883ff31b23-0a34819095.png)

For my extension I wanted an experience similar to the Hashnode AI Editor, so adding commands to the VS Code command palette was not what I was after. What helped me here was the sample extensions directory on [GitHub](https://github.com/microsoft/vscode-extension-samples/). Their [code-actions](https://github.com/microsoft/vscode-extension-samples/tree/main/code-actions-sample) sample was exactly what I had in mind (and it targets only the markdown files).

### Target Markdown and Text files

To target specific types of files you need to change the `activationEvents`. Since we want to work only with `Markdown` and `Text` files at the moment, this is what my `package.json` says

```json
// ...
"activationEvents": [
  "onLanguage:markdown",
  "onLanguage:plaintext"
],
"main": "./out/extension.js",
"contributes": {},
// ...
```

This extension will only get activated for the languages mentioned above.

Also, since we don't want any command palette commands, we can remove everything under the `contributes` key.

### Showing the actions in the light bulb menu

There is one function called `activate` inside the `extension.ts` file which is of interest. This is where you need to write your code. Notice that I've removed all the unnecessary boilerplate code

```typescript
// This method is called when your extension is activated
// Your extension is activated the very first time the 
// command is executed
export function activate(context: vscode.ExtensionContext) {}
```

There is another complementary function called `deactivate` which can be used if you need to do any kind of resource cleaning before the extension is deactivated.

If you run/debug the extension now, and create a new markdown file in the new VS Code window which pops up, you won't notice any difference as there is no palette command, and also there is no code in the `activate` function. Let's change that and add the following in the `extension.ts` file

```typescript
class MyCodeActionProvider implements vscode.CodeActionProvider {
  
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    console.log('inside the provideCodeActions method');
    throw new Error('Method not implemented.');
  }
}

export function activate(context: vscode.ExtensionContext) {
  const actionProvider = vscode.languages.registerCodeActionsProvider(
    ['markdown', 'plaintext'],
    new MyCodeActionProvider(),
    {
      providedCodeActionKinds: [
        vscode.CodeActionKind.RefactorRewrite,
        vscode.CodeActionKind.QuickFix,
      ],
    }
  );

  context.subscriptions.push(actionProvider);
}
```

What we're doing here is informing VS Code about the kind of code actions we're providing which include `RefactorRewrite` & `QuickFix`. The actual `"commands/code actions"` need to be provided by the `provideCodeActions` method of the `MyCodeActionProvider` class. If you debug the extension now you should see the below console log in your original project window's debug console.

```plaintext
inside the provideCodeActions method
```

We're making progress. Replace the `provideCodeActions` method's code with the following

```typescript
provideCodeActions(
  document: vscode.TextDocument,
  range: vscode.Range | vscode.Selection,
  context: vscode.CodeActionContext,
  token: vscode.CancellationToken
): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
  // If there is nothing selected, we won't provide any action
  if (range.isEmpty) {
    return;
  }

  // supported actions and their kinds
  const actions = [
    {
      id: 'rephrase',
      title: 'Rephrase selected text',
      kind: vscode.CodeActionKind.QuickFix,
    },
    {
      id: 'headlines',
      title: 'Suggest headlines',
      kind: vscode.CodeActionKind.QuickFix,
    },
    {
      id: 'professional',
      title: 'Rewrite in professional tone',
      kind: vscode.CodeActionKind.RefactorRewrite,
    },
    {
      id: 'casual',
      title: 'Rewrite in casual tone',
      kind: vscode.CodeActionKind.RefactorRewrite,
    },
  ];

  const cActions = [];
  // prepare the code actions for the above actions
  for (const action of actions) {
    const cAction = new vscode.CodeAction(action.title, action.kind);
    cAction.command = {
      command: `my-shiny-extension.${action.id}`,
      title: action.title,
      arguments: [action.id],
    };

    cActions.push(cAction);
  }

  return cActions;
}
```

Debug/run the extension now and you should see the above actions in the bulb tooltip when you select some text in a markdown/text file.

![code action window intermediate view](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/5b8b0741-8035-46e9-a57d-39e97d9d7af1-90f809ff51.png)

Of course, nothing will happen if you click on any of these actions. This is because we've only created the actions, but haven't written any code to handle them.

### Handling the Code Actions

To handle the actions we need to register these commands with the VS Code extension context. This can be done inside the `activate` function. Let's do a little bit of refactoring.

Move the actions out of the `provideCodeActions` method and make it a class property of `MyCodeActionProvider`

```typescript
public static readonly actions = [
  {
    id: 'rephrase',
    title: 'Rephrase selected text',
    kind: vscode.CodeActionKind.QuickFix,
  },
  {
    id: 'headlines',
    title: 'Suggest headlines',
    kind: vscode.CodeActionKind.QuickFix,
  },
  {
    id: 'professional',
    title: 'Rewrite in professional tone',
    kind: vscode.CodeActionKind.RefactorRewrite,
  },
  {
    id: 'casual',
    title: 'Rewrite in casual tone',
    kind: vscode.CodeActionKind.RefactorRewrite,
  },
];
```

Change its reference inside the `provideCodeActions` method to

```typescript
for (const action of MyCodeActionProvider.actions) {
  // ...
}
```

Add a new method `handleAction` which will handle the actions when a user clicks on them. The `actionId` argument will be passed by the caller. Remember we had passed `arguments: [action.id]` while returning the code actions from the `providecodeActions` method?

```typescript
handleAction(actionId: string) {
  console.log(`handleAction for ${actionId}`);
}
```

Now change the `activate` function as shown below

```typescript
export function activate(context: vscode.ExtensionContext) {
  const myActionProvider = new MyCodeActionProvider();
  const actionProvider = vscode.languages.registerCodeActionsProvider(
    ['markdown', 'plaintext'],
    myActionProvider,
    {
      providedCodeActionKinds: [
        vscode.CodeActionKind.RefactorRewrite,
        vscode.CodeActionKind.QuickFix,
      ],
    }
  );

  context.subscriptions.push(actionProvider);
  for (const action of MyCodeActionProvider.actions) {
    context.subscriptions.push(
      // use the same id which we used in the command field 
      // of the code actions
      vscode.commands.registerCommand(
        `my-shiny-extension.${action.id}`,
        (args) => myActionProvider.handleAction(args)
      )
    );
  }
}
```

For all the actions which we support, we're registering a corresponding command with the VS Code extension context. The command id that we use here must match the command id which we returned from the `provideCodeActions` method.

If we run/debug the extension now and click any of our actions from the light bulb menu we should see the corresponding console log in the debug console.

### Integrating with the OpenAI APIs

Now the only thing remaining is: using the OpenAI APIs to make changes to any written text. Let's get it over with.

Add the OpenAI library to the codebase

```bash
yarn add openai
```

Import it into the `extension.ts` file

```typescript
import { OpenAIApi, Configuration } from 'openai';
```

And replace the `handleAction` method's code with the following

```typescript
async handleAction(actionId: string) {
  const editor = vscode.window.activeTextEditor;
  if (
    !editor ||
    editor.selection.isEmpty ||
    !['rephrase', 'headlines', 'professional', 'casual'].includes(actionId)
  ) {
    // return if no active editor, or no active selection 
    // or if unsupported actionId passed
    return;
  }

  // Create the OpenAI Service
  const openAiSvc = new OpenAIApi(
    new Configuration({
      apiKey: '<your_open_ai_api_key>',
    })
  );

  // Get the currently selected text
  const text = editor.document.getText(editor.selection);
  // current selection range
  let currRange = editor.selection;

  try {
    // Adding a filler/loading text before making the API call
    const fillerText = '\n\nThinking...';
    editor
      .edit((editBuilder) => {
        // insert the filler text after the current selection end
        editBuilder.insert(currRange.end, fillerText);
      })
      .then((success) => {
        if (success) {
          // Select the filler text now
          editor.selection = new vscode.Selection(
            editor.selection.end.line,
            0,
            editor.selection.end.line,
            editor.selection.end.character
          );

          // store this new selection range
          currRange = editor.selection;
        }
      });

    // Create the prompt prefix based on the action id
    let promptPrefix = '';
    switch (actionId) {
      case 'rephrase':
        promptPrefix =
          'Rephrase the following text and make the sentences more clear and readable';
        break;
      case 'headlines':
        promptPrefix = 'Suggest some short headlines for the following text';
        break;
      case 'professional':
        promptPrefix =
          'Make the following text better and rewrite it in a professional tone';
        break;
      case 'casual':
        promptPrefix =
          'Make the following text better and rewrite it in a casual tone';
        break;
    }

    // Make the OpenAI API Call using the desired model and configs
    /* eslint-disable @typescript-eslint/naming-convention */
    const response = await openAiSvc.createCompletion({
      model: 'text-davinci-003',
      prompt: `${promptPrefix}:\n\n${text}\n\n`,
      temperature: 0.3,
      max_tokens: 500,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      n: 1,
    });
    /* eslint-enable @typescript-eslint/naming-convention */

    // We'd reuqested for only one result, use that
    let result = response.data.choices[0].text;
    editor
      .edit((editBuilder) => {
        if (result) {
          // replace the filler text with the actual result
          editBuilder.replace(
            new vscode.Range(currRange.start, currRange.end),
            result.trim()
          );
        }
      })
      .then((success) => {
        if (success) {
          // Select the resulting text (the text can be longer
          // and span over multiple lines, so we treat it 
          // appropriately to make a complete selection)
          editor.selection = new vscode.Selection(
            currRange.start.line,
            currRange.start.character,
            currRange.end.line,
            editor.document.lineAt(currRange.end.line).text.length
          );

          return;
        }
      });
  } catch (error) {
    console.error(error);
  }

  // In case of API error, show an error text instead
  editor.edit((editBuilder) => {
    editor.selection = new vscode.Selection(currRange.start, currRange.end);
    editBuilder.replace(editor.selection, 'Failed to process...');
  }):
}
```

And we're done with the code. If you run/debug the extension you should see appropriate text replacements for your text. Running it on a couple of my sentences gives me the following results

![Result of running the extension](/images/posts/creating-an-openai-powered-writing-assistant-vs-code-extension/63f92d9c-f86d-45bb-9069-514c6128c113-3f94006919.png)

As always, you can play around with the prompts and get better consistent output from the OpenAI API.

### Adding Extension Settings

You may have noticed that we've added the OpenAI API key directly in the code. We should move it to VS Code settings under our extension name. To do that we need to change the `contributes` key in the `package.json` file. While we're doing that we can also move the `maxTokens` property instead of hardcoding it to `500` in the code.

```json
// ..
"contributes": {
  "configuration": {
    "title": "My Shiny Extension",
    "properties": {
      "myShinyExtension.openAiApiKey": {
        "type": "string",
        "default": "",
        "description": "Enter you OpenAI API Key here"
      },
      "myShinyExtension.maxTokens": {
        "type": "number",
        "default": 1200,
        "description": "Enter the maximum number of tokens to use for each OpenAI API call"
      }
    }
  }
},
// ..
```

Now these two entries will appear under "`My Shiny Extension`" in the VS Code settings. To read the values of these entries we can use the below code (put it just above the OpenAI service creation).

```typescript
const configs = vscode.workspace.getConfiguration('myShinyExtension');
const openAIApiKey = configs.get<string>('openAiApiKey');
const maxTokens = configs.get<number>('maxTokens');
if (!openAIApiKey) {
  vscode.window.showErrorMessage(
    'Missing OpenAI API Key. Please add your key in VSCode settings to use this extension.'
  );

  return;
}
```

Do remember that we're creating the OpenAI service instance on each API call. This is not optimal and you should move it to the constructor and handle the error scenarios appropriately.

## Conclusion

As is evident from the article, developing a VS Code extension can be easy and fun. If you're observant you can recreate an existing thing (Hashnode AI editor in this case) in your way someplace else, and learn a ton along the way.

To publish an extension we need to complete a few more steps and optionally bundle it using `webpack` or a suitable bundler. To learn more about the process you can visit these links: 1. [publishing an extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension), 2. [Bundling an extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)

This was just a sneak peek of the extension I created. If interested, you can look at the complete source code of the extension [here](https://github.com/ra-jeev/write-assist-ai).

If you want to try out the extension (Write Assist AI), you can get it from [here](https://marketplace.visualstudio.com/items?itemName=ra-jeev.write-assist-ai).

I hope you liked reading the article. If you found any mistakes in the article, please let me know in the comments. Your suggestions and feedback are most welcome.

*\-- Keep adding the bits, soon you'll have more bytes than you may need. :-)*
