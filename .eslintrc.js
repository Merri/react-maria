module.exports = {
    "extends": "@researchgate/rg-react",
    "parser": "babel-eslint",
    "settings": {
        "import/extensions": [
            ".js",
            ".jsx"
        ]
    },
    "rules": {
        "semi": [
            "error",
            "never"
        ],
        "import/extensions": ["error", "always", { "js": "never", "jsx": "never" }]
    }
}
