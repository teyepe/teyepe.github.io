module.exports = {
    plugins: [
        require('postcss-discard-empty'),
        require('postcss-discard-duplicates'),
        require('postcss-merge-rules'),
        require('postcss-merge-longhand'),
        require('postcss-unique-selectors'),
        require('postcss-ordered-values'),
        require('postcss-gap-properties'),
        require('autoprefixer')({
            grid: false
        }),
        require('css-declaration-sorter')({
            order: 'concentric-css'
        }),
        require('css-mqpacker')({
            sort: true
        })
    ]
}
