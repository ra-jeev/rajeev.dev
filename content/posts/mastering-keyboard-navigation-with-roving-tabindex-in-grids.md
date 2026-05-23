---
title: "Mastering Keyboard Navigation with Roving tabindex in Grids"
description: "Did you ever try to navigate a webpage using just your keyboard? Do you know how it works under the hood? Do you know what is `\"tabindex\",` and what is its role in keyboard navi..."
date: "2023-04-06T18:04:03.633Z"
slug: "mastering-keyboard-navigation-with-roving-tabindex-in-grids"
cover: "/images/posts/mastering-keyboard-navigation-with-roving-tabindex-in-grids/394038a94a9e8ba3eeb96ef292f9aced-acbd5a9583.jpeg"
tags:
  - "tutorial"
  - "javascript"
  - "accessibility"
  - "reactjs"
  - "html5"
draft: false
hashnodeId: "clg5fg6nl000809mhhm9n4dcd"
---

Did you ever try to navigate a webpage using just your keyboard? Do you know how it works under the hood? Do you know what is `"tabindex",` and what is its role in keyboard navigation? In this article, we will cover all these burning questions and also learn to implement custom keyboard navigation for a grid using the roving tabindex technique.

## Introduction

Recently I was looking to implement keyboard navigation for my daily puzzle game [GoldRoad](https://playgoldroad.com). I had a vague idea about adding key event listeners and using these key presses but I wanted to learn if there is something more to it. And I wasn't disappointed. This article tells the story of the rabbit hole I fell into.

To navigate a website using the keyboard, we typically use the `Tab` key (If you're on the Safari browser, and haven't changed any settings then you need to use the `option + Tab` keys). We keep pressing the `Tab` key and we're taken to different elements of the webpage.

If you're on a laptop or desktop right now, and if you haven't tried it already, you can experience it yourself by pressing the `Tab` key a couple of times. The elements that get focussed and in what order are decided by their `"tabindex"` attribute.

### What is tabindex?

As the name suggests, `tabindex` is the index of tabbing and it is a global HTML attribute. It decides which elements on a page get focussed and in what order when keyboard navigation is done using the `Tab` key. It can take integer values: a lower positive value implies that the element will be reached (and focussed) ahead of others (including elements having `tabindex` of 0). Any negative value (usually `-1` is used) means that the element can't be reached by pressing the tab key alone.

Some interactive HTML elements like buttons, inputs, selects, anchor tags etc get a default `tabindex` value of 0, and these are the elements that usually get focussed when we do keyboard navigation.

Run the below CodeSandBox to see it in action. The `h2` element has a `tabindex` of `0`, and since it is present before the grid of buttons, it gets focused first when you press the `Tab` key, and then the buttons get focused one after another in the order they were added to the DOM, and so on. Notice that the button with tabindex -1 doesn't get focussed.

::media-embed
---
url: https://codesandbox.io/embed/basic-tab-index-demo-1s3ec9?fontsize=14&hidenavigation=1&theme=dark&view=preview?runonclick=1
---
:: 

### Shortcomings of the Tab key

If you tried navigating the previous grid, you'll notice the below problems

1. To get to the 9th button, 10 key presses are needed (one for the `h2` element, and then 9 more for the 9 buttons). And how do you go back and forth between these buttons? We can keep pressing the `Tab` key but that is not an optimal experience.
    
2. What if we wanted to start from the middle of the grid? We could give the middle button a positive `tabindex` value, but even though positive integers are valid values we should avoid using values greater than 0 (this is because it messes up the keyboard navigation for people using assistive technologies).
    
3. Similar to issue 1, if we've other focusable elements below the grid (e.g. the bottom `p` tag), then it will take a lot of key presses to reach there. How do we solve this?
    

## Grid Navigation using the Arrow Keys

We can improve our grid navigation by using the arrow keys. This will solve the 1st issue, and maybe the 3rd issue partially, but to solve it effectively we need to consider the grid as a single entity in terms of the tab stops. So the first tab key takes us to the h2 element, the second one takes us to the grid, and the third tab press takes us to the paragraph element. And to navigate inside the grid we use the arrow keys with the help of the roving tabindex technique.

### What is Roving tabindex?

To consider the grid as a single entity we need to assign a `tabindex` of -1 to all the inner buttons and give a `tabindex="0"` to that one button where the focus should land. Then we use `EventListeners` for tracking the key presses, and we keep roving this `tabindex="0"` and the corresponding focus to the appropriate button. At a time there will be only one button having a 0 tabindex.

This technique of managing focus inside a component using the tabindex attribute is called the roving tabindex technique. This also allows us to come back to the same element of the grid from where we tab away from it (this is a requirement for better accessibility).

## Roving tabindex implementation

Enough talk. Let's implement the "roving tabindex" technique for the below grid. You can try navigating this grid with your arrow keys after pressing the `Tab` key once.

::media-embed
---
url: https://codesandbox.io/embed/navigate-a-grid-using-keyboard-with-roving-tabindex-technique-v5ucrj?fontsize=14&hidenavigation=1&theme=dark&view=preview&runonclick=1
---
:: 

### Create a Grid of Buttons

Create a new react project with the create-react-app command or use whichever CRA alternative you prefer. Then create a new file called `GridNavigator.js` inside your `src` folder. Add the following code to the file.

```javascript
import { useRef } from "react";

export const GridNavigator = ({ rows, cols, start }) => {
  const currentIdx = useRef(start);

  return (
    <div>
      {Array.from(Array(rows), (_, row) => (
        <div key={`row-${row}`}>
          {Array.from(Array(cols), (_, col) => {
            const idx = `${row}${col}`;

            return (
              <button
                key={`col-${idx}`}
                tabIndex={currentIdx.current === idx ? "0" : "-1"}
              >
                {idx}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
```

This component takes the number of rows & columns from its parent and creates a corresponding grid of buttons. It also sets the `tabindex` of each of the buttons to -1 (except the button having its `idx === start`).

To test this `GridNavigator` you can call it inside your `App.js` file as shown below

```javascript
import { GridNavigator } from './GridNavigator';

import './App.css';

function App() {
  return (
    <div className="App">
      <GridNavigator rows={5} cols={5} start='24' />
    </div>
  );
}

export default App;
```

### Setting the Accessibility Attributes

It is a good practice to assign proper roles to each grid item for better accessibility. And you should also assign proper ARIA attributes to describe the grid to the users who take the help of assistive technologies. Below are some of the attributes we'll be using

* `role`: Since our grid is made up of interactive elements we'll be using `role="grid"` for the outermost div, `role="row"` for each row, and `role="gridcell"` for the buttons. Other possible replacements for the `grid` role is the `table` or the `treegrid` roles.
    
* `aria-label`: This can be used to give the grid a proper caption.
    
* `aria-rowcount` & `aria-colcount`: For mentioning the rows & columns count of the grid. These attributes need to be used on the outermost div having the `role`\="`grid".`
    
* `aria-rowindex` & `aria-colindex`: On each button having the role of `gridcell`, we should mention its row & column index.
    

For more details about various aria attributes related to the grid role, you can [visit this MDN link](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/grid_role).

Make minor adjustments to the code from the last section as shown below

```javascript
//... rest of the code
return (
  <div 
    role="grid"
    aria-label='A grid of buttons'
    aria-rowcount={rows} 
    aria-colcount={cols}
  >
    {Array.from(Array(rows), (_, row) => (
      <div key={`row-${row}`} role="row">
        {Array.from(Array(cols), (_, col) => {
          const idx = `${row}${col}`;

          return (
            <button
              key={`col-${idx}`}
              tabIndex={currentIdx.current === idx ? "0" : "-1"}
              role="gridcell"
              aria-rowindex={row}
              aria-colindex={col}
            >
              {idx}
            </button>
          );
        })}
      </div>
    ))}
  </div>
);
//... rest of the code
```

### Adding the key event listener

Add a key-down event listener on the outermost div. Apart from the event listener, we will give every button a ref so that we can use it to focus the appropriate button on arrow key presses.

Make the following changes to the `GridNavigator` component

```javascript
// import createRef
import { useRef, createRef } from 'react';
```

Inside the `GridNavigator` function, create a `ref` to store the references of all the grid buttons

```javascript
const btnRefs = useRef({});
```

Add the key event listener on the div with `role="grid"`. Also, create and add a ref to all the buttons

```javascript
return (
    <div
      role='grid'
      aria-label='A grid of buttons'
      aria-rowcount={rows}
      aria-colcount={cols}
      onKeyDown={onKeyDown}
    >
      {Array.from(Array(rows), (_, row) => (
        <div key={`row-${row}`} role='row'>
          {Array.from(Array(cols), (_, col) => {
            const idx = `${row}${col}`;
            // If we don't have a ref for this button, create it
            if (!btnRefs.current[idx]) {
              btnRefs.current[idx] = createRef();
            }

            return (
              <button
                key={`col-${idx}`}
                ref={btnRefs.current[idx]}
                tabIndex={currentIdx.current === idx ? '0' : '-1'}
                role='gridcell'
                aria-rowindex={row}
                aria-colindex={col}
              >
                {idx}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
```

Add the `onKeyDown` function along with the helper functions

```javascript
// Parses the row & col value of the currently selected button
const parseRowCol = () => {
  const row = parseInt(currentIdx.current[0], 10);
  const col = parseInt(currentIdx.current[1], 10);
  return { row, col };
};

// Moves the focus & saves the id of the newly focused button
const handleFocus = (row, col) => {
  currentIdx.current = `${row}${col}`;
  const btnRef = btnRefs.current[currentIdx.current];
  btnRef.current.focus();
};

// Handles keyboard events
const onKeyDown = (event) => {
  const { row, col } = parseRowCol();

  switch (event.key) {
    case 'ArrowUp':
      if (row > 0) {
        handleFocus(row - 1, col);
      }

      break;
    case 'ArrowDown':
      if (row < rows - 1) {
        handleFocus(row + 1, col);
      }

      break;
    case 'ArrowLeft':
      // If we're on the leftmost col then move to the extreme right
      // col of the previous row, provided it's not the first row
      if (col > 0) {
        handleFocus(row, col - 1);
      } else if (row > 0) {
        handleFocus(row - 1, cols - 1);
      }

      break;
    case 'ArrowRight':
      // If we're on the rightmost col then move to the first 
      // col of the next row, provided it's not the last row
      if (col < cols - 1) {
        handleFocus(row, col + 1);
      } else if (row < rows - 1) {
        handleFocus(row + 1, 0);
      }

      break;
    default:
      return;
  }
};
```

Now try navigating the grid using your keyboard. To start the navigation you need to press the `Tab` key which will put the focus on the button having `idx === start`. Afterwards, you can use your arrow keys to navigate the grid. To come out of the grid press the `Tab` key once more. If you try to focus the grid once more, your focus should land on the exact button where you left it.

This implementation solves all the problems we set out to solve. But some of the end users may not know that they can use the arrow keys to navigate the grid, so we mustn't rely on keyboard navigation alone.

## Conclusion

* Keyboard navigation is crucial for web accessibility and improves the user experience for those who depend on it.
    
* The roving tabindex method can enhance keyboard navigation for complicated interactive elements such as grids.
    
* Combining tabindex with correct accessibility attributes such as roles and ARIA attributes ensures that web applications are accessible to a broader audience, including those with disabilities.
    

Hope you enjoyed reading the article. If you found any mistake in the article please let me know in the comments so that I can fix it.

Cheers :-)
