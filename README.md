# CSS modules – a universal example

This isn't about what CSS modules are or if you should use
them. The following resources do a great job at that:

- Watch [The case for CSS modules](https://youtu.be/zR1lOuyQEt8)
  by Mark Dalgleish
- Read [CSS modules – welcome to
  the future](http://glenmaddern.com/articles/css-modules)
  by Glen Maddern

The aim of this repository is to show an example of how to
set up CSS modules with Webpack.

I struggled for hours with how to set up CSS modules so they
also worked without Javascript. I'm still not sure I've got it
totally figured out.

I will update this repository when I discover better ways of
doing things. Hopefully it can save you some of my pain.

## Let's start with some definitions

### Webpack

`npm i -D webpack` – [docs](https://webpack.github.io/docs)

**A module bundler for Javascript ... and more.**

In the old days, when Javascript was more of an afterthought,
it wasn't uncommon for a project to be developed with just one
big Javascript file. This was bad for maintainability and
encouraged bad practices like use of the global scope.

Thankfully, with the help of tools like Webpack, we can now
write our Javascript modularly. We can separate each module
into its own file and import dependencies as we need them.

```js
import something from './somewhere';
```

Webpack takes a Javascript file as an entry point into an
application. It runs through that file's dependencies,
and its dependents' dependencies, *bundling* all that code
into one Javascript file that can be added using a `script`
tag in our HTML.

I also write Javascript server-side, so I typically have two
Webpack bundles. One that takes `server.js` as an entry point.
Another that takes `client.js` as an entry point. This will
output two files. One that I run on the server and handles
HTTP requests. Another that *hydrates* my Javascript on the
client, handling future page interaction purely in the browser.

### Webpack loaders

`error: you can't npm install a concept` –
[docs](https://webpack.github.io/docs/loaders)

**Run tasks on the files that Webpack bundles.**

In your Webpack config, you can tell Webpack to run various
*loaders* on specific file types during bundle-time. For
example, you may want to run all of your Javascript files
through the  [Babel loader](https://github.com/babel/babel-loader)
to convert your ES2015+ syntax to regular ES5.

Loaders can be chained together, which can be very powerful.

### CSS loader

`npm i -D css-loader` –
[docs](https://github.com/webpack/css-loader)

**Import CSS files in Javascript as if it were another
Javascript file.**

You heard that right, it allows you to do this:

```js
import styles from './styles.css';
```

...and not error. Kind of messed up, right?

If you `console.log( styles )` in the above example you
would get an array that contains your styles in a format
Javascript can digest.

It's not so useful on its own, but this is where the
*style loader* comes in (remember how you can chain loaders).

### Style loader

`npm i -D style-loader` –
[docs](https://github.com/webpack/style-loader)

**Converts styles in Javascript format to good ol' CSS and
embeds it into the DOM.**

The output from the CSS loader can be ingested by the style
loader and converted into CSS. When the DOM loads, a `style`
tag is inserted into the HTML `head` with the CSS embedded
inside.

We now have functioning CSS that was imported using Javascript
like so:

```js
import './styles.css';
```

### CSS modules

`error: you can't npm install a concept` –
[docs](https://github.com/css-modules/css-modules)

**A spec that requires CSS class names to be scoped locally
by default**.

This means that in each CSS file, we can have the same basic
class names – `.header`, `.content` etc. These class names
will not be exposed globally, so will not clash. Rather, each
of our classes will be given a corresponding unique hash that
will be used in its place.

CSS loader has a CSS modules implementation built in. You
just need to enable it.

You will need to add the following loader setup to your
Webpack config. This chains the CSS loader (with CSS
modules mode turned on) and the style loader:

```js
{
  loader: [ 'style', 'css?modules' ],
  test: /\.css$/,
}
```

## All together now

All of the above is a very long-winded way of saying – *you
need to configure Webpack to include a loader chain with CSS
loader (in CSS modules mode) and style loader*.

### To recap

This will allow you to have a CSS file:

```css
.hello {
  font-weight: normal;
}
```

That you import into your Javascript file:

```js
import styles from './hello.css';
```

If you `console.log( styles )` you will now get:

```js
{
  hello: 'A_UNIQUE_HASH',
}
```

Which you could use like:

```js
document.body.innerHTML = `<h1 class="${ styles.hello }">Hola</h1>`;
```

And that would generate:

```html
<h1 class="A_UNIQUE_HASH">Hola</h1>
```

On DOM load your Javascript will then add the following to
the HTML `head`:

```html
<style type="text/css">
  .A_UNIQUE_HASH {
    font-weight: normal;
  }
</style>
```

And that will style your **hello** component.

## There's a problem

Once you get your head around all of the tools outlined above,
what they do, and in what order they need to do it, it all
seems pretty straight forward. Right?

But there's an elephant in the room. The same elephant that
keeps following me around whenever I'm playing with shiny new
Javascript tools and techniques.

### Server-side rendering

For a start, the style loader causes an error during
server-side bundle. There is no reference to `window`. This
makes sense since part of its job is to insert CSS into the
DOM.

Even if style loader did work, without client-side
Javascript it cannot insert the CSS into the DOM.
This means there will either be a
[FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)
whilst the Javascript loads, or just zero styling if
Javascript fails to load or is disabled.

## There's a solution

What's the desired solution here? This is the ~~best~~
only way I can think of to solve this problem.

We need to extract all of our styles into an external CSS
file, and `link` to it in the HTML template rendered on the
server. This way, client-side Javascript or not, we get
styling.

Then what about client-side? Well, it would be pointless to
insert more styles into the DOM if we have already loaded all
of our CSS.

Therefore, we need to work out how to do two things:

1. Extract the same styles that are being inserted into the
   DOM and place them into an external CSS file.
3. Make sure both our server- and client-side Javascript
   retain only the correct class name references, but none of
   the styles, and none of the functions for doing the style
   insertion into the DOM.

### Extract text Webpack plugin

`npm i -D extract-text-webpack-plugin` -
[docs](https://github.com/webpack/extract-text-webpack-plugin)

**Extract styles from your Javascript and output them into a
CSS file.**

We're in luck. There is a Webpack plugin that wraps our
loader chain and does exactly both of those things.

```js
{
  loader: ExtractTextWebpackPlugin.extract( 'style', 'css?modules' ),
  test: /\.css$/,
}
```

*Note: You will also need to enable the plugin in your
config.*

The setup I currently have is a little hacky. I am doing this
for both bundles, which means I am getting two CSS files
output. We only need one, so I instantly delete the other one.

What we really need is an option in this plugin to suppress
the CSS output.

## A working example

This repository is a working example of the method described
above. Please take a look through the code.

If you want to get it up and running:

```
git clone git@github.com:colinmeinke/css-modules-universal-example.git
cd css-modules-universal-example
npm install
npm run build
npm start
```

Now visit [http://localhost:3000](http://localhost:3000).

## Help make this better

If something is incorrect or you have a better solution please
[open an issue](https://github.com/colinmeinke/css-modules-universal-example/issues/new)
or
[fork it and make a pull request](https://github.com/colinmeinke/css-modules-universal-example#fork-destination-box).

I'm also on twitter
[@colinmeinke](https://twitter.com/colinmeinke).

Thanks :star2:
