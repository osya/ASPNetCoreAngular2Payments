ASP.NET Core MVC 2.0 & Angular 4 project for testing payments via Stripe & Braintree

[![Build Status](https://travis-ci.org/osya/ASPNetCoreAngular2Payments.svg?branch=master)](https://travis-ci.org/osya/ASPNetCoreAngular2Payments) [![Build status](https://ci.appveyor.com/api/projects/status/ku7kowcfmiei53pi?svg=true)](https://ci.appveyor.com/project/osya/aspnetcoreangular2payments)

# Installation

Before creating Docker container:
 - npm install
 - node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js --env.prod
 - node node_modules/webpack/bin/webpack.js --env.prod

docker-compose up

http://192.168.99.100/