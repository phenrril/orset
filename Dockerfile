FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY orset.html /usr/share/caddy/index.html
