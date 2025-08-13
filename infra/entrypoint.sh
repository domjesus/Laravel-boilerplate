#!/bin/bash
set -e

# Start cron only once
service cron start

# Start supervisor in foreground (it will manage php-fpm and other processes)
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf