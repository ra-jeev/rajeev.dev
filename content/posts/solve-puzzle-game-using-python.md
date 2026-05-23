---
title: "Solving the turtle tiles puzzle game using Python"
description: "Learn how to solve a tiles puzzle game using python. A step by step guide listing the observations made for creating the algorithm with code."
date: "2022-11-17T12:18:20.988Z"
slug: "solve-puzzle-game-using-python"
cover: "/images/posts/solve-puzzle-game-using-python/MtqYZMQ4g-ccc02810d2.png"
tags:
  - "python"
  - "python3"
  - "game-development"
  - "python-projects"
draft: false
hashnodeId: "clal1gc70000508l51ya1ahj8"
---

## Introduction
This is a follow up of my [previous article](https://rajeev.dev/creating-puzzle-game-using-python-turtle-1) where we learnt to create a puzzle game using Python Turtle module. There we could generate as many new games as we wanted, and also replay a particular game unlimited number of times. 
But there was one important piece missing from the equation: finding the minimum number of moves needed to solve the puzzle (i.e. to remove all the tiles from the screen).

::media-embed
---
url: https://media.giphy.com/media/3o6Mb2KGFpsvvjWbPW/giphy.gif
---
::

Worry not! In this article we will look at a crude way of solving the puzzle. Then we'll try to optimize our solution and make it faster. Strap your seatbelts, here we go...

## Approach
As we had learnt in the last article, to clear the board we need to click on the solid color tiles. Any tile which is in the bottom row is clickable (and hence, solid), and tiles which are connected to these bottom row tiles become clickable if they have the same color (see the below image for understanding). When we click on a solid tile, that tile and all the connected tiles get removed from the screen. New connections are formed after every click following the earlier logic.

![figure.jpg](/images/posts/solve-puzzle-game-using-python/08SxOhgmR-4844fb2c0f.jpg)

Now that we understand the game, let's try to come up with a logic to find out the minimum number of moves needed to clear the screen. Below are my observations:

1. Even though we can click on any of the solid tiles (even if that tile is in, say 2nd or 3rd row), it is enough to always click on the bottom row tiles only
2. If more than one tile in the bottom row are connected to each other, it is enough to click on the tile having the lowest column index
3. For every move, we will have at most 5 choices (the 5 bottom row tiles). Overall there will be a lot of combinations of moves, and we'll need to go through all of them to find out the solution
4. After clicking a tile new connections are formed, and if we keep repeating the first 2 steps for any of the possible combinations, there will come a time when the board is clear
5. Finding one solution (one sequence of moves giving empty board) is sufficient for us

With these observations in mind, let's implement our algorithm.

## Implementation
Below is a screenshot of Nov 16-17, 2022's puzzle from the [original site](https://figure.game/). The same combination has been used to create this article's cover image. We'll use this as a reference to verify if our solution is correct (our solution should give us 8 minimum moves as the answer).

![Screen Shot 2022-11-16 at 10.59.22 PM.png](/images/posts/solve-puzzle-game-using-python/RMiUT4MyE-45f5a2e90a.png)

We won't be using any custom classes for this implementation, and will rely on good old lists and dictionaries.

### The `play` function

```python
from timeit import default_timer as timer
import copy

import AutoPlay

def play(colors):
    # Single game object which holds the tiles in play,
    # and the current connections groups and clickables
    game = {
        'tiles': [],
        'clickables': [],
        'connection_groups': []
    }

    # Set the board as per the input colors
    for col in range(AutoPlay.MAX_COLS):
        game['tiles'].append([])
        for row in range(AutoPlay.MAX_ROWS):
            tile = {'id': (row, col), "connections": [],
                    "clickable": False, "color": colors[col][row]}
            game['tiles'][col].append(tile)

    # Go through the tiles and find out the connections
    # between them, and also save the clickables
    for col in range(AutoPlay.MAX_COLS):
        AutoPlay.process_tile(game, 0, col)

    start = timer()
    print(f'start time: {start}')

    # Create as many tasks as there are connection groups.
    # We're using deepcopy to create a deeply cloned game
    # object for each task. The current move is the first
    # entry of every connection group (the lowest column
    # index in the bottom row)
    tasks = []
    for connections in game['connection_groups']:
        g = copy.deepcopy(game)
        tasks.append(
            {'game': g, 'curr_move': connections[0], 'past_moves': None})

    # Find the minimum number of moves for the above tasks
    result = find_min_moves(tasks)
    print('result of operation:', result)
``` 

### The `find_min_moves` function

```python
def find_min_moves(jobs):
    result = {'min_moves': None, 'min_moves_len': 0, 'count': 0}

    while True:
        # See if we've any jobs left. If there is no job, break the loop
        job = jobs.pop() if len(jobs) > 0 else None
        if job is None:
            print(
                f'No more jobs: final count: {result["count"]}, time: {timer()}')
            break

        # Handle the current job. This will take of the combinations till its logical
        # end (until the board is clear). Other encountered combinations will be added
        # to the job list for processing in due course
        final_moves_seq = AutoPlay.handle_job_recurse(job, jobs)

        result['count'] += 1

        # If the one processed combination has minimum length, then that is the minimum
        # numbers of moves needed to solve the puzzle
        if result['min_moves_len'] == 0 or len(final_moves_seq) < result['min_moves_len']:
            result['min_moves'] = final_moves_seq
            result['min_moves_len'] = len(final_moves_seq)
            print(
                f'changed min_moves to: {result["min_moves_len"]}, {final_moves_seq}, time: {timer()}')

    return result
``` 

### The `AutoPlay` module
Some of the functions are almost the same as in the previous article (small modifications needed for adjusting to non-class approach). You can refer to the first article to get better clarity on these functions.

```python
import copy

MAX_COLS = 5
MAX_ROWS = 5

def get_node(tiles, row, col):
    if 0 <= col <= MAX_COLS - 1 and 0 <= row <= MAX_ROWS - 1:
        col_tiles = tiles[col]
        return col_tiles[row] if row < len(col_tiles) else None

def connectable(tiles, first_node, row, col):
    other_node = get_node(tiles, row, col)
    if other_node and first_node['color'] == other_node['color']:
        if other_node['clickable']:
            return True

        return (row, col)

def process_tile(game, row, col):
    curr_node = get_node(game['tiles'], row, col)
    if not curr_node or curr_node['clickable']:
        return

    has_clickable_connections = {
        'prev': connectable(game['tiles'], curr_node, row, col - 1),
        'next': connectable(game['tiles'], curr_node, row, col + 1),
        'below': connectable(game['tiles'], curr_node, row - 1, col),
        'above': connectable(game['tiles'], curr_node, row + 1, col)
    }

    if row == 0 or True in has_clickable_connections.values():
        curr_node['clickable'] = True
        if has_clickable_connections['next']:
            curr_node['connections'].append((row, col + 1))
        if has_clickable_connections['above']:
            curr_node['connections'].append((row + 1, col))

        if (row, col) not in game['clickables']:
            game['clickables'].append((row, col))

        found = False
        for connections in game['connection_groups']:
            if (row, col) in connections:
                found = True
                break

        if not found:
            game['connection_groups'].append([(row, col)])

        for value in has_clickable_connections.values():
            if isinstance(value, tuple):
                for connections in game['connection_groups']:
                    if (row, col) in connections and value not in connections:
                        connections.append(value)
                        break
                process_tile(game, *value)

def handle_tile_click(game, tile_id):
    # Go through each of the connection groups and find the one containing this tile
    for connections in game['connection_groups']:
        if tile_id in connections:
            # Sort the tiles in reverse order so that we remove them from screen
            # from the top right
            tiles_to_remove = sorted(connections, reverse=True)

            # Make all the clickable tiles as unclickable, as connections will be reformed
            for clickable in game['clickables']:
                game['tiles'][clickable[1]][clickable[0]]['clickable'] = False

            # Actually remove the tiles one by one from the screen
            for tile_to_remove in tiles_to_remove:
                game['tiles'][tile_to_remove[1]].pop(tile_to_remove[0])

                # Change the id of each of the tiles above the removed tile
                for row in range(tile_to_remove[0], len(game['tiles'][tile_to_remove[1]])):
                    game['tiles'][tile_to_remove[1]][row]['id'] = (
                        row, tile_to_remove[1])
            break

    game['clickables'].clear()
    game['connection_groups'].clear()
    # Form fresh connections and find the clickables
    for col in range(MAX_COLS):
        process_tile(game, 0, col)

def handle_job_recurse(job, job_list):
    game = job['game']

    handle_tile_click(game, job['curr_move'])

    # Add the currently executed move to the past_moves sequence (Only storing the
    # column id, as row id will always be 0)
    if job['past_moves'] is None:
        job['past_moves'] = f'{job["curr_move"][1]}'
    else:
        job['past_moves'] = f'{job["past_moves"]}{job["curr_move"][1]}'

    # If after the click no new connection groups are left, then that means we've
    # cleared the screen, so return this sequence
    if len(game['connection_groups']) == 0:
        return job['past_moves']

    # Add the other possible combinations to the job list (we'll be taking the
    # 0th index till completion, hence slicing the list from the 1st index)
    for connections in game['connection_groups'][1:]:
        job_list.append({'game': copy.deepcopy(
            game), 'curr_move': connections[0], 'past_moves': job['past_moves']})

    # Take the 0th index to its logical end. 0th index gives us a list which
    # contains all the tiles connected with each other. We take the first tile
    # from this list (the 0th index), and use recursion to go further
    job['curr_move'] = game['connection_groups'][0][0]

    return handle_job_recurse(job, job_list)
``` 

### The result
Running the code by using the board from today's puzzle (shown earlier) we get the following results

```python
play([
    ['hot pink', 'turquoise', 'hot pink', 'hot pink', 'yellow'],
    ['white', 'turquoise', 'yellow', 'white', 'hot pink'],
    ['yellow', 'white', 'hot pink', 'hot pink', 'turquoise'],
    ['white', 'hot pink', 'turquoise', 'white', 'turquoise'],
    ['white', 'hot pink', 'white', 'white', 'turquoise']
])
```

```
start time: 0.060289866
changed min_moves to: 13, 3000011111233, time: 0.068856064
changed min_moves to: 12, 300001111142, time: 0.069172283
changed min_moves to: 11, 30003114012, time: 2.164211921
changed min_moves to: 10, 3003114002, time: 9.825066422
changed min_moves to: 9, 303104002, time: 26.712916026
changed min_moves to: 8, 10010012, time: 110.70025369
No more jobs: final count: 1389898, time: 214.573611255
result of operation: {'min_moves': '10010012', 'min_moves_len': 8, 'count': 1389898}
``` 

And voila, we got the minimum moves length as 8, same as the original puzzle wanted. It took us around 3 minutes and 35 seconds to get the solution. `'min_moves': '10010012'` gives us the column indices of the bottom row which we need to click one after the other to clear the screen. In total, we processed 1389898 sequences, that is close to 1.39 million sequences (Wow!).

::media-embed
---
url: https://media.giphy.com/media/UtEUhkfriklonVdweC/giphy.gif
---
::

Or is it?

## First optimization
Even though this is working, for a different puzzle which requires, say 13 or 14 moves, our code will take much longer to give us a solution. Can we optimize our solution somehow?

If you think about it, we don't need to take all the sequences to their logical end. If any sequence has already had `"min_moves_len - 1"` past moves, and there still are `connection_groups` left, then there is no point in pursuing this sequence. That is because, in the best case it will give us the same `min_moves_len` (if we assume that the next click will clear the screen), but in all the other cases we'll get a final sequence length which is more than the `min_moves_len`. 

Keeping the above observation in mind, we will not be adding such combinations to the job list. Let's make the needed changes:

### Modified `find_min_moves` function

```python
def find_min_moves(jobs):
    result = {'min_moves': None, 'min_moves_len': 0, 'count': 0}

    while True:
        # See if we've any jobs left. If there is no job, break the loop
        job = jobs.pop() if len(jobs) > 0 else None
        if job is None:
            print(
                f'No more jobs: final count: {result["count"]}, time: {timer()}')
            break

        # Handle the current job. This will take of the combinations till its logical
        # end (until the board is clear). Other encountered combinations will be added
        # to the job list for processing in due course
        final_moves_seq = AutoPlay.handle_job_recurse(
            job, jobs, result['min_moves_len']) # Sending the current min_moves_len

        result['count'] += 1

        # If the one processed combination has minimum length, then that is the minimum
        # numbers of moves needed to solve the puzzle
        # Now, final_moves_seq can be returned as None, so taking that into account
        if result['min_moves_len'] == 0 or (final_moves_seq is not None
                                            and len(final_moves_seq) < result['min_moves_len']):
            result['min_moves'] = final_moves_seq
            result['min_moves_len'] = len(final_moves_seq)
            print(
                f'changed min_moves to: {result["min_moves_len"]}, {final_moves_seq}, time: {timer()}')

    return result
``` 

### Modified `handle_job_recurse` function

```python
def handle_job_recurse(job, job_list, curr_min_moves_len):
    game = job['game']

    handle_tile_click(game, job['curr_move'])

    # Add the currently executed move to the past_moves sequence (Only storing the
    # column id, as row id will always be 0)
    if job['past_moves'] is None:
        job['past_moves'] = f'{job["curr_move"][1]}'
    else:
        job['past_moves'] = f'{job["past_moves"]}{job["curr_move"][1]}'

    # If after the click no new connection groups are left, then that means we've
    # cleared the screen, so return this sequence
    if len(game['connection_groups']) == 0:
        return job['past_moves']

    # If there is some min_moves_len and past_moves sequence length is more than 
    # or equal to min_moves_len - 1, then discard all further combinations in this sequence
    if curr_min_moves_len != 0 and len(job['past_moves']) >= (curr_min_moves_len - 1):
        return None

    # Add the other possible combinations to the job list (we'll be taking the
    # 0th index till completion, hence slicing the list from the 1st index)
    for connections in game['connection_groups'][1:]:
        job_list.append({'game': copy.deepcopy(
            game), 'curr_move': connections[0], 'past_moves': job['past_moves']})

    # Take the 0th index to its logical end. 0th index gives us a list which
    # contains all the tiles connected with each other. We take the first tile
    # from this list (the 0th index), and use recursion to go further
    job['curr_move'] = game['connection_groups'][0][0]

    return handle_job_recurse(job, job_list, curr_min_moves_len)
``` 

### The result
Running the same starting board as in the previous run, we get the following results

```
start time: 0.116954505
changed min_moves to: 13, 3000011111233, time: 0.129312172
changed min_moves to: 12, 300001111142, time: 0.130486732
changed min_moves to: 11, 30003114012, time: 0.642993931
changed min_moves to: 10, 3003114002, time: 1.395034809
changed min_moves to: 9, 303104002, time: 2.094061232
changed min_moves to: 8, 10010012, time: 3.78454475
No more jobs: final count: 16724, time: 4.46511333
result of operation: {'min_moves': '10010012', 'min_moves_len': 8, 'count': 16724}
``` 

It took us only 4.46 seconds to complete the job, and there were only 16.7K sequences which were taken to their logical end. Now we're talking :-)

::media-embed
---
url: https://media.giphy.com/media/KnKSXq9qxgZDa/giphy.gif
---
::

## Conclusion
In this post we looked at one crude way of solving the puzzle which we'd created in the last post. The solution is by no means complete, or fully optimized. We can do many optimizations to find the solution sooner. We will look at some of those optimizations in the next and the final post of this series.

Hope you enjoyed reading the post. Do let me know how would you solve the problem :-).
