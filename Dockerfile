FROM php:8.1-apache

RUN docker-php-ext-install pdo pdo_mysql

ENV APACHE_DOCUMENT_ROOT /var/www/html/FRONTEND

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf

RUN echo 'Alias /API /var/www/html/API\n\
    <Directory /var/www/html/API>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    </Directory>' > /etc/apache2/conf-available/api-alias.conf \
    && a2enconf api-alias

COPY ./ /var/www/html

EXPOSE 80
