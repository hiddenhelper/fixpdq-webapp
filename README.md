# FixPDQ Folder and Naming Conventions

## Requirements

- Node.JS v12 or greater

## Functional Component Development

We'll try to keep things simple and easy to maintain -  
Functional Component, @see https://reactjs.org/docs/hooks-intro.html#motivation 

## Global Statement Management with Hooks and Context 

- useState, useReducer, Context API allow us to achieve Redux-like functionality

## Folder Structure

### High Level Folder

- __build/__
  - build files 
- __public/__
  - index.html
  
### Source Folder Structure

- __components/__
  - Contains React components and views group by features
- __assets/__
  - Contains fonts, images
- __helpers/__
  - Common reusable utilities shared across components and or Storybook
- __services/__
  - Contains plain functions that call external resources. 3rd party API connections, utility services, service connectors 
- __stories/__
  - Folder for StoryBook UIs, components, etc 
- __semantic-ui/__
  - Themes folder which overrides Semantic UI styles
- __store/__
  - Contains files and folders for actions and reduces
  
## Naming Conventions

- Files and Folders
  - Use kebab-case 
  - eg. `work-items.js`, `work-items.views.js`, `authentication/`
- React component
  - kebab-case: `some-component.js`
  - PascalCase export: `export default SomeCompoent`

- React View / Presentation Layer
  - kebab-case: `some-component.view.js`
  - PasCaseExport: `export default SomeComponent`
  - File extension: some-component`.view.`js  

- LESS / Styles 
  - kebab-case: `component-style.less`
 
