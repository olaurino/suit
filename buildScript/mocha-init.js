require('babel-core/register')(
    {
        "presets": [ "es2015","stage-2"],
        "plugins": ["transform-runtime"]
    }
)