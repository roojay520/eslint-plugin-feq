# eslint-plugin-feq

Custom rules.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
npm i eslint --save-dev
```

Next, install `eslint-plugin-feq`:

```
npm install eslint-plugin-feq --save-dev
```

## Usage

Add `feq` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["feq"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "feq/no-undef": ["error", { "prefix": "JSP__" }]
  }
}
```

## Supported Rules

- Fill in provided rules here
  - [feq/no-undef](docs/rules/no-undef.md): Exclude specific prefix variables.
