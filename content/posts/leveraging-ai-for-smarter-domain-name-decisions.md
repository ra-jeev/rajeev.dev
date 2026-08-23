---
title: "Beyond Gut Feeling: Leveraging AI for Smarter Domain Name Decisions"
description: "If you work in tech-related fields, sooner or later there will come a time when you have to pick a domain name for the idea you've been working on. Whether it's an app or a serv..."
date: "2024-07-28T19:32:27.124Z"
slug: "leveraging-ai-for-smarter-domain-name-decisions"
cover: "/images/posts/leveraging-ai-for-smarter-domain-name-decisions/894ac1a2-3eb8-423f-99fb-5afa1c592581-1b67034bd5.png"
tags:
  - "nuxt"
  - "anthropic"
  - "claudeai"
  - "aifortomorrow"
draft: false
hashnodeId: "clz5yiw6r000308md8h4u35i7"
---

If you work in tech-related fields, sooner or later there will come a time when you have to pick a domain name for the idea you've been working on. Whether it's an app or a service, it still needs a name. And if you're anything like me, this is one of the trickiest parts of building that idea. The perfect domain name can make your project more memorable, boost SEO, and even influence user trust. But how do you know if you're making the right choice?

Traditionally, selecting a domain name has been a mix of creativity, gut feeling, and perhaps a quick poll among people in your circle of influence. The post-GPT era might have added another ingredient to the mix: consulting your trusted AI/LLM. But if you have talked to this advisor, it generally throws some names at you without revealing why it chose these names. And this is where **"Name Insights"** steps in, offering not just suggestions, but insights into the 'why' behind those domain name choices.

## Introduction

I have been thinking about domain names (hoarding to be frank) for quite some time now. Maybe because I have bought more domains in the recent past than my usual appetite allows me to. And the first step to this whole process is: knowing the name that you want to buy.

