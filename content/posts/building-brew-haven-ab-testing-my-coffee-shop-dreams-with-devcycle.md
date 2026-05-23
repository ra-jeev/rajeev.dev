---
title: "Building Brew Haven: A/B Testing My Coffee Shop Dreams with DevCycle"
description: "Do you love coffee? As developers, many of us jokingly claim to be \"powered by coffee\", and the thought of opening a quaint coffee shop someday often lingers in the back of our..."
date: "2024-12-29T11:09:52.011Z"
slug: "building-brew-haven-ab-testing-my-coffee-shop-dreams-with-devcycle"
cover: "/images/posts/building-brew-haven-ab-testing-my-coffee-shop-dreams-with-devcycle/1b223b14-15c4-401a-b08c-bb3816a5a85a-8d7979e641.png"
tags:
  - "webdev"
  - "reactjs"
  - "feature-flags"
  - "devcycle"
draft: false
hashnodeId: "cm59idr0r003e09kvhj3h7q4c"
---

Do you love coffee? As developers, many of us jokingly claim to be "powered by coffee", and the thought of opening a quaint coffee shop someday often lingers in the back of our minds — perhaps as a post-dev career dream.

When brainstorming ideas for a fun project to showcase feature flags, this coffee shop fantasy kept nudging me: "Pick me! Build me!". So, I decided to indulge that thought and create Brew Haven, a dummy coffee shop app that explores the power of feature flags.

> This project was originally created as part of a dev challenge to showcase the power of feature flags in an engaging way.

## Project Overview

As you might have guessed, I built a playground to explore the power of feature flags, packaged as a coffee shop app. The app features customizable menus, seasonal items, and dynamic A/B testing for promotions using the DevCycle SDK. It also leverages the DevCycle Management APIs to power an admin panel, giving shop managers full control over these features in real time.

### Demo

The following video gives a short walkthrough of the app.

::media-embed
---
url: https://youtu.be/Xp6i7GXl4hM
---
:: 

