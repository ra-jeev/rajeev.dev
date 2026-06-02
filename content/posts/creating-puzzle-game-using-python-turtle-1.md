---
title: "Creating a puzzle game using Python Turtle module"
description: "Learn how to make a tiles puzzle game using classes and objects with Python Turtle module."
date: "2022-11-09T19:01:41.374Z"
slug: "creating-puzzle-game-using-python-turtle-1"
cover: "/images/posts/creating-puzzle-game-using-python-turtle-1/_9kdsc3MI-dbef1a3c76.jpg"
tags:
  - "python"
  - "python3"
  - "game-development"
  - "python-projects"
  - "python-turtle"
draft: false
hashnodeId: "claa0c7zy000108kx8sa03omt"
---

To read the second installment of this series, please visit [this link](https://rajeev.dev/solve-puzzle-game-using-python)

## The inspiration
Couple of months back came across a [twitter post](https://twitter.com/sumul/status/1545430273113866240?s=20&t=Z60P7bP3Y40QxmZf9PfhVA) announcing a daily puzzle game. Maybe it was the FOMO created by the Wordle bandwagon (never played that), but I really liked this puzzle game. I've been a regular player of it since then, breaking the streak only 3-4 times. You can try out the original game [here](https://figure.game/)

::media-embed
---
url: https://media.giphy.com/media/u10GReM6igVGg/giphy.gif
---
::

Over the period I've been getting the itch to implement the game logic myself. I've also been dabbling in basic Python in recent times, so I thought why not implement it using Python Turtle module itself? And hence the post :-)

## The game
The game idea is very simple. There are some tiles (5 x 5 grid) on the screen. All the tiles present in the bottom row are clickable (represented as solid color tiles), and any tile of same color connected to these bottom row tiles are also clickable (see the cover image for an example). When we click on these clickable tiles, the clicked tile as well as the connected tiles get removed from the screen. New connections are formed after every click, following the same earlier logic. 

The game ends when all the tiles are removed from the screen in a given number of moves (the minimum moves needed to remove all the tiles).

## The implementation
To keep it simple, we're not going to worry about the minimum moves part in this article, and will only implement the new game creation and its game play part. In the next article we will look at a crude implementation of how we can find out the minimum number of moves needed for a given game board.

::media-embed
---
url: https://media.giphy.com/media/IHnROpQICe4kE/giphy.gif
---
::

You can check out the screen grab of the actual game play of this below

::media-embed
---
url: https://www.youtube.com/watch?v=cRfjimU5KyQ
---
::

### Setting up the screen
This part is pretty easy. We import the Turtle module and create the screen, and a turtle (named pen) for drawing everything on the screen.

```python
import turtle
from random import choice

import settings
from Game import Game

def init_game_screen():
    '''Init the turtle screen and create a pen for drawing on 
      that screen. Also, hiding the pen as we don't really need 
      to see it.
    '''
    screen = turtle.Screen()
    screen.screensize(settings.canv_width(),
                      settings.canv_height(), 'midnight blue')
    screen.setup(settings.win_width(), settings.win_height())
    screen.title('Figure')
    screen.tracer(0)

    pen = turtle.Turtle()
    pen.pensize(settings.OUTER_OUTLINE)
    pen.penup()
    pen.hideturtle()

    return screen, pen
```

Here `settings` is a simple module where the game constants, and some utility methods are present. Note that we've put the screen tracer value to 0 (`screen.tracer(0)`) as we don't want the inbuilt turtle screen refresh delay to make our game sluggish.

### Generating the board
We use the `random` module to get a random color (from `COLORS = ['hot pink', 'white', 'yellow', 'turquoise']`) for each tile. List comprehension makes the code shorter, or we can use nested for loops to get the same result.

```python
def init_game_colors():
    return [[choice(settings.COLORS) for _ in range(settings.MAX_ROWS)]
            for _ in range(settings.MAX_COLS)]
```

Note that we are storing the tiles colors as rows of columns (`colors[col][row]` will give us the color of a particular tile). This will helps us in breaking out early while iterating over the tiles during the game play (if there is no tile in a column at say row index 1, then there won't be any tile above it at indices 2, 3 etc. also).

```python
def play():
    screen, pen = init_game_screen()
    game = {
        'obj': None,
        'colors': []
    }

    start_game(screen, pen, game)

    screen.onkeypress(lambda: start_game(screen, pen, game, True), 'space')
    screen.onkeypress(lambda: start_game(screen, pen, game), 'n')
    screen.listen()

    screen.mainloop()

if __name__ == '__main__':
    play()
```

We've also added the options to start a new game, or to replay the current game. We've used the `n` and the `space` keys for the corresponding actions. The same screen and pen is reused over multiple game plays.

```python
def start_game(screen, pen, game, replay=False):
    if not replay or len(game['colors']) == 0:
        game['colors'] = init_game_colors()

    if game['obj'] is None:
        game['obj'] = Game(game['colors'], screen, pen)
    else:
        game['obj'].reset(game['colors'])

    pen.clear()
    game['obj'].start()
```

Since the same function is being used for a new, or a replay game, we clear the drawings made by the pen (`pen.clear()`) before actually starting the game. I wanted to reuse the existing game class obj even for a new game, that's why we see a `reset()` method lurking there.

::media-embed
---
url: https://media.giphy.com/media/3o6YfXtqIrtPrApeuI/giphy.gif
---
::

### The `Tile` class
The `Tile` class just stores the information related to a particular tile, and should be self explanatory. The only important thing to note is the `tile_id`, stored as (`self._id`). Tile id is being saved as a tuple of form (row, col). This is why when we calculate the x, y position of the tile on the screen, we use `self._id[1]` for getting the column index, and `self._id[0]` for getting the row index. This is opposite to how we are iterating for generating the colors, or how we'll iterate during the game play. We can change this for consistency if we want to. I haven't changed it, as initially my iterations were columns of rows instead of the current rows of columns, and I am too lazy to change everything now.

```python
import settings

class Tile:
    def __init__(self):
        self._id = None
        self._clickable = False
        self._color = None
        self._shape = None
        self._x = 0
        self._y = 0
        self._x_bounds = [0, 0]
        self._y_bounds = [0, 0]
        self._connections = []

    def set_tile_props(self, tile_id, color=None):
        self._id = tile_id
        self._clickable = False
        self._connections.clear()

        if color:
            self._color = color

            index = settings.COLORS.index(color)
            self._shape = settings.INNER_SHAPES[index]

        self._x = (self._id[1] - (settings.MAX_COLS - 1) / 2) * \
            (settings.OUTER_TILE_SIZE + settings.TILES_GAP)
        self._y = (self._id[0] - (settings.MAX_ROWS - 1) / 2) * \
            (settings.OUTER_TILE_SIZE + settings.TILES_GAP)

        self._x_bounds[0] = self._x - settings.OUTER_TILE_SIZE / 2
        self._x_bounds[1] = self._x + settings.OUTER_TILE_SIZE / 2
        self._y_bounds[0] = self._y - settings.OUTER_TILE_SIZE / 2
        self._y_bounds[1] = self._y + settings.OUTER_TILE_SIZE / 2

    def add_connection(self, conn_id):
        self._connections.append(conn_id)

    def connections(self):
        return self._connections

    def in_bounds(self, x, y):
        return self._x_bounds[0] <= x <= self._x_bounds[1] and \
            self._y_bounds[0] <= y <= self._y_bounds[1]

    def id(self):
        return self._id

    def color(self):
        return self._color

    def pos(self):
        return self._x, self._y

    def shape(self):
        return self._shape

    def clickable(self, can_click=None):
        if can_click is not None:
            self._clickable = can_click
        else:
            return self._clickable
``` 

### The `Game` class
This is the brain of the game. We will go through this class step by step.

#### The `constructor` & the `reset` method
```python
from Tile import Tile
import settings

class Game:
    def __init__(self, colors, screen, pen):
        self.screen = screen
        self.pen = pen
        self.tiles = []
        self.cache = []
        self.colors = colors
        self.clickables = []
        self.connection_groups = []
        self.moves = 0

    def reset(self, colors):
        self.tiles.clear()
        self.colors = colors
        self.clickables.clear()
        self.connection_groups.clear()
        self.moves = 0
``` 

The variables to note here are `tiles`, `cache`, `clickables` & `connection_groups`. 

- `tiles`: stores the tiles currently being shown on the screen
- `cache`: stores the tiles which have been removed from the screen (Don't really need it, but we'll be reusing the tiles for a new game or a replay, and hence the presence).
- `clickables`: stores the ids of tiles which are clickable at the moment
- `connections_groups`: is a list which stores lists of ids, of clickable interconnected tiles

#### The `start` and other relevant methods
Below is the code for the `start` method which internally calls `create_tiles` & `draw_board` methods. Notice that till now we haven't really stated listening to tiles clicks events (no point if the game hasn't started yet, right?). We start doing this by listening to screen clicks, and then figuring out which tile was clicked.

```python
def start(self):
    self.create_tiles()

    self.draw_board()

    self.write_text(0, -self.screen.window_height() /
                    2 + 100, 'Click any of the colored tiles', 18)
    self.screen.onclick(self.on_screen_click)

def create_tiles(self):
    for col in range(settings.MAX_COLS):
        self.tiles.append([])
        for row in range(settings.MAX_ROWS):
            tile = self.cache.pop() if len(self.cache) > 0 else Tile()
            tile.set_tile_props((row, col), self.colors[col][row]) # tile_id being set as (row, col)
            self.tiles[col].append(tile)

def write_text(self, x, y, text, size):
    if self.pen.color() != 'white':
        self.pen.color('white')

    self.pen.goto(x, y)
    self.pen.write(text, align='center', font=('Courier', size, 'normal'))
```

#### The `draw_board` method
This is an important method. Its job is to figure out the connections, draw the tiles and make the screen ready for the user. It's like a manager who is going to give the demo, hoping that everyone has done their job correctly. 

We don't want no broken windows, do we? ;-)

::media-embed
---
url: https://media.giphy.com/media/QWjyvdpMDYKbOFLdIv/giphy.gif
---
::

```python
def draw_board(self):
    for col in range(settings.MAX_COLS):
        self.process_tile(0, col)

    self.draw_tiles()

    self.write_text(0, self.screen.window_height() / 2 - 80, 'Figure', 42)
    if len(self.clickables) == 0:
        self.screen.onclick(None)
        self.write_text(0, 80, 'Game Over', 36)
        self.write_text(0, 50, f'Total {self.moves} moves', 20)
        self.write_text(0, -60, 'Press "space" to replay', 20)
        self.write_text(0, -90, 'Press "n" to start a new game', 20)
    else:
        self.write_text(0, self.screen.window_height() /
                        2 - 140, f'{self.moves} moves', 20)

    self.screen.update()
```

Notice the `self.screen.update()` call at the end. Since we had turned off the tracer while creating the screen, we will need to refresh the screen ourselves, the method call does precisely that. 

The code below iterates over the bottom row of the tiles, and makes the tiles present as clickable. Every tile, in turn, figures out if we need to go further down the tree and find out other connectable tiles.

```python
for col in range(settings.MAX_COLS):
    self.process_tile(0, col)
```

#### The `process_tile` & other related methods
This method figures out which of the tiles are interconnected. We need to call this method before calling `draw_tiles`, as `draw_tiles` will also draw the connections on the screen.

```python
def get_node(self, row, col):
    if 0 <= col <= settings.MAX_COLS - 1 and 0 <= row <= settings.MAX_ROWS - 1:
        col_tiles = self.tiles[col]
        return col_tiles[row] if row < len(col_tiles) else None

def process_tile(self, row, col):
    curr_node = self.get_node(row, col)
    if not curr_node or curr_node.clickable():
        return

    has_clickable_connections = {
        'prev': self.connectable(curr_node, row, col - 1),
        'next': self.connectable(curr_node, row, col + 1),
        'below': self.connectable(curr_node, row - 1, col),
        'above': self.connectable(curr_node, row + 1, col)
    }

    if row == 0 or True in has_clickable_connections.values():
        curr_node.clickable(True)
        if has_clickable_connections['next']:
            curr_node.add_connection((row, col + 1))
        if has_clickable_connections['above']:
            curr_node.add_connection((row + 1, col))

        if (row, col) not in self.clickables:
            self.clickables.append((row, col))

        found = False
        for connections in self.connection_groups:
            if (row, col) in connections:
                found = True
                break

        if not found:
            self.connection_groups.append([(row, col)])

        for value in has_clickable_connections.values():
            if isinstance(value, tuple):
                for connections in self.connection_groups:
                    if (row, col) in connections and value not in connections:
                        connections.append(value)
                        break
                self.process_tile(*value)
```

We get the `current_node` and if the node is not there, or if it is already clickable then we return from the function as no further processing is needed.
```python
curr_node = self.get_node(row, col)
if not curr_node or curr_node.clickable():
    return
```

Then we look around the current node and see if we can become a clickable node by virtue of being connected to another clickable node of same color.

::media-embed
---
url: https://media.giphy.com/media/mfGkfzHM3KfdI0OmIW/giphy.gif
---
::

```python
has_clickable_connections = {
    'prev': self.connectable(curr_node, row, col - 1),
    'next': self.connectable(curr_node, row, col + 1),
    'below': self.connectable(curr_node, row - 1, col),
    'above': self.connectable(curr_node, row + 1, col)
}
```

*The `connectable` method*
```python
def connectable(self, first_node, row, col):
    other_node = self.get_node(row, col)
    if other_node and first_node.color() == other_node.color():
        if other_node.clickable():
            return True

        return (row, col)
```

The `connectable` method returns true if the other node exists, is clickable and of the same color. If it is of the same color but not currently clickable, then it returns its calling card (the tile_id). We do this because we need to traverse the tree, and if possible, make this node also clickable. 

::media-embed
---
url: https://media.giphy.com/media/YpvufSuDWxOEB9LwNW/giphy.gif
---
::

Rest of the code in the `process_tile` method is simply about making the current_node clickable based on above findings, and then traverse the tree based on whoever gave their calling cards. We also save the respective ids of the clickable and connected nodes in appropriate locations for game play.

```python
if row == 0 or True in has_clickable_connections.values():
    curr_node.clickable(True)
    # Every clickable node will only store the forward connections (next or above)
    if has_clickable_connections['next']: 
        curr_node.add_connection((row, col + 1))
    if has_clickable_connections['above']:
        curr_node.add_connection((row + 1, col))

    if (row, col) not in self.clickables:
        self.clickables.append((row, col))

    # We find the appropriate list where this id is already present
    found = False
    for connections in self.connection_groups:
        if (row, col) in connections:
            found = True
            break

    if not found:
        # Append a new list containing the tile_id to the connection_groups
        self.connection_groups.append([(row, col)])

    for value in has_clickable_connections.values():
        # Here if we've a tuple, means we need to traverse that node
        # Also, we need to add this node to the connection list
        if isinstance(value, tuple):
            for connections in self.connection_groups:
                if (row, col) in connections and value not in connections:
                    connections.append(value)
                    break
            # Recursive call to traverse this node
            self.process_tile(*value)
```

We can optimize the finding of appropriate connection_group list where we need to append the next node. We can do this by finding and storing the list index from the previous call and use that later.

#### The `draw_tiles` & `draw_tile` method
This is quite straight forward.

```python
def draw_tiles(self):
    for col_tiles in self.tiles:
        for tile in col_tiles:
            if not tile: # there won't be any tile above it also, so break
                break

            self.draw_tile(tile)

def draw_tile(self, tile):
    pen = self.pen
    pos = tile.pos()
    pen.goto(pos)
    pen.shape('square')
    pen.color(tile.color())
    if not tile.clickable():
        pen.fillcolor('midnight blue')
    pen.shapesize(settings.OUTER_SIZE_MULTIPLIER,
                  settings.OUTER_SIZE_MULTIPLIER, settings.OUTER_OUTLINE)
    pen.stamp()

    if tile.clickable():
        pen.color('midnight blue')
    else:
        pen.color(tile.color())
    pen.shapesize(settings.INNER_SIZE_MULTIPLIER,
                  settings.INNER_SIZE_MULTIPLIER, settings.INNER_OUTLINE)

    tilt = 0
    if tile.shape() == 'diamond':
        pen.shape('square')
        pen.tilt(45)
        tilt = -45
    else:
        pen.shape(tile.shape())
        if tile.shape() == 'triangle':
            pen.tilt(90)
            tilt = -90

    pen.stamp()
    pen.tilt(tilt)

    tile_id = tile.id()
    connections = tile.connections()
    if (tile_id[0], tile_id[1] + 1) in connections:
        pen.goto(pos[0] + settings.OUTER_TILE_SIZE / 2, pos[1])
        pen.color(tile.color())
        pen.pendown()
        pen.setx(pen.xcor() + settings.TILES_GAP)
        pen.penup()
    if (tile_id[0] + 1, tile_id[1]) in connections:
        pen.goto(pos[0], pos[1] + settings.OUTER_TILE_SIZE / 2)
        pen.color(tile.color())
        pen.pendown()
        pen.sety(pen.ycor() + settings.TILES_GAP)
        pen.penup()
```

#### The `on_screen_click` method
This is the method which gets called when we click anywhere on the screen. It gives us the (x, y) co-ordinates of the point where the click occurred.

```python
def on_screen_click(self, x, y):
    # Step size is nothing but one tile size + the gap 
    # between two consecutive tiles
    extreme_x = (settings.MAX_COLS - 1) / 2 * \
        settings.STEP_SIZE + settings.OUTER_TILE_SIZE / 2
    extreme_y = (settings.MAX_ROWS - 1) / 2 * \
        settings.STEP_SIZE + settings.OUTER_TILE_SIZE / 2

    # If the click is within the tiles area, then only we'll proceed further
    if -extreme_x <= x <= extreme_x and -extreme_y <= y <= extreme_y:
        clicked_tile_id = None
        # To proceed further, we only look at the clickable tiles 
        for clickable in self.clickables:
            if self.tiles[clickable[1]][clickable[0]].in_bounds(x, y):
                clicked_tile_id = clickable
                break

        if clicked_tile_id:
            # Increment the total moves if we've a valid tile click
            self.moves += 1
            self.handle_tile_click(clicked_tile_id)
```

#### The `handle_tile_click` method
Here we take care of the tile click by deleting that tile and the other connected tiles.

```python
def handle_tile_click(self, tile_id):
    # Find out the connection group which this tile belongs to
    for connections in self.connection_groups:
        if tile_id in connections:
            # We'll be deleting the tiles from top to bottom so we sort 
            # in reverse order. The reason is the same, we don't want 
            # to delete a lower row index tile and then find out that we
            # need to delete the above one as well
            tiles_to_remove = sorted(connections, reverse=True)

            # Make all the nodes unclickable as we'll be reprocessing
            # all the remaining tiles
            for clickable in self.clickables:
                self.tiles[clickable[1]][clickable[0]].clickable(False)

            for tile_to_remove in tiles_to_remove:
                # using pop() to get the removed item so that we can add
                # it to the cache
                tile = self.tiles[tile_to_remove[1]].pop(tile_to_remove[0])
                self.cache.append(tile)

                # After removing a tile, we need to change the tile_id (basically 
                # the row index) of all the tiles above it
                # Notice the appropriate use of row and col indices while getting 
                # the tile from tiles list, and while using it as tile_id (opposite)
                for row in range(tile_to_remove[0], len(self.tiles[tile_to_remove[1]])):
                    self.tiles[tile_to_remove[1]][row].set_tile_props(
                        (row, tile_to_remove[1]))
            break # if we found the appropriate connection_group then need to break

    # Clear everything as we need to remake the connections and redraw the board
    self.clickables.clear()
    self.connection_groups.clear()
    self.pen.clear()

    self.draw_board()
```

### The `settings` module
```python
DEF_TILE_SIZE = 20 # This is the default turtle size

MAX_COLS = 5
MAX_ROWS = 5

TILES_GAP = 12
OUTER_SIZE_MULTIPLIER = 2 # We make the tile 2X the default turtle size
OUTER_OUTLINE = 4

INNER_SIZE_MULTIPLIER = 0.6 # For the inner shapes (triangle, circle etc.)
INNER_OUTLINE = 1

COLORS = ['hot pink', 'white', 'yellow', 'turquoise']
INNER_SHAPES = ['triangle', 'square', 'circle', 'diamond']

OUTER_TILE_SIZE = DEF_TILE_SIZE * OUTER_SIZE_MULTIPLIER
INNER_TILE_SIZE = DEF_TILE_SIZE * INNER_SIZE_MULTIPLIER

STEP_SIZE = OUTER_TILE_SIZE + TILES_GAP

def canv_width():
    return MAX_COLS * OUTER_TILE_SIZE + (MAX_COLS - 1) * TILES_GAP

def canv_height():
    return MAX_ROWS * OUTER_TILE_SIZE + (MAX_ROWS - 1) * TILES_GAP

def win_width():
    return canv_width() + 4 * OUTER_TILE_SIZE

def win_height():
    return canv_height() + 8 * OUTER_TILE_SIZE
```

And that's it. The game is done. 

::media-embed
---
url: https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/giphy.gif
---
::

Thanks for sticking through the article. Please feel free to reach out if you've any questions, or if you find any mistake anywhere.

Have fun playing the game :-)