After the usual availability checks, you wonder whether that weird-looking name is right for the purpose you're buying it for. Let's be honest, all the good ones are already taken (why does it feel like I'm not writing a tech article?) or the price is simply beyond your reach. Sometimes you zero down on more than one name, so which one should you go ahead with? These were the guiding questions behind building Name Insights.

Name Insights aims to address these challenges by providing detailed, contextual answers to help you make informed decisions about domain names.

## App Features

Name Insights offers three powerful services to assist in your domain name decision-making process. Each service utilizes an AI-driven scoring system that evaluates domains based on six key aspects of what makes a good domain name. Let's explore each feature:

### Name Insights & Scoring

This feature provides an unbiased view of what kind of app or service is best suited for a given domain name. It:

* Evaluates the domain on 6 different parameters, namely:
    
    1. Brand Impact: Memorability, brandability, uniqueness, emotional appeal.
        
    2. Usability: Length, spelling simplicity, pronunciation clarity, absence of numbers/hyphens.
        
    3. Relevance and SEO: Relevance to purpose, keyword inclusion, extension potential.
        
    4. Technical Considerations: TLD appropriateness, potential social media availability.
        
    5. Legal and Cultural Factors: Potential trademark risks, cultural/linguistic considerations.
        
    6. Market Potential: Ability to target desired audience, scalability for business growth.
        
* Provides an overall score based on weighted parameters.
    
* Offers a brief explanation for each score.
    
* Highlights pros and cons of the domain name.
    

### Domain Names Comparison

This feature helps you choose between different options you might have. It:

* Compares two different domain names
    
* Uses the same scoring strategy as the insights feature
    
* Determines a "winning" name
    
* Provides a brief summary explaining the choice
    

### Domain Name Ideas

This feature is most useful when you're starting from scratch. It:

* Builds upon the same domain name scoring strategy, and offers five distinct domain name suggestions based on your app/service idea
    
* Provides an overall score for each suggestion
    
* Breaks down different category scores
    
* Offers a brief summary of strengths and weaknesses for each name
    

## App Demo/Screenshots

**Home Page**

![name insights home page](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/b95c841b-c291-4044-8bbc-4f85e1193588-f906d486e1.png)

**Name insights loading animation**

![name insights loading animation](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/7724153f-acb7-45f0-9da1-e3f9a1301357-65859f0c09.png)

**Name Insights Page (for hashnode.com domain)**

![name insights for hashnode.com](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/eb979fdb-c7f5-4faf-b03b-41cce3c63f8f-ad8760b883.png)

**Name comparison page**

![name comparison page](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/15478b0f-18f2-4772-883c-aafc5cb3cfd0-24ff97e0c4.png)

**Comparison loading animation**

![comparison loading animation](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/1a06b546-b53e-4325-a829-89f24f3af4e1-b7d5d1280c.png)

**Comparison results for fitnawake.com & fitandawake.com**

![comparison results page](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/d376887e-c449-4241-95e1-4ae18be14259-0dd492a1cb.png)

**Name ideas results page**

![](/images/posts/leveraging-ai-for-smarter-domain-name-decisions/e2e0353e-1d35-474e-a3ce-51f801740dea-bf0f13c4cf.png)

## Technical Details

Here is a brief overview of the app stack and approach

1. **Nuxt3:** Name Insights uses the full-stack capabilities of Nuxt3 as its backbone for a faster turnaround time. You can achieve the same results using another framework of your choice, but for me it made more sense because of where it is hosted (see point 2).
    
2. **NuxtHub:** The app is hosted on Cloudflare Pages using [NuxtHub](https://hub.nuxt.com/). NuxtHub offers a great DX for hosting serverless Nuxt apps, and for talking to various Cloudflare services. At the time of writing this article it supports Cloudflare features such as KV, D1, and R2.
    
3. **NuxtUI:** The app UI is built using NuxtUI, a collection of prebuilt components based on HeadlessUI & TailwindCSS.
    
4. **Claude 3.5 Sonnet / Anthropic AI:** The core features of the app are thanks to the Anthropic AI SDK, using the Claude 3.5 Sonnet model. The best in class reasoning capabilities of the model allows for a good overall experience of the app features.
    

At the heart of the app features is the domain scoring strategy. At present, the app relies on the advanced reasoning capabilities of the **Claude 3.5 Sonnet** model to grade a domain name. The key to the implementation lies in carefully crafted system prompts (which you call Prompt Engineering). These prompts instruct the AI on how to analyze domain names, what factors to consider, and how to present the results. E.g. the below is the core part of the system prompt for scoring a domain and generating insights:

```typescript
const nameScorePrompt = `You are an AI assistant specialized in 
evaluating and scoring domain names. Analyze the given domain name 
as if you're seeing it for the very first time, without any prior 
knowledge of its actual use or purpose.

Evaluate the domain based on these categories and weights:
1. Brand Impact (30%)
2. Usability (20%)
3. Relevance and SEO (20%)
4. Technical Considerations (15%)
5. Legal and Cultural Factors (10%)
6. Market Potential (5%)

Provide a score out of 100 for each category, along with a brief, 
unbiased explanation. Calculate the weighted overall score out of 100 
(rounded to the nearest integer). Include concise lists of strengths 
and weaknesses of the domain name based solely on its characteristics, 
not its known use. 
`

const response = await this.anthropic.messages.create({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 1000,
  temperature: 0.4,
  system: systemPrompt,
  messages: [
    {
      role: "user",
      content: `Analyze the domain name: ${domainName}`,
    },
  ],
});
```

The prompt is intentionally detailed and specific to get the desired results from the LLM. We incorporate the required JSON structure into the prompt to receive the output in JSON format. This output is then parsed using the following function:

```typescript
export function extractAndParseJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const backtickPattern = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  const matches = text.match(backtickPattern);

  if (matches) {
    for (const match of matches) {
      const content = match.replace(/```(?:json)?\s*|\s*```/g, "").trim();
      try {
        return JSON.parse(content) as T;
      } catch (error) {
        continue;
      }
    }
  }

  throw new Error("No valid JSON found in the text");
}
```

To try out different LLMs from other AI services, the backend implementation is kept generic using interfaces which every AI service needs to implement and extend.

Here is the **AIService** interface:

```typescript
export interface AIService {
  getDomainScore(domainName: string): Promise<string>;
  compareDomains(firstDomain: string, secondDomain: string): Promise<string>;
  getDomainSuggestions(purpose: string): Promise<string>;
}
```

And the **BaseAIService**

```typescript
export abstract class BaseAIService implements AIService {
  protected getSystemPrompt(promptType: SystemPromptType): string {
    return getSystemPrompt(promptType);
  }

  abstract getDomainScore(domainName: string): Promise<string>;

  abstract compareDomains(
    firstDomain: string,
    secondDomain: string
  ): Promise<string>;

  abstract getDomainSuggestions(purpose: string): Promise<string>;
}
```

This approach provides a common system prompt for all AI services while allowing individual services the flexibility to override and define their own custom system prompts if needed.

## App & Repo Links

You can try out the app live at [https://name-insights.pages.dev/](https://name-insights.pages.dev/)

The complete app code can be found here:

::media-embed
---
url: https://github.com/ra-jeev/domain-name-insights
---
:: 

## Limitations

As the app relies entirely on an LLM for its core functionality, the output is not deterministic. This means that if you analyze the same domain name multiple times, you may receive slightly different scores. This variability is inherent to large language models, which can produce different outputs based on subtle differences in how they process the input each time.

However, in my testing, I've found that this limitation doesn't significantly impact the app's utility. The variance in scores tends to be low, and the overall insights remain consistent. Name Insights is an excellent sounding board for giving you a head start in your domain name search.

## Further Enhancements

This is just the beginning. Below are some of the actions items that can further enhance the app outcome and usefulness:

1. Integrating other LLMs and utilize multiple models simultaneously for arriving at a score and generating insights
    
2. Adding real world data to the mix. This will make the scoring more trustworthy and accurate.
    
3. Adding real time domain name availability checks, and possibly the social media handles.
    

## Conclusion

Selecting the perfect domain name is a critical step in establishing your online presence. With its three distinct features Name Insights aims to make the process easier at various stages of the domain name search journey. It helps you to:

* Gain objective insights into the strengths and weaknesses of potential domain names
    
* Make informed comparisons between different options
    
* Generate fresh ideas tailored to your specific needs
    

Irrespective of the slight variability in results, the overall consistency and depth of analysis provided by Name Insights make it an invaluable resource for smarter domain name decisions.

---

I hope you liked reading the article. Do try out the app and it would mean the world to me if you can share your feedback with me.

Until next time...!

> *Keep adding the bits and soon you'll have a lot of bytes to share with the world*.
