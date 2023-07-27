# install nginx magento

docker-compose write permissions

add to Dockerfile

RUN usermod -u 1000 www-data
RUN usermod -G staff www-data

chown -R 33:33 magento/

sudo docker-composer up

// enter php container, enter html root dir
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition magento2
//composer install && composer update -vv
//enter magento account/password with public/private key
//update /root/.composer/auth.json

php ./bin/magento setup:install \
--base-url=http://ip/ \
--db-host=db \
--db-name=magento \
--db-user=magento \
--db-password=pw \
--admin-firstname=Alston \
--admin-lastname=Tsao \
--admin-email=user@example.com \
--admin-user=admin \
--admin-password=admin123 \
--language=en_US \
--currency=USD \
--timezone=America/Chicago \
--use-rewrites=1

ref: write permissions
https://stackoverflow.com/questions/29245216/write-in-shared-volumes-docker
https://www.reddit.com/r/docker/comments/6lmkgz/a_php_docker_permission_problem/
https://serversforhackers.com/c/dckr-file-permissions

https://magento2-blog.com/magento-2-vargeneration-cannot-be-deleted-warning/#comment-356

php bin/magento deploy:mode:set developer

solution: http://devdocs.magento.com/guides/v2.1/install-gde/prereq/nginx.html
