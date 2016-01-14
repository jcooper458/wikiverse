wikiverse is a powerful content aggregator. Its core functionality is built in Javascript, but sits within a Wordpress theme (based on Sage - http://roots.io) and can be installed on any Wordpress installation (please keep in mind the dependencies mentioned underneath).

The core Javascript file responsible for the content aggregation is called wikiverse.js. Feel free to fork it and improve it. 

License information will follow asap. 

# Important:
wikiverse might not work without these three plugins: 

- Edit Author Slug (can be installed via Wordpress - set the slug to "user")
- the development beta 2 version of WP-API plugin (will soon be obsolete due to integration in WP core)
- wp-twitter-api (my own plugin - needs oauth configuration via the Wordpress backend)

I added my composer.json to automate the installation of these plugins. Follow the bedrock / composer instruction to install the plugins. 

For the rest, just install the theme, and start building boards. Enjoy!

Detailed documentation about the Javascript Plugin will follow!

To install the theme, follow Bedrocks's documentation. In a nutshell, the needed steps to get wikiverse up and running on your server can be synthesized as follows: 

1. Install the bedrock Wordpress boilerplate 
2. Replace the composer.json with mine and run 
3. composer update
4. Install the theme-folder found here
5. Activate and configure the Edit Author Slug plugin to have /user as the slug
6. Activate wp-twitter-api and configure your twitter oauth credentials 
7. Activate WP-API


Links to Bedrock/Sage: 
# [Bedrock](https://roots.io/bedrock/)

# [Sage](https://roots.io/sage/)


