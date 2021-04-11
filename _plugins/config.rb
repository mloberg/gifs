Jekyll::Hooks.register(:site, :after_init) do |site|
  site.config['search_host'] = ENV['MEILI_HOST'] || 'http://localhost:7700'
  site.config['search_api_key'] = ENV['MEILI_PUBLIC_KEY']
end
