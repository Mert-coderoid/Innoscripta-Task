#!/bin/bash

# DB'nin hazır olup olmadığını kontrol eder
while ! nc -z db 3306; do
  echo "Waiting for MySQL server..."
  sleep 1
done

sleep 5

cd /var/www/html

php artisan migrate:fresh --seed

service cron start

echo "0 */12 * * * /usr/local/bin/php /var/www/html/artisan articles:fetch >> /var/log/cron.log 2>&1" | crontab -

sleep 5

php /var/www/html/artisan articles:fetch >> /var/log/cron.log 2>&1

apache2-foreground
