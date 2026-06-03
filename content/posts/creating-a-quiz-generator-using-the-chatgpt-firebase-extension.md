---
title: "Creating a Quiz Generator using the ChatGPT Firebase Extension"
description: "You often want to test your knowledge whenever you're learning a new topic. You can get ready-made quizzes on the subject, but generally, they tend to be too broad. What if you..."
date: "2023-11-28T15:00:10.628Z"
slug: "creating-a-quiz-generator-using-the-chatgpt-firebase-extension"
cover: "/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/0ec05d12ee0ef77ab9794fffc5e7674a-bf553ba957.jpeg"
tags:
  - "ai"
  - "firebase"
  - "chatgpt"
  - "firebaseextensions"
draft: false
hashnodeId: "clpigsqv8000c08jx6i4sh9kc"
canonicalUrl: "https://invertase.io/blog/creating-a-quiz-generator-using-the-chatgpt-firebase-extension"
---

You often want to test your knowledge whenever you're learning a new topic. You can get ready-made quizzes on the subject, but generally, they tend to be too broad. What if you only want to test yourself on the content you've just read? This is the problem statement we will tackle in this article: given some content, how can you create a quiz based on it?

## Introduction

While helping my son with his studies, I often struggle with creating questions to ask him to test his knowledge. It has more to do with the idea of reading the content myself first, which I find tedious. I can ask the questions at the chapter's end, but that doesn't feel comprehensive enough. In these situations, I often think, "If only someone could read the chapter for me, comprehend the content, and generate relevant questions along with the answer keys".

With the advancements in AI and the recent interest in its generative capabilities (ChatGPT, Bard, etc.), I wondered if such a solution is possible using AI. To keep the experiment short, I looked for a low-code solution to achieve this, and Firebase extensions seemed like the right choice.

## What is generative AI?

As the name suggests, generative AI is a type of artificial intelligence that can create new content or data based on its learning from existing data. This new content or data can be similar to the existing data or be entirely original. It usually works by giving some content to the AI along with your instructions (generally called a prompt) on how to use that content, and the AI gives back an appropriate response.

Now that you know about generative AI, you should have a basic idea about the approach you'll need to take to get the desired results. Let's break it down into steps

1. Get the text content from the user for which they want to generate questions
    
2. Pass the content along with a suitable instruction set to the AI
    
3. Parse the response from the AI and present it to the user in a suitable format
    

## Implementation

The implementation of the quiz generator is quite simple: use a `textarea` to get the text content from the user and pass it to the configured ChatGPT Firebase extension. You can configure the said extension as shown below.

### Configuring the ChatGPT extension

