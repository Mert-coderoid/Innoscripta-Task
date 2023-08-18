# Dockerfile

FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zlib1g-dev zip unzip git cron \
    libonig-dev libzip-dev netcat-openbsd \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && a2enmod rewrite
RUN apt-get install -y netcat-openbsd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY . /var/www/html

RUN COMPOSER_VENDOR_DIR="/srv/vendor" composer install

RUN chown -R www-data:www-data /var/www/html

COPY cronjobs /etc/cron.d/cronjobs
RUN chmod 0644 /etc/cron.d/cronjobs
RUN touch /var/log/cron.log

COPY run.sh /run.sh

RUN chmod +x /run.sh

CMD ["/run.sh"]

EXPOSE 80
