STYLES = styles.css
SCRIPTS = mathedit.min.js

all:

clean:
	rm -f styles.css styles.css.map
	rm -f mathedit.min.js

$(STYLES): styles.sass
	sass styles.sass styles.css

$(SCRIPTS): mathedit.js
	yui-compressor --type js mathedit.js -o mathedit.min.js

compile: $(STYLES) $(SCRIPTS)

sync:	compile
	s3cmd sync index.html mathedit.min.js styles.css s3://ypcs-cdn/pub/$(shell date +%Y/%m/%d/%H%M%S)/
