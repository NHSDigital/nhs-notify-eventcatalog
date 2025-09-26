first-time-setup:
	npx --yes @eventcatalog/create-eventcatalog@latest --organization-name "NHS Notify" nhsnotify

build:
	cd src/eventcatalog/nhsnotify  && npm run build

dev:
	cd src/eventcatalog/nhsnotify  && npm run dev

preview:
	cd src/eventcatalog/nhsnotify/dist && npx --yes http-server -p 3001

config:
	cd src/eventcatalog/nhsnotify && npm install
	cd src/validator && npm install

validate:
	cd src/validator && node validate-schema.js