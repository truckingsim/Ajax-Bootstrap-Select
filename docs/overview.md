In your project's Gruntfile, add a section named `{%= shortname(name) %}` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  {%= shortname(name) %}: {
    options: {
      // Task-specific options go here.
    },
    target: {
      // Target-specific file lists and/or options go here.
    }
  }
})
```