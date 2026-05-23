---
title: "Building Vhisper: Voice Notes App with AI Transcription and Post-Processing"
description: "After wrapping up my last project—a chat interface to search GitHub—I found myself searching for the next idea to tackle. As a developer, inspiration often comes unexpectedly, a..."
date: "2024-11-28T19:28:53.835Z"
slug: "building-voice-notes-app-with-ai-transcription-and-post-processing"
cover: "/images/posts/building-voice-notes-app-with-ai-transcription-and-post-processing/9f989586-15d7-4cba-862d-edc11882aee4-9c9c98a588.png"
tags:
  - "cloudflare"
  - "ai"
  - "nuxt"
  - "nuxthub"
  - "nuxtui"
draft: false
hashnodeId: "cm41pk3m3000k09l8g5kre7ep"
---

After wrapping up my last project—a [chat interface to search GitHub](https://rajeev.dev/building-a-chat-interface-to-search-github)—I found myself searching for the next idea to tackle. As a developer, inspiration often comes unexpectedly, and this time, it struck while scrolling through my GitHub feed. A repo, starred by Daniel Roe (Nuxt Core Team Lead), caught my eye. It was an [Electron-based voice notes app](https://github.com/egoist/whispo) designed for macOS.

Something about the simplicity of voice notes combined with the technical challenge intrigued me. Could I take this concept further? Could I build a modern, AI-powered voice notes app using web technologies? That urge to build led me here, to this blog post, where I’ll walk you through building **Vhisper**, a voice notes app with AI transcription and post-processing, built with the Nuxt ecosystem and powered by Cloudflare.

And before you say it, I must make a confession: *“Hi! My name is Rajeev, and I am addicted to talking/chatting.”.*

![A bear confessing to its addiction](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDJzcGdtYWJkeHhobDRzYzJ3MzhmZG8zNHczcThobmcxZnVrd3EyZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C4CI97S8sKstW/giphy.gif)

## Project Overview

Now that the formalities are done, let’s focus on what we’ll be building in this project. The goal is to create **Vhisper**, a web-based voice notes application with the following core features:

* **Recording Voice Notes**: Users can record voice notes directly in the browser.
    
* **AI-Powered Transcription**: Each recording is processed via Cloudflare Workers AI, converting speech to text.
    
* **Post-Processing with Custom Prompts**: Users can customize how transcriptions are refined using an AI-driven post-processing step.
    
* **Seamless Data Management (CRUD)**: Notes and audio files are efficiently stored using Cloudflare’s D1 database and R2 storage.
    

To give you a better sense of what we’re aiming for, here’s a quick demo showcasing Vhisper’s main features:

::media-embed
---
url: https://youtu.be/7IcwTIrHIPg
---
:: 

You can experience it live here: [https://vhisper.nuxt.dev](https://vhisper.nuxt.dev)

By the end of this guide, you’ll know exactly how to build and deploy this voice notes app using **Nuxt**, **NuxtHub** and **Cloudflare services**—a stack that combines innovation with developer-first simplicity. Ready to build it? Let’s get started!

## Project Setup

Before setting up the project let’s review the technologies used to build this app:

1. [Nuxt](https://nuxt.com): Vue.js framework for the application foundation
    
2. [Nuxt UI (v3)](https://ui3.nuxt.com): For creating a polished and professional frontend
    
3. [Drizzle](https://orm.drizzle.team): Database ORM
    
4. [Zod](https://zod.dev): For client/server side data validation
    
5. [NuxtHub](https://hub.nuxt.com): Backend (`database`, `storage`, `AI` etc.), deployment and administration platform for Nuxt
    
6. [Cloudflare](https://developers.cloudflare.com): Powers NuxtHub to provide various services
    

### Prerequisites

To follow along, apart from basic necessities like Node.js, npm, and some Nuxt knowledge, you’ll need:

1. A **Cloudflare account** to use Workers AI and deploy your project. If you don’t have one, you can set it up [**here**](https://www.cloudflare.com/).
    
2. A **NuxtHub Admin Account** for managing apps via the NuxtHub dashboard. Sign up [**here**](https://admin.hub.nuxt.com/).
    

<div data-node-type="callout">
<div data-node-type="callout-emoji">ℹ</div>
<div data-node-type="callout-text"><strong>Note:</strong> Workers AI models will run in your Cloudflare account even during local development. Check out their <a target="_self" rel="noopener noreferrer nofollow" href="https://developers.cloudflare.com/workers-ai/platform/pricing" style="pointer-events: none">pricing and free quota</a>.</div>
</div>

### Project **Init**

We’ll start with the NuxtHub starter template. Run the following command to create and navigate to your new project directory:

```bash
# Create project and change into the project dir
npx nuxthub init voice-notes && cd $_
```

If you plan to use **pnpm** as your package manager, add a `.npmrc` file at the root of your project with this line to hoist dependencies:

```bash
# .npmrc
shamefully-hoist=true
```

Now, install the dependencies:

1. Nuxt modules:
    
    ```bash
    pnpm add @nuxt/ui@next
    ```
    
2. Drizzle and related tools:
    
    ```bash
    pnpm add drizzle-orm drizzle-zod @vueuse/core
    ```
    
3. Icon packs:
    
    ```bash
    pnpm add @iconify-json/lucide @iconify-json/simple-icons
    ```
    
4. Dev dependencies:
    
    ```bash
    pnpm add -D drizzle-kit
    ```
    

Update your `nuxt.config.ts` file as follows:

```ts
export default defineNuxtConfig({
  modules: ["@nuxthub/core", "@nuxt/eslint", "nuxt-auth-utils", "@nuxt/ui"],

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      helloText: "Hello from the Edge 👋",
    },
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: "2024-07-30",

  hub: {
    ai: true,
    blob: true,
    database: true,
  },

  css: ["~/assets/css/main.css"],

  eslint: {
    config: {
      stylistic: false,
    },
  },
});
```

We’ve made the following changes to the Nuxt config file:

1. Updated the Nuxt modules used in the app
    
2. Enabled required NuxtHub features
    
3. And, added the `main.css` file path.
    

Create the `main.css` file in the `app/assets/css` folder with this content:

```css
@import "tailwindcss";
@import "@nuxt/ui";
```

### Testing the Setup

Run the development server:

```bash
pnpm dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser. If everything is set up correctly, you’ll see the message: *“Hello from the Edge 👋”* with a refresh button.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text"><strong>Troubleshooting Tip:</strong> If you encounter issues with TailwindCSS, try deleting <code>node_modules</code> and <code>pnpm-lock.yaml</code>, and then run <code>pnpm install</code> to re-install the dependecies.</div>
</div>

## Building the Basic Backend

With the project setup complete, let’s dive into building the backend. We’ll begin by creating API endpoints to handle core functionalities, followed by configuring the database and integrating validation.

But before jumping to code, let’s understand how you’ll interact with various Cloudflare offerings. If you’ve been attentive, you should know the answer, NuxrHub, but what is NuxtHub?

### What is NuxtHub?

NuxtHub is a developer-friendly interface built on top of Cloudflare’s robust services. It simplifies the process of creating, binding, and managing services for your project, offering a seamless development experience (DX).

You started with a NuxtHub template, so the project comes preconfigured with the `@nuxthub/core` module. During the setup, you also enabled the required Cloudflare services: AI, Database, and Blob. The NuxtHub core module exposes these services through interfaces prefixed with `hub`. For example, `hubAI` is used for AI features, `hubBlob` for object storage, and so on.

Time is ripe now to work on the first API endpoint.

### `/api/transcribe` Endpoint

Create a new file named `transcribe.post.ts` inside the `server/api` directory, and add the following code to it:

```typescript
// server/api/transcribe.post.ts 
export default defineEventHandler(async (event) => {
  const form = await readFormData(event);
  const blob = form.get("audio") as Blob;
  if (!blob) {
    throw createError({
      statusCode: 400,
      message: "Missing audio blob to transcribe",
    });
  }

  ensureBlob(blob, { maxSize: "8MB", types: ["audio"] });

  try {
    const response = await hubAI().run("@cf/openai/whisper", {
      audio: [...new Uint8Array(await blob.arrayBuffer())],
    });

    return response.text;
  } catch (err) {
    console.error("Error transcribing audio:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to transcribe audio. Please try again.",
    });
  }
});
```

The above code does the following:

1. Parses incoming form data to extract the audio as a `Blob`
    
2. Verifies that it’s an audio blob and is less than `8MB` in size using a `@nuxthub/core` utility function `ensureBlob`
    
3. Passes on the array buffer to the `Whisper` model through `hubAI` for transcription
    
4. Returns the transcribed text to the client
    

Before you can use Workers AI in development, you’ll need to link it to your Cloudflare project. As we’re using NuxtHub as the interface, running the following command will create/link a new or existing NuxtHub project with this project.

```bash
npx nuxthub link
```

### `/api/upload` Endpoint

Next, create an endpoint to upload the audio recordings to the R2 storage. Create a new file `upload.put.ts` in your `/server/api` folder and add the following code to it:

```typescript
// server/api/upload.put.ts
export default defineEventHandler(async (event) => {
  return hubBlob().handleUpload(event, {
    formKey: "files",
    multiple: true,
    ensure: {
      maxSize: "8MB",
      types: ["audio"],
    },
    put: {
      addRandomSuffix: true,
      prefix: "recordings",
    },
  });
});
```

The above code uses another utility method from the NuxtHub core module to upload the incoming audio files to R2. `handleUpload` does the following:

1. Looks for the `files` key in the incoming form data to extract blob data
    
2. Supports multiple files per event
    
3. Ensures that the files are audio and under `8MB` in size
    
4. And, finally uploads them to your R2 bucket inside `recordings` folder while also adding a random suffix to the final names
    
5. Returns a promise to the client that resolves once all the files are uploaded
    

Now we just need `/notes` endpoints to create & fetch notes entries before the basic backend is done. But to do that we need to create the needed tables. Let’s tackle this in next section.

### Defining the `notes` Table Schema

As we will use `drizzle` to manage and interact with the database, we need to configure it first. Create a new file `drizzle.config.ts` in the project root, and add the following to it:

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
});
```

The config above mentions where the database schema is located, and where should the database migrations be generated. The database dialect is set to `sqlite` as that is what Cloudflare’s D1 database supports.

Next, create a new file `schema.ts` in the `server/database` folder, and add the following to it:

```typescript
// server/database/schema.ts
import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "nt_" + crypto.randomBytes(12).toString("hex")),
  text: text("text").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  audioUrls: text("audio_urls", { mode: "json" }).$type<string[]>(),
});
```

The `notes` table schema is straightforward. It includes the note text and optional audio recording URLs stored as a JSON string array.

Finally, create a new file `drizzle.ts` in the `server/utils` folder, and add the following to it:

```typescript
// server/utils/drizzle.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export { sql, eq, and, or, desc } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}
```

Here we hook up `hubDatabase` with the tables schema through `drizzle` and export the server composable `useDrizzle` along with the needed operators.

Now we are ready to create the `/api/notes` endpoints which we will be doing in the next section.

### `/api/notes` Endpoints

Create two new files `index.post.ts` and `index.get.ts` in the `server/api/notes` folder and add the respective codes to them as shown below.

**index.post.ts**

```typescript
// server/api/notes/index.post.ts
import { noteSchema } from "#shared/schemas/note.schema";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { text, audioUrls } = await readValidatedBody(event, noteSchema.parse);

  try {
    await useDrizzle()
      .insert(tables.notes)
      .values({
        text,
        audioUrls: audioUrls ? audioUrls.map((url) => `/audio/${url}`) : null,
      });

    return setResponseStatus(event, 201);
  } catch (err) {
    console.error("Error creating note:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to create note. Please try again.",
    });
  }
});
```

The above code reads the validated event body, and creates a new note entry in the database using the drizzle composable we created earlier. We will get to the validation part in a bit.

**index.get.ts**

```typescript
// server/api/notes/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    const notes = await useDrizzle()
      .select()
      .from(tables.notes)
      .orderBy(desc(tables.notes.updatedAt));

    return notes;
  } catch (err) {
    console.error("Error retrieving note:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to get notes. Please try again.",
    });
  }
});
```

Here we fetch the notes entries from the table in descending order of `updatedAt` field.

**Incoming data validation**

As mentioned in the beginning, we’ll use `Zod` for data validation. Here is the relevant code from `index.post.ts` that validates the incoming client data.

```typescript
const { text, audioUrls } = await readValidatedBody(event, noteSchema.parse);
```

Create a new file `note.schema.ts` in the `shared/schemas` folder in the project root directory with the following content:

```typescript
// shared/schemas/note.schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { notes } from "~~/server/database/schema";

export const noteSchema = createInsertSchema(notes, {
  text: (schema) =>
    schema.text
      .min(3, "Note must be at least 3 characters long")
      .max(5000, "Note cannot exceed 5000 characters"),
  audioUrls: z.string().array().optional(),
}).pick({
  text: true,
  audioUrls: true,
});

export const noteSelectSchema = createSelectSchema(notes, {
  audioUrls: z.string().array().optional(),
});
```

The above code uses the `drizzle-zod` plugin to create the `zod` schema needed for validation (The above validation error messages are more suitable for the client side. Feel free to adapt these validation rules to suit your specific project requirements.).

### Creating DB Migrations

With the table schema and API endpoints defined, the final step is to create and apply database migrations to bring everything together. Add the following command to your `package.json`'s scripts:

```json
// ..
"scripts": {
  // ..
  "db:generate": "drizzle-kit generate"
}
// ..
```

Next, run `pnpm run db:generate` to create the database migrations. These migrations are auto applied by NuxtHub when you run or deploy your project. You can test it by running `pnpm dev` and checking the Nuxt Dev Tools as shown below (this is a local sqlite database that is used in the dev mode).

![Nuxt Dev Tools showing empty notes table](/images/posts/building-voice-notes-app-with-ai-transcription-and-post-processing/b7106851-cba6-4dd0-b3a8-758f6746ef37-09bcd37401.png)

We are done with the basic backend of the project. In the next section, we will code the frontend components and pages to complete the whole thing,

## Creating the Basic Frontend

We’ll start with the most important feature first: recording the user voice, and then we’ll move on to creating the needed components and pages.

### `useMediaRecorder` Composable

Let’s create a composable to handle the media recording functionality. Create a new file `useMediaRecorder.ts` in your `app/composables` folder and add the following code to it:

```typescript
// app/composables/useMediaRecorder.ts
interface MediaRecorderState {
  isRecording: boolean;
  recordingDuration: number;
  audioData: Uint8Array | null;
  updateTrigger: number;
}

const getSupportedMimeType = () => {
  const types = [
    "audio/mp4",
    "audio/mp4;codecs=mp4a",
    "audio/mpeg",
    "audio/webm;codecs=opus",
    "audio/webm",
  ];

  return (
    types.find((type) => MediaRecorder.isTypeSupported(type)) || "audio/webm"
  );
};

export function useMediaRecorder() {
  const state = ref<MediaRecorderState>({
    isRecording: false,
    recordingDuration: 0,
    audioData: null,
    updateTrigger: 0,
  });

  let mediaRecorder: MediaRecorder | null = null;
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let animationFrame: number | null = null;
  let audioChunks: Blob[] | undefined = undefined;

  const updateAudioData = () => {
    if (!analyser || !state.value.isRecording || !state.value.audioData) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      return;
    }

    analyser.getByteTimeDomainData(state.value.audioData);
    state.value.updateTrigger += 1;
    animationFrame = requestAnimationFrame(updateAudioData);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const options = {
        mimeType: getSupportedMimeType(),
        audioBitsPerSecond: 64000,
      };

      mediaRecorder = new MediaRecorder(stream, options);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        audioChunks?.push(e.data);
        state.value.recordingDuration += 1;
      };

      state.value.audioData = new Uint8Array(analyser.frequencyBinCount);
      state.value.isRecording = true;
      state.value.recordingDuration = 0;
      state.value.updateTrigger = 0;
      mediaRecorder.start(1000);

      updateAudioData();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      throw err;
    }
  };

  const stopRecording = async () => {
    return await new Promise<Blob>((resolve) => {
      if (mediaRecorder && state.value.isRecording) {
        const mimeType = mediaRecorder.mimeType;
        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunks, { type: mimeType });
          audioChunks = undefined;

          state.value.recordingDuration = 0;
          state.value.updateTrigger = 0;
          state.value.audioData = null;

          resolve(blob);
        };

        state.value.isRecording = false;
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        audioContext?.close();
        audioContext = null;
      }
    });
  };

  onUnmounted(() => {
    stopRecording();
  });

  return {
    state: readonly(state),
    startRecording,
    stopRecording,
  };
}
```

The above code does the following:

1. Exposes recording start/stop functionality along with the current recording readonly state
    
2. Captures user’s voice using the `MediaRecorder` API when `startRecording` function is invoked. The `MediaRecorder` API is a simple and efficient way to handle media capture in modern browsers, making it ideal for our use case.
    
3. Captures audio visualization data using `AudioContext` and `AnalyserNode` and updates it in real-time using animation frames
    
4. Cleans up resources and returns the captured audio as a `Blob` when `stopRecording` is called or if the component unmounts
    

### `NoteEditorModal` Component

Next, create a new file `NoteEditorModal.vue` in the `app/components` folder and add the following code to it:

```xml
<!-- app/components/NoteEditorModal.vue -->
<template>
  <UModal
    fullscreen
    :close="{
      disabled: isSaving || noteRecorder?.isBusy,
    }"
    :prevent-close="isSaving || noteRecorder?.isBusy"
    title="Create Note"
    :ui="{
      body: 'flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 overflow-hidden',
    }"
  >
    <template #body>
      <UCard class="flex-1 flex flex-col" :ui="{ body: 'flex-1' }">
        <template #header>
          <h3 class="h-8 font-medium text-gray-600 dark:text-gray-300">
            Note transcript
          </h3>
        </template>

        <UTextarea
          v-model="noteText"
          placeholder="Type your note here, or use voice recording..."
          size="lg"
          :disabled="isSaving || noteRecorder?.isBusy"
          :ui="{ root: 'w-full h-full', base: ['h-full resize-none'] }"
        />
      </UCard>

      <NoteRecorder
        ref="recorder"
        class="md:h-full md:flex md:flex-col md:w-96 shrink-0 order-first md:order-none"
        @transcription="handleTranscription"
      />
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-undo-2"
        color="neutral"
        variant="outline"
        :disabled="isSaving"
        @click="resetNote"
      >
        Reset
      </UButton>

      <UButton
        icon="i-lucide-cloud-upload"
        :disabled="!noteText.trim() || noteRecorder?.isBusy || isSaving"
        :loading="isSaving"
        @click="saveNote"
      >
        Save Note
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { NoteRecorder } from "#components";

const props = defineProps<{ onNewNote: () => void }>();

type NoteRecorderType = InstanceType<typeof NoteRecorder>;
const noteRecorder = useTemplateRef<NoteRecorderType>("recorder");
const resetNote = () => {
  noteText.value = "";
  noteRecorder.value?.resetRecordings();
};

const noteText = ref("");
const handleTranscription = (text: string) => {
  noteText.value += noteText.value ? "\n\n" : "";
  noteText.value += text ?? "";
};

const modal = useModal();
const isSaving = ref(false);
const saveNote = async () => {
  const text = noteText.value.trim();
  if (!text) return;

  isSaving.value = true;

  const audioUrls = await noteRecorder.value?.uploadRecordings();

  try {
    await $fetch("/api/notes", {
      method: "POST",
      body: { text, audioUrls },
    });

    useToast().add({
      title: "Note Saved",
      description: "Your note was saved successfully.",
      color: "success",
    });

    if (props.onNewNote) {
      props.onNewNote();
    }

    modal.close();
  } catch (err) {
    console.error("Error saving note:", err);
    useToast().add({
      title: "Save Failed",
      description: "Failed to save the note.",
      color: "error",
    });
  }

  isSaving.value = false;
};
</script>
```

The above modal component does the following:

1. Displays a `textarea` for allowing a manual note entry
    
2. The modal integrates the `NoteRecorder` component for voice recordings and manages the data flow between the recordings and the `textarea` for user notes.
    
3. Whenever a new recording is created, it captures the emitted event from the note recorder component, and appends the transcription text to the `textarea` content
    
4. When the user clicks the save note button, its first uploads all recordings (if any) by calling the note recorder’s `uploadRecordings` method, and then save the note by calling the `notes` API endpoint created earlier.
    
5. The save note button first uploads all recordings (if any) asynchronously by calling the `uploadRecordings` method, then sends the note data to the `/api/notes` endpoint. Upon success, it notifies the parent by executing the callback passed by it, and then closes the modal.
    

### `NoteRecorder` Component

Create a new file `NoteRecorder.vue` in the `app/components` folder and add the following content to it:

```xml
<!-- app/components/NoteRecorder.vue --> 
<template>
  <UCard
    :ui="{
      body: 'max-h-36 md:max-h-none md:flex-1 overflow-y-auto',
    }"
  >
    <template #header>
      <h3 class="font-medium text-gray-600 dark:text-gray-300">Recordings</h3>

      <div class="flex items-center gap-x-2">
        <template v-if="state.isRecording">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span class="mr-2 text-sm">
            {{ formatDuration(state.recordingDuration) }}
          </span>
        </template>

        <UButton
          :icon="state.isRecording ? 'i-lucide-circle-stop' : 'i-lucide-mic'"
          :color="state.isRecording ? 'error' : 'primary'"
          :loading="isTranscribing"
          @click="toggleRecording"
        />
      </div>
    </template>

    <AudioVisualizer
      v-if="state.isRecording"
      class="w-full h-14 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
      :audio-data="state.audioData"
      :data-update-trigger="state.updateTrigger"
    />

    <div
      v-else-if="isTranscribing"
      class="flex items-center justify-center h-14 gap-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 text-gray-500 dark:text-gray-400"
    >
      <UIcon name="i-lucide-refresh-cw" size="size-6" class="animate-spin" />
      Transcribing...
    </div>

    <div class="space-y-2">
      <div
        v-for="recording in recordings"
        :key="recording.id"
        class="flex items-center gap-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <audio :src="recording.url" controls class="w-full h-10" />

        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="sm"
          @click="removeRecording(recording)"
        />
      </div>
    </div>

    <div
      v-if="!recordings.length && !state.isRecording && !isTranscribing"
      class="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400"
    >
      <p>No recordings...!</p>
      <p class="text-sm mt-1">Tap the mic icon to create one.</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const emit = defineEmits<{ transcription: [text: string] }>();

const { state, startRecording, stopRecording } = useMediaRecorder();
const toggleRecording = () => {
  if (state.value.isRecording) {
    handleRecordingStop();
  } else {
    handleRecordingStart();
  }
};

const handleRecordingStart = async () => {
  try {
    await startRecording();
  } catch (err) {
    console.error("Error accessing microphone:", err);
    useToast().add({
      title: "Error",
      description: "Could not access microphone. Please check permissions.",
      color: "error",
    });
  }
};

const { recordings, addRecording, removeRecording, resetRecordings } =
  useRecordings();

const handleRecordingStop = async () => {
  let blob: Blob | undefined;

  try {
    blob = await stopRecording();
  } catch (err) {
    console.error("Error stopping recording:", err);
    useToast().add({
      title: "Error",
      description: "Failed to record audio. Please try again.",
      color: "error",
    });
  }

  if (blob) {
    try {
      const transcription = await transcribeAudio(blob);

      if (transcription) {
        emit("transcription", transcription);

        addRecording({
          url: URL.createObjectURL(blob),
          blob,
          id: `${Date.now()}`,
        });
      }
    } catch (err) {
      console.error("Error transcribing audio:", err);
      useToast().add({
        title: "Error",
        description: "Failed to transcribe audio. Please try again.",
        color: "error",
      });
    }
  }
};

const isTranscribing = ref(false);
const transcribeAudio = async (blob: Blob) => {
  try {
    isTranscribing.value = true;
    const formData = new FormData();
    formData.append("audio", blob);

    return await $fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
  } finally {
    isTranscribing.value = false;
  }
};

const uploadRecordings = async () => {
  if (!recordings.value.length) return;

  const formData = new FormData();
  recordings.value.forEach((recording) => {
    if (recording.blob) {
      formData.append(
        "files",
        recording.blob,
        `${recording.id}.${recording.blob.type.split("/")[1]}`,
      );
    }
  });

  try {
    const result = await $fetch("/api/upload", {
      method: "PUT",
      body: formData,
    });

    return result.map((obj) => obj.pathname);
  } catch (error) {
    console.error("Failed to upload audio recordings", error);
  }
};

const isBusy = computed(() => state.value.isRecording || isTranscribing.value);

defineExpose({ uploadRecordings, resetRecordings, isBusy });

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>
```

This component does the following:

1. Allows recording the user’s voice with the help of `useMediaRecorder` composable created earlier. It also integrates the `AudioVisualizer` component to enhance the user experience by providing real-time audio feedback during recordings.
    
2. On a new recording, sends the recorded blob for transcription to the `transcribe` API endpoint, and emits the transcription text on success
    
3. Displays all recordings as `audio` elements for users perusal (using `URL.createObjectURL(blob)`). It utilizes the `useRecordings` composable to manage the recordings
    
4. Uploads the final recordings to R2 (the local disk in dev mode) using the `/api/upload` endpoint, and returns the pathnames of these recordings to the caller (the `NoteEditorModal` component)
    

### `AudioVisualizer` Component

This component uses an HTML canvas element to represent the audio waveform along a horizontal line. The canvas element is used for its flexibility and efficiency in rendering real-time visualizations, making it suitable for audio waveforms.

The visualization dynamically adjusts based on the amplitude of the captured audio, providing a real-time feedback loop for the user during recording. To do that, it watches the `updateTrigger` state variable exposed by `useMediaRecorder` to redraw the canvas on audio data changes.

Create a new file `AudioVisualizer.vue` in the `app/components` folder and add the following code to it:

```xml
<!-- app/components/AudioVisualizer.vue -->
<template>
  <canvas ref="canvas" width="640" height="100" />
</template>

<script setup lang="ts">
const props = defineProps<{
  audioData: Uint8Array | null;
  dataUpdateTrigger: number;
}>();

let width = 0;
let height = 0;
const audioCanvas = useTemplateRef<HTMLCanvasElement>("canvas");
const canvasCtx = ref<CanvasRenderingContext2D | null>(null);

onMounted(() => {
  if (audioCanvas.value) {
    canvasCtx.value = audioCanvas.value.getContext("2d");
    width = audioCanvas.value.width;
    height = audioCanvas.value.height;
  }
});

const drawCanvas = () => {
  if (!canvasCtx.value || !props.audioData) {
    return;
  }

  const data = props.audioData;
  const ctx = canvasCtx.value;
  const sliceWidth = width / data.length;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(221, 72, 49)";
  ctx.beginPath();

  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] ?? 0) / 128.0;
    const y = (v * height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(width, height / 2);
  ctx.stroke();
};

watch(
  () => props.dataUpdateTrigger,
  () => {
    drawCanvas();
  },
  { immediate: true },
);
</script>
```

### `useRecordings` Composable

The `NoteRecorder` component uses the `useRecordings` composable to manage the list of recordings, and to clear any used resources. Create a new file `useRecordings.ts` in the `app/composables` folder and add the following code to it:

```typescript
// app/composables/useRecordings.ts
export const useRecordings = () => {
  const recordings = ref<Recording[]>([]);

  const cleanupResource = (recording: Recording) => {
    if (recording.blob) {
      URL.revokeObjectURL(recording.url);
    }
  };

  const cleanupResources = () => {
    recordings.value.forEach((recording) => {
      cleanupResource(recording);
    });
  };

  const addRecording = (recording: Recording) => {
    recordings.value.unshift(recording);
  };

  const removeRecording = (recording: Recording) => {
    recordings.value = recordings.value.filter((r) => r.id !== recording.id);
    cleanupResource(recording);
  };

  const resetRecordings = () => {
    cleanupResources();

    recordings.value = [];
  };

  onUnmounted(cleanupResources);

  return {
    recordings,
    addRecording,
    removeRecording,
    resetRecordings,
  };
};
```

You can define the `Recording` type definition in the `shared/types/index.ts` file. This allows for auto import of type definitions in both client & server sides (The intended purpose of the shared folder is for sharing common types & utils between the app & server). Also, while you’re at it, you can also define the `Note` type.

```typescript
// shared/types/index.ts
import type { z } from "zod";
import type { noteSelectSchema } from "#shared/schemas/note.schema";

export type Recording = {
  url: string;
  blob?: Blob;
  id: string;
};

export type Note = z.output<typeof noteSelectSchema>;
```

### Creating the Home Page

Now that we have all the pieces ready for the basic app, it is time to put everything together in a page. Delete the content of the home page (`app/pages/index.vue`), and put the following content to it:

```xml
<!-- app/pages/index.vue -->
<template>
  <UContainer class="h-screen flex justify-center items-center">
    <UCard
      class="w-full max-h-full overflow-hidden max-w-4xl mx-auto"
      :ui="{ body: 'h-[calc(100vh-4rem)] overflow-y-auto' }"
    >
      <template #header>
        <span class="font-bold text-xl md:text-2xl">Voice Notes</span>
        <UButton icon="i-lucide-plus" @click="showNoteModal">
          New Note
        </UButton>
      </template>

      <div v-if="notes?.length" class="space-y-4">
        <NoteCard v-for="note in notes" :key="note.id" :note="note" />
      </div>
      <div
        v-else
        class="my-12 text-center text-gray-500 dark:text-gray-400 space-y-2"
      >
        <h2 class="text-2xl md:text-3xl">No notes created</h2>
        <p>Get started by creating your first note</p>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { LazyNoteEditorModal } from "#components";

const { data: notes, refresh } = await useFetch("/api/notes");

const modal = useModal();
const showNoteModal = () => {
  modal.open(LazyNoteEditorModal, {
    onNewNote: refresh,
  });
};

watch(modal.isOpen, (newState) => {
  if (!newState) {
    modal.reset();
  }
});
</script>
```

On this page we’re doing the following:

1. Fetch the list of existing notes from the database and display them using the `NoteCard` component
    
2. Shows a new note button which when clicked opens the `NoteEditorModal`. On successful note creation the `refresh` function is called to refetch the notes
    
3. The modal state is reset on closure to ensure a clean slate for the next note creation
    

The cards and modals headers/footers used in the app follow a global style that is defined in the app config file. Centralizing styles in the app configuration ensures consistent theming and reduces redundancy across components.

Create a new file `app.config.ts` inside the `app` folder, and add the following to it:

```typescript
// app/app.config.ts
export default defineAppConfig({
  ui: {
    card: {
      slots: {
        header: "flex items-center justify-between gap-3 flex-wrap",
      },
    },
    modal: {
      slots: {
        footer: "justify-end gap-x-3",
      },
    },
  },
});
```

You’ll also need to wrap your `NuxtPage` component with the `UApp` component for the modals and toast notifications to work as shown below:

```xml
<!-- app/app.vue -->
<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

### `NoteCard` component

This component displays the note text and the attached audio recordings of a note. The note text is clamped to 3 lines with a show more/less button to show/hide rest of the text. Text clamping ensures that the UI remains clean and uncluttered, while the show more/less button gives users full control over note visibility.

Create a new file `NoteCard.vue` in the `app/components` folder, and add the following code to it:

```xml
<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="flex-1">
      <p
        ref="text"
        :class="['whitespace-pre-wrap', !showFullText && 'line-clamp-3']"
      >
        {{ note.text }}
      </p>
      <UButton
        v-if="shouldShowExpandBtn"
        variant="link"
        :padded="false"
        @click="showFullText = !showFullText"
      >
        {{ showFullText ? "Show less" : "Show more" }}
      </UButton>
    </div>

    <div
      v-if="note.audioUrls && note.audioUrls.length > 0"
      class="mt-4 flex gap-x-2 overflow-x-auto"
    >
      <audio
        v-for="url in note.audioUrls"
        :key="url"
        :src="url"
        controls
        class="w-60 shrink-0 h-10"
      />
    </div>

    <p
      class="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-x-2 mt-6"
    >
      <UIcon name="i-lucide-clock" size="size-4" />
      <span>
        {{
          note.updatedAt && note.updatedAt !== note.createdAt
            ? `Updated ${updated}`
            : `Created ${created}`
        }}
      </span>
    </p>
  </UCard>
</template>

<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{ note: Note }>();

const createdAt = computed(() => props.note.createdAt + "Z");
const updatedAt = computed(() => props.note.updatedAt + "Z");

const created = useTimeAgo(createdAt);
const updated = useTimeAgo(updatedAt);

const showFullText = ref(false);

const shouldShowExpandBtn = ref(false);
const noteText = useTemplateRef<HTMLParagraphElement>("text");
const checkTextExpansion = () => {
  nextTick(() => {
    if (noteText.value) {
      shouldShowExpandBtn.value =
        noteText.value.scrollHeight > noteText.value.clientHeight;
    }
  });
};

onMounted(checkTextExpansion);

watch(() => props.note.text, checkTextExpansion);
</script>
```

And we are done here. Try running the application and create some notes. You should be able to create notes, add multiple recordings to the same note etc. Everything should be working now, or is it?

Try playing the audio recordings of the saved notes, are these playable?

![Houston, we have a problem](https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTFvbTQ4Z3h1aXlyNHhvOW9ibW9oM2M5OWE2Y3MyczRxazRqN3E2YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHWzZQaCrZW2aWs/giphy.gif)

### Serving the Audio Recordings

We can’t play the audio recordings because these are saved in R2 (local disk in dev mode), and nowhere we are serving these files. It is time to fix that.

If you look at the `/api/notes` code, we save the audio urls/pathnames with an `audio` prefix

```typescript
await useDrizzle()
  .insert(tables.notes)
  .values({
    text,
    audioUrls: audioUrls ? audioUrls.map((url) => `/audio/${url}`) : null,
  });
```

The reason to do so was to serve all audio recordings through an `/audio` path. Create a new file `[…pathname].get.ts` in the `server/routes/audio` folder and add the following to it:

```typescript
export default defineEventHandler(async (event) => {
  const { pathname } = getRouterParams(event);

  return hubBlob().serve(event, pathname);
});
```

What we’ve done above is to catch all requests to the `/audio` path (by using the wildcard `[…pathname]` in the filename), and serve the requested recording from the storage using `hubBlob`.

With this, the frontend is complete, and all functionalities should now work seamlessly.

## Further Enhancements

What you’ve created here is a basic version of the application—with all must-have features—that you saw in the beginning of the article. You can further refine the app and take it closer to the demo by:

What you’ve created here is a solid foundation for the application, complete with the core features introduced earlier. To further enhance the app and bring it closer to the full demo version, consider implementing the following features:

1. Adding a settings page to save post processing settings
    
2. Handle post processing in the `/transcribe` api route
    
3. Allowing edit/delete of saved notes
    
4. Experimenting with additional features that fit your use case or user needs.
    

If you get stuck while implementing these features, do not hesitate to look at the application source code. The complete source code of the final application is shared at the end of the article.

## Deploying the Application

You can deploy the application using either the NuxtHub admin dashboard or through the NuxtHub CLI.

### Deploy via NuxtHub Admin

* Push your code to a GitHub repository.
    
* Link the repository with NuxtHub.
    
* Deploy from the Admin console.
    

[Learn more about NuxtHub Git integration](https://hub.nuxt.com/docs/getting-started/deploy#cloudflare-pages-ci)

### Deploy via NuxtHub CLI

```bash
npx nuxthub deploy
```

[Learn more about CLI deployment](https://hub.nuxt.com/docs/getting-started/deploy#nuxthub-cli)

## Source Code

You can find the source code of `Vhisper` application on GitHub. The source code includes all the features discussed in this article, along with additional configurations and optimizations shown in the demo.

::media-embed
---
url: https://github.com/ra-jeev/vhisper
---
:: 

## Conclusion

Congratulations! You've built a powerful application that records and transcribes audio, stores recordings, and manages notes with an intuitive interface. Along the way you’ve touched upon various aspects of Nuxt, NuxtHub and Cloudflare services. As you continue to refine and expand Vhisper, consider exploring additional features and optimizations to further enhance its functionality and user experience. Keep experimenting and innovating, and let this project be a stepping stone to even more ambitious endeavors.

Thank you for sticking with me until the end! I hope you’ve picked up some new concepts along the way. I’d love to hear what you learned or any thoughts you have in the comments section. Your feedback is not only valuable to me, but to the entire developer community exploring this exciting field.

Until next time!

---

> *Keep adding the bits and soon you'll have a lot of bytes to share with the world.*
