FROM php:8.4-fpm

LABEL maintainer="Brown Ads"

# Arguments defined in docker-compose.yml
ARG user
ARG uid


# Install system dependencies
RUN apt-get update && apt-get install -y cron supervisor vim\
    build-essential \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libgd-dev \
    jpegoptim optipng pngquant gifsicle \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    net-tools

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*


# Install PHP extensions
RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Xdebug for code coverage
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug


# Download Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

#Running cron
COPY infra/config-cron /etc/cron.d/config-cron
COPY infra/php.ini /usr/local/etc/php/php.ini
COPY infra/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

RUN chmod 0644 /etc/cron.d/config-cron
RUN crontab /etc/cron.d/config-cron

#entrypoint to run supervisor

COPY infra/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh


# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

#SUPERVISOR CONFIG
COPY infra/supervisord.conf /etc/supervisor/conf.d/

# Copy only composer files first for better build cache
COPY composer.json composer.lock /var/www/html/

# Install PHP dependencies
# RUN composer install --no-interaction --prefer-dist --optimize-autoloader --working-dir=/var/www/html


# Now copy the rest of the app
COPY . /var/www

# Set permissions for Laravel and custom folders/files
# RUN chmod -R 777 /var/www/storage/ \
#     && chmod -R 777 /var/www/bootstrap/cache/ \
#     && chmod -R 777 /var/www/resources/lang/ \
#     && chmod -R 777 /var/www/uploads/ \
#     && chmod -R 777 /var/www/Modules/ \
#     && chmod 777 /var/www/modules_statuses.json \
#     && mkdir -p /var/spool/cron /var/log \
#     && touch /var/log/cron.log \
#     && chmod 777 /var/log/cron.log

RUN mkdir -p /var/log/supervisor && chmod -R 777 /var/log/supervisor

RUN mkdir -p /var/run && chmod 777 /var/run

#RUN supervisor
ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]



# Set working directory
WORKDIR /var/www

# Switch to non-root user only after cron and supervisor setup
# USER $user


