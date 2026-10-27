# PocketBase avec les migrations et les hooks du projet.
FROM alpine:3.20
ARG PB_VERSION=0.40.6
RUN apk add --no-cache ca-certificates unzip wget \
 && ARCH=$(case "$(uname -m)" in aarch64) echo arm64;; *) echo amd64;; esac) \
 && wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip" -O /tmp/pb.zip \
 && unzip /tmp/pb.zip pocketbase -d /pb && rm /tmp/pb.zip
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks
EXPOSE 8090
VOLUME /pb/pb_data
# Au démarrage : crée ou met à jour le compte d'administration si PB_SUPERUSER_EMAIL / PB_SUPERUSER_PASSWORD
# sont fournis (Dokploy, onglet Environment), puis lance PocketBase. Les migrations créent tout le contenu.
CMD ["/bin/sh", "-c", "if [ -n \"$PB_SUPERUSER_EMAIL\" ] && [ -n \"$PB_SUPERUSER_PASSWORD\" ]; then /pb/pocketbase superuser upsert \"$PB_SUPERUSER_EMAIL\" \"$PB_SUPERUSER_PASSWORD\" --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations --hooksDir=/pb/pb_hooks; fi; exec /pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data --migrationsDir=/pb/pb_migrations --hooksDir=/pb/pb_hooks"]