You can try out the live app here: [Brew Haven](https://brewwhaven.netlify.app)

> Note: The admin page uses a dummy password auth. Use `admin@123` passowrd to view the admin panel and play around with the available feature flags.

### Technologies Used

To bring Brew Haven to life, I used the following:

* React with Vite for a fast and modular frontend.
    
* Shadcn UI for styling and components.
    
* Netlify Functions for secure serverless DevCycle Management API calls.
    
* DevCycle SDK for feature flag integration on the client side.
    

## What is DevCycle?

DevCycle is a feature management platform that helps developers experiment with new features, run A/B tests, and gradually roll out updates without downtime. It uses **feature flags**—switches in your code that let you turn specific features on or off in real time.

With DevCycle, you can:

* Deploy features safely using controlled rollouts.
    
* Customize user experiences through A/B testing.
    
* Quickly respond to user feedback without redeploying your code.
    

DevCycle integrates seamlessly into your development process, making feature management simple and efficient. In Brew Haven, I used it to power dynamic menu customization, promotions, and more.

### How Does DevCycle Work?

DevCycle is a powerful tool designed to simplify the management of feature flags and provide advanced functionality for tailoring your software’s behavior. Here’s an overview of how it works:

1. **Feature Flags and Feature Types**  
    At the heart of DevCycle are **features**, which can have one or more toggles (or flags). Features are categorized into four types, tailored for specific use cases:
    
    * **Release**: Designed for separating code deployment from feature release. This enables merging incomplete or in-progress code into production without affecting end users until it’s toggled on.
        
    * **Ops**: Helps ensure system safety during feature rollouts, with built-in mechanisms for gradual rollouts or emergency kill switches.
        
    * **Experiment**: Ideal for A/B or multivariate testing. It lets you distribute users across variations and track outcomes to make data-driven decisions.
        
    * **Permission**: Gating features based on user attributes, such as subscription plans or roles, allowing granular control over feature access.
        
2. **Variables and Variations**  
    Each feature flag can have associated **variables**, representing configurable values. For example, a flag for a promotion might include variables like `discountPercentage` or `minimumOrderValue`.  
    **Variations** are pre-defined combinations of variable values, which dictate how the feature behaves. For instance:
    
    * Variation A might offer a 10% discount.
        
    * Variation B might provide a 15% discount with a higher order value threshold.
        
3. **Targeting Rules and Rollouts**  
    DevCycle allows you to define rules that control which users see specific variations. These rules can be based on user properties (like location or plan type) or random distribution for A/B testing. Features can also be rolled out gradually, allowing you to monitor performance and ensure stability before scaling.
    

This structured approach ensures safe experimentation, seamless feature rollouts, and precise customization—all with minimal risk to your users’ experience.

### Feature Flags in Brew Haven

Brew Haven uses the following feature flags to make the app dynamic and customizable:

1. **Coffee Menu**: Feature flags control menu customization, seasonal items, and order personalization.
    
2. **Payment & Ordering**: Enable or disable online payments, loyalty points, and live order tracking with simple toggles.
    
3. **A/B Testing Promotions**: Run experiments on discounts and promotional offers to optimize customer engagement.
    

The first two are release type feature flags, while the last one is an experiment type feature. These flags not only made development faster but also showcased the versatility of DevCycle.

## Integrating DevCycle

The source code of the app is open source, and is available on GitHub. We’ll briefly look at how to integrate and use DevCycle in a React App.

::media-embed
---
url: https://github.com/ra-jeev/brew-haven
---
:: 

### Client Side Usage of DevCycle SDK

After adding the `DevCycle React SDK` dependency, we first initialize the `DevCycleProvider` in the `App.tsx` file as shown below:

```typescript
// src/App.tsx

import { withDevCycleProvider } from "@devcycle/react-client-sdk";
// ...

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="coffee-shop-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default withDevCycleProvider({
  sdkKey: import.meta.env.VITE_DEVCYCLE_CLIENT_SDK_KEY,
  options: {
    logLevel: "debug",
  },
})(App);
```

And then we create a `useFeatureFlags` hook to get the various feature flags variables associated with the app as shown below:

```typescript
// src/hooks/use-feature-flags.ts

import { useVariableValue } from "@devcycle/react-client-sdk";
import { featureKeys } from "@/lib/consts";

export function useFeatureFlags() {
  const showNutritionInfo = useVariableValue(
    featureKeys.SHOW_NUTRITION_INFO,
    false,
  );
  const enableOnlinePayment = useVariableValue(
    featureKeys.ENABLE_ONLINE_PAYMENT,
    false,
  );
  const showPromotionalBanner = useVariableValue(
    featureKeys.SHOW_PROMOTIONAL_BANNER,
    "",
  );

  // etc.

  return {
    showNutritionInfo,
    enableOnlinePayment,
    showPromotionalBanner,
    // ...
  };
}
```

This hook is used in the app to toggle various code sections on/off to change the UI.

### Interacting with DevCycle Management APIs

For securely calling the Management APIs, we use Netlify serverless functions so that the DevCycle API's `client_id` and `client_secret` are not exposed to the client.

Before we can interact with the DevCycle APIs, we need to generate an auth token using the DevCycle APIs client id and secret. The below code shows how to generate the auth token:

```ts
// netlify/functions/feature-flags.mts

interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAuthToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const response = await fetch("https://auth.devcycle.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        audience: "https://api.devcycle.com/",
        client_id: process.env.DEVCYCLE_API_CLIENT_ID!,
        client_secret: process.env.DEVCYCLE_API_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data: AuthToken = await response.json();

    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000 - 5 * 60 * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    throw error;
  }
}
```

Now we can fetch the available feature flags, and their config (to get the currently active variation) using the below code:

```typescript
// netlify/functions/feature-flags.mts

interface Distribution {
  _variation: string;
  percentage: number;
}

interface FeatureConfig {
  _feature: string;
  _environment: string;
  status: string;
  targets: {
    _id: string;
    name: string;
    distribution: Distribution[];
    audience: {
      name: string;
      filters: {
        operator: "and" | "or";
        filters: { type: string }[];
      };
    };
  }[];
}

async function getFeatures(
  featuresUrl: string,
  headers: Record<string, string>,
) {
  const featuresResponse = await fetch(featuresUrl, { headers });

  if (!featuresResponse.ok) {
    throw new Error(`Failed to fetch flags: ${featuresResponse.status}`);
  }

  const featuresData = await featuresResponse.json();

  // Fetch the config for each of the feature flags
  // We're only fetching the configs for the development env
  const configPromises = featuresData.map(async (feature: any) => {
    const configResponse = await fetch(
      `${featuresUrl}/${feature._id}/configurations?environment=development`,
      { headers },
    );

    if (!configResponse.ok) {
      console.error(`Failed to fetch config for feature ${feature._id}`);
      return null;
    }

    const configs: FeatureConfig[] = await configResponse.json();

    return {
      ...feature,
      targets: configs[0].targets,
      status: configs[0].status,
    };
  });

  const featuresWithConfigs = await Promise.all(configPromises);
  return featuresWithConfigs.filter((f) => f !== null);
}
```

To update the feature flags config (changing the variation, or toggle the flag altogether), we can use the below function:

```typescript
async function updateFeature(
  featuresUrl: string,
  featureId: string,
  headers: Record<string, string>,
  update: any,
) {
  const response = await fetch(
    `${featuresUrl}/${featureId}/configurations?environment=development`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(update),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update feature: ${response.status}`);
  }

  return await response.json();
}
```

Finally, here is the Netlify function that uses the above functions to serve the client requests:

```typescript
export default async (req: Request) => {
  try {
    const { method } = req;
    const token = await getAuthToken();
    const featuresBaseUrl = `https://api.devcycle.com/v1/projects/${process.env.DEVCYCLE_PROJECT_ID}/features`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (method === "GET") {
      const features = await getFeatures(featuresBaseUrl, headers);

      return Response.json({ features });
    }

    if (method === "PATCH") {
      const body = await req.json();
      const { featureId, update } = body;

      const data = await updateFeature(
        featuresBaseUrl,
        featureId,
        {
          ...headers,
          "Content-Type": "application/json",
        },
        update,
      );

      return Response.json({ data });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
```

This Netlify function is called by the client in the following way:

```typescript
// src/lib/api.ts

export async function getFeatureFlags() {
  try {
    const response = await fetch("/.netlify/functions/feature-flags");
    if (!response.ok) {
      throw new Error("Failed to fetch flags");
    }

    const data = await response.json();
    return { success: true, data: data.features as Feature[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// and, so on...
```

The above code snippets capture how the `DevCycle SDK` and its `Management APIs` are used within the app. You can go through the shared source code to view the complete implementation in more detail.

## Wrapping Up

Brew Haven isn’t just a coffee shop app — it’s a showcase of how feature flags can make your projects more dynamic, responsive, and fun.

Feature flags allow you to:

* Do gradual rollouts.
    
* Reduce deployment risks.
    
* Enable rapid experimentation.
    
* Personalize user experiences.
    

Next time you’re sipping coffee and dreaming big, think about how feature flags can brew innovation into your projects. ☕

---

Thank you for sticking with me until the end! I hope you’ve picked up some new concepts along the way. I’d love to hear what you learned or any thoughts you have in the comments section. Your feedback is not only valuable to me, but to the entire developer community exploring this exciting field.

Until next time.

> *Keep adding the bits, and soon you'll have a lot of bytes to share with the world.*
