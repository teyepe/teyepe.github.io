require 'kramdown'
require 'builder'

activate :i18n, :mount_at_root => :en
activate :directory_indexes
activate :search_engine_sitemap
activate :imageoptim
activate :meta_tags
activate :external_pipeline,
    name: :webpack,
    command: build? ?  "yarn build:prod" : "yarn build:dev",
    source: '.tmp/dist',
    latency: 1

# activate :google_analytics do |ga|
#     ga.tracking_id = 'UA-26630868-1'
# end

set :url_root, 'https://teyepe.com/'
set :css_dir, 'assets/css/'
set :js_dir, 'assets/js/'
set :images_dir, 'assets/img/'
set :fonts_dir, 'assets/type/'

set :relative_links, true
set :markdown_engine, :kramdown
set :markdown, 
    :parse_block_html => true,
    :fenced_code_blocks => true, 
    :smartypants => true,
    :tables => true, 
    :superscript => true, 
    :underline => true, 
    :highlight => true, 
    :quote => true

# Reload the browser automatically whenever files change
configure :development do
    set :protocol, 'http://'
    set :host, 'localhost'
    set :port, '4567'

    activate :livereload
end

# Build-specific configuration
configure :build do
    set :trailing_slash, false
    set :protocol, 'https://'
    set :host, 'teyepe.com'

    activate :relative_assets
    activate :asset_hash, :ignore => %w(.png .ttf .otf .woff .woff2 .eot)
    activate :gzip, exts: %w(.js .css .html .htm .svg .ttf .otf .woff .eot)


    activate :minify_html do |html|
        html.remove_quotes = false
        html.remove_intertag_spaces = true
    end
end

activate :deploy do |deploy|
    deploy.deploy_method = :git
    deploy.path = '/'
    deploy.branch = 'master'
    deploy.build_before = false
end

helpers do

    def permalink_helper(article = nil)
        if article.nil?
            data.site.url + current_page.url.gsub("index.html", "")
        else
            "#{data.site.url}#{article.url}"
        end
    end

    def nav_active(path)
        current_page.path == path ? 'is-active' : ''
    end

    def link_to_page name, url, mmclass
        path = path
        current = path =~ Regexp.new('^' + url[(1..-1)])

        if path == 'index' and name == ''
            current = true
        end

        class_name = current ? 'is-active' : ''

        "<a class='#{ mmclass } #{ class_name }' href=\"#{url}\">#{name}</a>"
    end
end

