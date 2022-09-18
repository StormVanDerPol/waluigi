# Make sure /etc/letsencrypt/** have proper write permissions next time
sudo docker run -it --rm --name certbot \
            -v "/$(pwd)/certbot/etc/letsencrypt:/etc/letsencrypt" \
            -v "/$(pwd)/certbot/var/lib/letsencrypt:/var/lib/letsencrypt" \
            -v "/$(pwd)/certbot/var/www/acme:/var/www/acme" \
            certbot/certbot certonly -w /var/www/acme