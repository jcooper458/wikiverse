<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/wp/wp-load.php');

ini_set('display_errors', 1);

require_once('TwitterAPIExchange.php');

$twitter_api_options = get_option( 'twitter_api_options' );

/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
$settings = array(
    'oauth_access_token' => $twitter_api_options['oauth_access_token'],
    'oauth_access_token_secret' => $twitter_api_options['oauth_access_token_secret'],
    'consumer_key' => $twitter_api_options['consumer_key'],
    'consumer_secret' => $twitter_api_options['consumer_secret']
);

/** Perform a GET request and echo the response **/
/** Note: Set the GET field BEFORE calling buildOauth(); **/
$url = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield = '?q=' . $_GET['search'];
$requestMethod = 'GET';
$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();