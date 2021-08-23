# Agression Simulation

Aggresion Simulation is a simulation based on the video https://www.youtube.com/watch?v=YNMkADpvO4w. It's using
my self-made AI system to determine whether an AI entity is aggresive or not. It's also based on the video game
Spore, a fun cell-kind of video game.

It is not as advanced as you expect, I still have to work a lot on it. 

I worked on the graphics and a bit on the entities itself, but the actual random behaviour will be implemented soon.

- - -

## Tools I used

The following tools I used in order to made this project:

- Electron
- Express
- Socket.IO
- CanvasRenderingContext2D
- File system
- Some knowlegde of my previous AI-kind of project called 'Obama AI'.

## How you can use this

You can either install the built version or the Visual Studio solution.

To install the built version, go to 'releases' and select the built you want to try.
To install the solution version (source code), just download this repository or clone it using
the git command.

If you wanna build it by yourself, download the repository, go to terminal located in the source folder
and enter ``npm start build``.

## What do to once you are in

Since this project is all AI (kinda) driven, you can't do much except looking at how they perform. 
At the beginning, you will just see a group of cells in random sizes and directions. You won't see their
destination unless you toggle it, I made a option for that in the console.

Next to tweaking properties from global objects in the console, you can also interact with the scene.
When you are in the application/simulation, you can hold left CTRL to start panning or scaling (zooming).

To pan the simulation, hold left CTRL, your left mouse button and start moving your mouse.
To scale the simulation, hold left CTRL and start scrolling up or down.

This project is running on Electron so you can easily access the DevTools easily by hitting ``CTRL+SHIFT+I``.
Once you opened the DevTools window, head over to the ``console`` and start toggling options there.

There are 2 global objects you can tweak and take effect. The objects are:
- aiControllerOptions
- entityRenderOptions

I will list the options you can tweak down below with the description of what they do.

- - -

### aiControllerOptions

#### Global object

```js
// Just writing 'aiControllerOptions' in the console will return a object will looks like this.

{
    debug: 0
    showAnimationFrame: true
    showDirection: true
    showDirectionDistance: true
    showEndDestination: true
    updateAIInRenderView: false
}

```

```js

aiControllerOptions.debug = false || true; // Can be seen as a master switch to toggle the aiControllerOptions debug.

```
```js

aiControllerOptions.showAnimationFrame = false || true; // Will display the entity's animation frame.

```
```js

aiControllerOptions.showDirection = false || true; // Will show the entity's direction.

```
```js

aiControllerOptions.showDirectionDistance = false || true; // Will show the distance between the entity's direction and the entity itself.

```
```js

aiControllerOptions.showEndDestination = false || true; // Will render a circle where the entity's direction will end.

```
```js

/*
Will only update the entity's AI controller when they are in camera sight.
Enabling this will heavily decrease performance when having a huge amount of entities.

This option has been automatically set to false.
*/

aiControllerOptions.updateAIInRenderView = false || true; 

```

- - -

### entityRenderOptions

#### Global object.

```js
// Writing 'entityRenderOptions' in the console will return a object that looks like this.

{
    showBoundary: false
    useGravity: false
    useShadows: false
}

```

```js

entityRenderOptions.showBoundary = true || false; // Will render a square with the size of the entity to mark the entity's boundary.

```

```js

entityRenderOptions.useGravity = true || false; // Will use gravity on all entities. Looks fun, can be trippy something. 

```

```js

entityRenderOptions.useShadows = true || false; // Will render shadows on entities to give it a cooler view. 

```