Go to the [Firebase extensions hub](https://extensions.dev/), search for chat in the search box, and click "Chatbot with ChatGPT" from the search results.

![Searching chat in the Firebase extensions hub](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/21516aa4-ae33-4701-be5d-19db6f15d8a5-3e83b1553d.png)

You can install this extension from the extension page in one of your Firebase projects. Click on the **"Install in Firebase console"** button, select your project from the new tab that opens up, and complete the steps for installing the extension into the project.

![installing the ChatGPT extension](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/b5af5ab3-06a2-4817-bb97-b1408bf74556-6493d4696e.png)

Click the **Next** button. This extension creates a cloud function called to generate a response, and we need to enable the **Secrets Manager API** to store our OpenAI API Key securely. Based on the current state of your project, you may need to enable other APIs (Cloud Functions, Artifact Registry, etc.). Click **Enable** and then click **Next**

![ChatGPT extension prerequisites](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/c10fe156-c127-4784-a024-353c06430e7a-f5d4c5312f.png)

Next, the extension needs to use **Cloud Firestore** (If you haven't created a Cloud Firestore yet, it will create one for you in datastore mode. For using it with Firebase, you'll need to change it back to the native mode from Google Cloud Console) and **Secrets Manager** to process the input text, the OpenAI API response, and the stored OpenAI API key. Click **Next**

![ChatGPT extension permissions](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/3763bc1c-7eca-4ae2-952f-f81cd3d0d6f4-4e99a6bb06.png)

Finally, we need to configure the extension. You need to configure the following

1. Add your OpenAI API Key (you can create it [here](https://platform.openai.com/account/api-keys)). Make sure to click on the **Create Secret** button to create a secret in the **Secrets Manager**
    
2. Select the desired model (**GPT 3.5/4**)
    
3. Set the **temperature** to a low value (**0.2-0.4**). The temperature value (allowed range 0-2) dictates the randomness of the AI response; higher values make the output more random. I used a temperature of **0.3**.
    
4. Set the cloud function location (ideally set it to the exact location where your Cloud Firestore is located)
    
5. You'll also need to configure the collection path and the field names where the input text and the API response will be stored. For this test, I used requests as the collection name and left the field names as it is.
    

We can leave the rest of the settings as it is and click on the **Install extension** button. Wait for the installation to complete; now we're ready to test it.

### Testing the extension

To test the extension you need to create the collection that you configured in the last section (**requests** in my case) and add a prompt field to it.

![Creating the requests collection](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/ead22a09-dfc9-481e-9e48-35db121f0d7a-319d7c24a0.png)

![Adding a request to the requests collection](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/520e6731-6cdc-48b3-81e6-86c4dcac21e3-68edc95d08.png)

The way this extension works is:

1. You add the input text and your instructions to the prompt field
    
2. The cloud function (`generateAIResponse`) created by the extension gets invoked automatically
    
3. The function sends your prompt to the OpenAI API and creates a status field (of type map) with its state key set to `PROCESSING`
    
4. On a successful response from the API call, the state is changed to `COMPLETED` and the API call output is stored in a new field named response
    

### Prompt Structure

How do you structure your prompt? A good prompt should start by setting a context so that ChatGPT behaves accordingly. Then, you state your requirement, followed by the input text, and finally, you give a response cue to the AI.

To summarize, you can use the below prompt structure

`Context + Instruction + Input Text + Response Cue`

For the quiz generator, you can use the following initial prompt

```markdown
“You're a teacher who needs to create quizzes to test your student's
knowledge. Using the given text content create several distinct MCQs for the
purpose.

The content: {{text_content}}

Your response:”
```

The above prompt generates a response in a format similar to the one below. Please note that the format may vary slightly for you.

```markdown
1. question text
    a) Option 1
    b) Option 2
    ...
...
```

This is a very good start, but the API is not returning the answers to these questions. Also, it is difficult to use it as a quiz as the response lacks structure.

### Structuring the response

For better control over the whole thing, you need a structured response, such as a JSON formatted output, from the ChatGPT API call. Tweak the instruction part of your prompt to the following:

```markdown
Using the given text content creates several distinct MCQs for the purpose. 
Return your response as an RFC8259-compliant JSON array using the structure
[{"question": "the question", "choices": ["choice 1", "choice 2", ...],
"answer": "the correct choice"}, {...}]
```

Here I’ve intentionally removed any spaces from the JSON to save some tokens from the response. Rerunning the same test with the changed instruction gives us the desired structured result. Now, you can display the questions & the choices in any way you want using your favourite technology. As you have the answer key, you can also convert these questions into a quiz.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Once in a while, you might get invalid API responses, like extra text in the response, and so on. <em>You can further play around with your instructions to eliminate or minimize such cases.</em></div>
</div>

## Using images as content

You can extend it further and use images that contain text (say, a snapshot of a book's pages) as the starting point of the quiz generator. The underlying approach of the solution remains the same; you're just adding a step at the beginning. Using another Firebase extension, you can extract the text from an image and use that as input like before.

### Configuring the Cloud Vision extension

Go back to the [Firebase extensions hub](https://extensions.dev/), search for **vision,** and click on "**Extract Image Text with Cloud Vision AI**" from the search results. Install the extension by following the steps you completed for the previous extension.

![Installing the Cloud Vision extension](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/8126899d-0d7b-41fc-a327-7edf18dfe370-09f376bb2a.png)

This extension enables Google's Cloud Vision API and creates a new cloud function named `extractText`. Apart from the **Cloud Firestore User** permission, it also needs the **Storage Admin** permission (the extension reads the images from Cloud Storage).

![Cloud Vision extension permissions](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/94f08ce3-7c10-4ca8-ac27-2d329108d1a7-f42fc916d7.png)

Finally, configure the extension as follows (you should keep your cloud function's location near your Cloud Storage/Firestore's location). You can leave the rest of the settings as it is and install the extension

![Configuring the cloud vision extension](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/083ad8da-7066-461c-97a7-7e761719f3b6-67b6897678.png)

Once the extension has finished installing, you can test it out by uploading an image to your cloud storage bucket under the **snapshots** folder. A few seconds after adding the image, you should see a new collection, `extractedText` with a single document containing the text that was extracted from the image.

For my test, I used the following screenshot

![test screenshot](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/8b06015f-7484-4d05-b06f-84819c33e4d5-a62c797bc8.png)

And this is the result of the Cloud Vision extension

![result from Cloud Vision API](/images/posts/creating-a-quiz-generator-using-the-chatgpt-firebase-extension/cde08310-7d9c-4e6c-8afc-3d49859ee972-b030e8a444.png)

You can use this text as input to the ChatGPT extension and generate questions as before.

## Conclusion

Firebase extensions are powerful low-code options for many different use cases. As we saw in this article, leveraging the power of ChatGPT and Cloud Vision extensions could make the basic quiz generator functionality work without writing a single line of code.

Now, you can integrate Cloud Storage and Firestore into your front end to create a personalized and engaging quiz generator that generates relevant questions based on the given content.

I hope you liked reading the article. If you've questions or just want to say hi, just drop a message in the comments section.

*\-- Keep adding the bits, soon you'll have more bytes than you may need. :-)*
