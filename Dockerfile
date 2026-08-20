FROM caddy:2.7
COPY Caddyfile /etc/caddy/Caddyfile
COPY orset.html /usr/share/caddy/index.html
COPY assets/ /usr/share/caddy/assets/
COPY robots.txt /usr/share/caddy/robots.txt
COPY sitemap.xml /usr/share/caddy/sitemap.xml
COPY llms.txt /usr/share/caddy/llms.txt
